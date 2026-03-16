import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  // All risks (exclude DRAFT)
  const risks = await prisma.risk.findMany({
    where: { status: { not: "DRAFT" } },
    include: {
      reportedBy: { select: { id: true, name: true, avatar: true, department: true } },
      assignedTo: { select: { id: true, name: true, avatar: true } },
      controls: {
        select: { id: true, adequacy: true, type: true, effectivenessRating: true },
      },
      _count: { select: { controls: true, tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const controls = await prisma.control.findMany({
    select: { id: true, adequacy: true, effectivenessRating: true, type: true },
  });

  const tasks = await prisma.task.findMany({
    select: { id: true, status: true, isOverdue: true, dueDate: true },
  });

  // Stats
  const totalRisks = risks.length;
  const highResidual = risks.filter(
    (r) => r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL"
  ).length;
  const inadequateControls = controls.filter(
    (c) => c.adequacy === "Inadequate" || c.adequacy === "Needs Improvement"
  ).length;
  const pendingReview = risks.filter(
    (r) => r.status === "SUBMITTED" || r.status === "IN_REVIEW"
  ).length;
  const mitigated = risks.filter((r) => r.status === "MITIGATED").length;

  // Fraud risks
  const fraudRisks = risks.filter((r) => r.fraudRisk);
  const fraudByCategory: Record<string, number> = {};
  fraudRisks.forEach((r) => {
    if (r.fraudCategory1) fraudByCategory[r.fraudCategory1] = (fraudByCategory[r.fraudCategory1] || 0) + 1;
    if (r.fraudCategory2) fraudByCategory[r.fraudCategory2] = (fraudByCategory[r.fraudCategory2] || 0) + 1;
  });

  // Heat map: 5x5 grid [likelihood][impact] = count
  const heatMap: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0));
  risks.forEach((r) => {
    if (r.likelihood >= 1 && r.likelihood <= 5 && r.impact >= 1 && r.impact <= 5) {
      heatMap[r.likelihood - 1][r.impact - 1]++;
    }
  });

  // Control adequacy breakdown
  const controlAdequacy = {
    effective: controls.filter((c) => c.adequacy === "Adequate" || (c.effectivenessRating && c.effectivenessRating >= 4)).length,
    partiallyEffective: controls.filter((c) => c.adequacy === "Needs Improvement" || (c.effectivenessRating && c.effectivenessRating >= 2 && c.effectivenessRating < 4)).length,
    ineffective: controls.filter((c) => c.adequacy === "Inadequate" || (c.effectivenessRating && c.effectivenessRating < 2)).length,
    notAssessed: controls.filter((c) => !c.adequacy && !c.effectivenessRating).length,
    total: controls.length,
  };

  // Risks by department
  const byDepartment: Record<string, { inherent: number; gross: number; residual: number; count: number }> = {};
  risks.forEach((r) => {
    if (!byDepartment[r.department]) {
      byDepartment[r.department] = { inherent: 0, gross: 0, residual: 0, count: 0 };
    }
    byDepartment[r.department].inherent += r.inherentScore;
    byDepartment[r.department].gross += r.grossScore || r.inherentScore;
    byDepartment[r.department].residual += Math.max(1, r.inherentScore - (r.controls.length * 2));
    byDepartment[r.department].count++;
  });

  // Risks by category
  const byCategory: Record<string, number> = {};
  risks.forEach((r) => {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
  });

  // Risks by status
  const byStatus: Record<string, number> = {};
  risks.forEach((r) => {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  });

  // Recent high-priority risks
  const recentHighPriority = risks
    .filter((r) => r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL")
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      riskId: r.riskId,
      title: r.title,
      category: r.category,
      department: r.department,
      inherentScore: r.inherentScore,
      grossScore: r.grossScore || r.inherentScore,
      residualScore: Math.max(1, r.inherentScore - (r.controls.length * 2)),
      riskLevel: r.riskLevel,
      status: r.status,
      controlCount: r._count.controls,
      controlAdequacy: r.controls.length > 0
        ? r.controls.some((c) => c.adequacy === "Inadequate") ? "Partial" : "Effective"
        : "None",
      reportedBy: r.reportedBy,
      strategicObjective: r.strategicObjective,
    }));

  // Strategic objectives breakdown
  const byObjective: Record<string, { count: number; highSeverity: number; avgScore: number }> = {};
  risks.forEach((r) => {
    const obj = r.strategicObjective || "Unassigned";
    if (!byObjective[obj]) byObjective[obj] = { count: 0, highSeverity: 0, avgScore: 0 };
    byObjective[obj].count++;
    if (r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL") byObjective[obj].highSeverity++;
    byObjective[obj].avgScore += r.inherentScore;
  });
  Object.keys(byObjective).forEach((k) => {
    byObjective[k].avgScore = Math.round((byObjective[k].avgScore / byObjective[k].count) * 10) / 10;
  });

  // Task stats
  const overdueTasks = tasks.filter((t) => t.isOverdue || (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "COMPLETED")).length;

  return NextResponse.json({
    stats: { totalRisks, highResidual, inadequateControls, pendingReview, mitigated },
    fraudRisks: { total: fraudRisks.length, byCategory: fraudByCategory },
    heatMap,
    controlAdequacy,
    byDepartment,
    byCategory,
    byStatus,
    recentHighPriority,
    byObjective,
    taskStats: { total: tasks.length, overdue: overdueTasks },
  });
}
