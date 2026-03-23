import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const taskId = formData.get("taskId") as string | null;

    if (!file || !taskId) {
      return NextResponse.json(
        { error: "file and taskId are required" },
        { status: 400 }
      );
    }

    // Find the task by taskId
    const task = await prisma.task.findUnique({ where: { taskId } });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Save file to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    // Format file size
    const sizeKB = Math.round(file.size / 1024);
    const fileSize = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    // Create evidence record
    const evidence = await prisma.evidence.create({
      data: {
        fileName: file.name,
        fileSize,
        fileType: file.type || null,
        url: `/uploads/${uniqueName}`,
        taskId: task.id,
      },
    });

    return NextResponse.json(evidence);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    const evidence = await prisma.evidence.findUnique({ where: { id } });
    if (!evidence) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete physical file if it exists
    if (evidence.url) {
      try {
        const filePath = path.join(process.cwd(), "public", evidence.url);
        await unlink(filePath);
      } catch { /* file may not exist */ }
    }

    await prisma.evidence.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
