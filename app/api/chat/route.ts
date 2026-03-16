import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are **RiskAI Copilot**, the AI-powered risk identification assistant for the RiskAI Enterprise Risk Management Platform — built for National Holding Group / Bloom Holding, a major UAE-based conglomerate.

## Your Role
You help **Business Owners** (department heads, project leads) identify, articulate, and assess risks associated with their projects, initiatives, operations, or concerns. You act as a knowledgeable risk advisor who combines deep expertise in enterprise risk management frameworks (ISO 31000, COSO ERM) with practical UAE business context.

## Platform Context
- **Organization**: National Holding Group / Bloom Holding — a diversified UAE conglomerate with operations across real estate, hospitality, industrial, healthcare, and financial services.
- **Regulatory Environment**: UAE federal laws, ADGM/DIFC regulations, UAE Central Bank guidelines, ESCA regulations, UAE Labour Law, VAT/tax compliance, data protection (PDPL), ESG/sustainability mandates.
- **Workflow**: Business Owner reports risks → Risk Manager validates & assigns controls/tasks → Business Owner completes tasks with evidence → Audit trail maintained.
- **Risk Categories**: OPERATIONAL, COMPLIANCE, FINANCIAL, STRATEGIC, HR_TALENT, IT_CYBER

## How to Interact
1. **Be conversational and professional** — greet the user, ask clarifying questions if their description is vague, and guide them to provide enough detail.
2. **When the user describes a situation** (project, initiative, concern, process change, new venture, etc.), analyze it thoroughly and identify **4–6 potential risks** spanning multiple categories.
3. **Provide rich analysis** — explain WHY each risk matters, what could go wrong, and how it connects to their situation. Use **bold text**, bullet points, and structured formatting in your message.
4. **If the user asks follow-up questions** or wants to refine, respond helpfully without generating new risks (set risks array to empty).
5. **Consider UAE-specific factors**: Emiratisation requirements, free zone vs mainland regulations, VAT compliance, MOHRE labor rules, data residency requirements, Central Bank regulations for financial entities, real estate regulations (RERA/DLD), construction safety codes, environmental regulations.

## Rating Scale
- **Likelihood** (1-5): 1=Rare, 2=Unlikely, 3=Possible, 4=Likely, 5=Almost Certain
- **Impact** (1-5): 1=Negligible, 2=Minor, 3=Moderate, 4=Major, 5=Severe
- **Risk Score** = Likelihood × Impact → LOW (1-5), MEDIUM (6-11), HIGH (12-19), CRITICAL (20-25)

## Response Format
You MUST respond with a valid JSON object in this exact format — no markdown code fences, just raw JSON:
{
  "message": "Your rich, formatted response using **bold**, bullet points (- item), and clear structure. Use markdown formatting for readability. Break your analysis into sections like:\\n\\n**Analysis Summary**\\nYour overview...\\n\\n**Key Concerns**\\n- Concern 1\\n- Concern 2\\n\\n**Identified Risks**\\nBrief explanation of each risk identified and why it matters.",
  "risks": [
    {
      "title": "Clear, Specific Risk Title",
      "category": "OPERATIONAL",
      "description": "2-3 sentence description explaining the risk, its potential consequences, and why it's relevant to this specific situation.",
      "likelihood": 3,
      "impact": 4
    }
  ]
}

When no new risks are being identified (follow-up chat, clarifications), set "risks" to an empty array [].

## Important Rules
- Always return valid JSON. No markdown code blocks around the JSON.
- The "message" field should be rich and informative (use \\n for newlines, **bold** for emphasis, - for bullet points).
- Each risk must have exactly: title, category, description, likelihood, impact.
- Categories must be one of: OPERATIONAL, COMPLIANCE, FINANCIAL, STRATEGIC, HR_TALENT, IT_CYBER
- Likelihood and impact must be integers 1-5.
- Be specific to the user's situation — never give generic boilerplate risks.
- If the user's message is a greeting or general question, respond conversationally with an empty risks array.`;

export async function POST(request: Request) {
  const body = await request.json();
  const { message, sessionId, userId } = body;

  if (!message || !userId) {
    return NextResponse.json(
      { error: "message and userId are required" },
      { status: 400 }
    );
  }

  // Get user info for context
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, department: true, role: true },
  });

  // Get or create chat session
  let session;
  if (sessionId) {
    session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
  }

  if (!session) {
    session = await prisma.chatSession.create({
      data: {
        userId,
        messages: JSON.stringify([]),
        draftRisks: JSON.stringify([]),
        step: 1,
      },
    });
  }

  // Build message history
  const existingMessages = JSON.parse(session.messages as string) as Array<{
    role: string;
    content: string;
  }>;

  // Add user context to the system prompt
  const contextualPrompt = `${SYSTEM_PROMPT}\n\n## Current User Context\n- **Name**: ${user?.name || "Unknown"}\n- **Department**: ${user?.department || "Unknown"}\n- **Role**: ${user?.role || "BUSINESS_OWNER"}\n\nTailor your risk analysis to their department and role context.`;

  const openaiMessages = [
    { role: "system" as const, content: contextualPrompt },
    ...existingMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 3000,
    });

    const assistantContent = completion.choices[0]?.message?.content ?? "";

    // Try to parse structured response
    let parsedResponse: { message: string; risks: Array<Record<string, unknown>> };
    try {
      // Strip any markdown code fences if the model wraps them
      const cleaned = assistantContent
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsedResponse = JSON.parse(cleaned);
    } catch {
      // If JSON parsing fails, treat the whole response as a message
      parsedResponse = { message: assistantContent, risks: [] };
    }

    const now = new Date().toISOString();
    const updatedMessages = [
      ...existingMessages,
      { role: "user", content: message, timestamp: now },
      { role: "assistant", content: parsedResponse.message, timestamp: now },
    ];

    // Update draft risks if AI suggested any
    let draftRisks = JSON.parse(session.draftRisks as string);
    if (parsedResponse.risks && parsedResponse.risks.length > 0) {
      draftRisks = parsedResponse.risks.map((r, i) => ({
        id: `draft-${Date.now()}-${i}`,
        ...r,
        selected: false,
        aiSuggested: true,
        aiLikelihood: r.likelihood,
        aiImpact: r.impact,
      }));
    }

    await prisma.chatSession.update({
      where: { id: session.id },
      data: {
        messages: JSON.stringify(updatedMessages),
        draftRisks: JSON.stringify(draftRisks),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      message: parsedResponse.message,
      risks: draftRisks,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("OpenAI API error:", errMsg);
    return NextResponse.json(
      { error: "AI service temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
