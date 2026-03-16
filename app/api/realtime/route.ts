import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    // Create an ephemeral token for the Realtime API session
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "verse",
          instructions: `You are RiskAI Voice Assistant, an AI-powered risk management advisor for National Holding Group / Bloom Holding — a major UAE-based conglomerate.

You help Business Owners understand risk management concepts, navigate the RiskAI platform, and get quick guidance on:
- How to report risks using the AI copilot chat
- Understanding risk categories (Operational, Compliance, Financial, Strategic, HR & Talent, IT & Cyber)
- Risk assessment methodology (likelihood × impact scoring, 1-5 scale)
- UAE-specific regulatory context (MOHRE, ADGM, DIFC, Central Bank, RERA, data protection PDPL)
- ISO 31000 and COSO ERM framework basics
- How controls and tasks work in the risk lifecycle
- Evidence requirements for task completion

Be concise, professional, and helpful. Speak naturally as a knowledgeable risk advisor. When discussing risk ratings, explain the 5×5 matrix: Likelihood (Rare to Almost Certain) × Impact (Negligible to Severe). Risk levels: LOW (1-5), MEDIUM (6-11), HIGH (12-19), CRITICAL (20-25).

If the user asks about something outside risk management, politely redirect them back to how you can help with risk-related topics.`,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI Realtime session error:", errorText);
      return NextResponse.json(
        { error: "Failed to create realtime session" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Realtime session error:", error);
    return NextResponse.json(
      { error: "Failed to create realtime session" },
      { status: 500 }
    );
  }
}
