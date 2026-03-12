import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPTS: Record<string, string> = {
  'risk-copilot': `You are an AI Risk Copilot for an enterprise risk management platform. Your role is to help business owners identify and document risks in a structured way.

When a user describes a concern, respond in 2-3 sentences acknowledging their concern, then provide a brief structured risk assessment. Keep responses concise and practical.

After identifying the risk, suggest:
- The risk category (Financial/Operational/Technology/Compliance)
- A likelihood score (1-5) and impact score (1-5)
- 2-3 relevant controls (Directive/Preventive/Detective/Corrective)

Always mention source attribution like [SEC Guidelines], [ISO 31000], or [Risk Library] for credibility.
Format your response conversationally, not as bullet points.`,

  'review-assistant': `You are an AI Risk Review Assistant helping Risk Managers validate and review submitted risks.
Provide analysis of risk quality, scoring accuracy, and control appropriateness.
Keep responses concise and actionable.`,
}

export async function POST(request: NextRequest) {
  try {
    const { message, role = 'risk-copilot', history = [] } = await request.json()

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Mock response for demo without API key
      const mockResponses: Record<string, string> = {
        'vendor': "That's a significant concern! Based on your description, I'm identifying this as a **Vendor Payment Fraud** risk. This falls under Financial > Fraud > External Fraud category [SEC Guidelines]. I'd suggest a Likelihood score of 4/5 and Impact of 4/5, giving an Inherent Risk Score of 16 (HIGH). I recommend the following controls: a Vendor Verification Workflow (Preventive), Dual-Approval Payment Process (Preventive), and Monthly Transaction Reconciliation (Detective) [Risk Library]. Shall I generate the full risk entry?",
        'access': "Good catch! I'm classifying this as an **Unauthorized System Access** risk under Technology > Security > Access Control [ISO 27001]. With a Likelihood of 3/5 and Impact of 5/5, this has an Inherent Score of 15 (HIGH). Key controls to implement: Role-Based Access Control (Preventive), Multi-Factor Authentication (Preventive), and Access Log Monitoring (Detective) [Risk Library]. Want me to draft the complete risk record?",
        'default': "I understand your concern. Based on what you've described, this appears to be a significant operational risk [ISO 31000]. I'll structure this as a formal risk entry with appropriate controls. Could you provide a bit more detail about the specific process or system involved? This will help me generate more accurate control recommendations.",
      }

      const lowerMsg = message.toLowerCase()
      let response = mockResponses['default']
      if (lowerMsg.includes('vendor') || lowerMsg.includes('payment') || lowerMsg.includes('fraud')) {
        response = mockResponses['vendor']
      } else if (lowerMsg.includes('access') || lowerMsg.includes('unauthorized') || lowerMsg.includes('security')) {
        response = mockResponses['access']
      }

      return NextResponse.json({ response })
    }

    const systemPrompt = SYSTEM_PROMPTS[role] || SYSTEM_PROMPTS['risk-copilot']

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 400,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'
    return NextResponse.json({ response })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { response: "I'm having trouble connecting to the AI service. Please try again in a moment." },
      { status: 200 }
    )
  }
}
