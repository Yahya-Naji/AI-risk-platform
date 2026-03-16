import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! } as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🗑️  Clearing existing data...");
  await prisma.comment.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.task.deleteMany();
  await prisma.control.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Creating users...");

  const sarah = await prisma.user.create({
    data: {
      name: "Sarah Lee",
      email: "sarah.lee@bloomholding.com",
      role: "BUSINESS_OWNER",
      department: "Finance Department",
      company: "Bloom Holding",
      group: "National Holding Group",
      avatar: "SL",
    },
  });

  const ahmed = await prisma.user.create({
    data: {
      name: "Ahmed Al-Rashid",
      email: "ahmed.rashid@bloomholding.com",
      role: "RISK_MANAGER",
      department: "Risk Management",
      company: "Bloom Holding",
      group: "National Holding Group",
      avatar: "AR",
    },
  });

  const fatima = await prisma.user.create({
    data: {
      name: "Fatima Hassan",
      email: "fatima.hassan@bloomholding.com",
      role: "BUSINESS_OWNER",
      department: "Information Technology",
      company: "Bloom Holding",
      group: "National Holding Group",
      avatar: "FH",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Omar Khalil",
      email: "omar.khalil@bloomholding.com",
      role: "ADMIN",
      department: "Corporate Governance",
      company: "Bloom Holding",
      group: "National Holding Group",
      avatar: "OK",
    },
  });

  console.log("⚠️  Creating risks...");

  // ─── Risks from Excel (IT Department - Bloom Holding) ─────────────────
  const riskIT1 = await prisma.risk.create({
    data: {
      riskId: "BH-IT-1",
      title: "IT Steering Committee",
      description:
        "Inconsistent and ineffective IT activities and procedures carried out due to lack of central oversight over IT departments of group entities.",
      category: "OPERATIONAL",
      subcategoryL2: "Information Technology",
      subcategoryL3: "Governance",
      department: "Information Technology",
      process: "IT Governance",
      likelihood: 3,
      impact: 4,
      inherentScore: 12,
      riskLevel: "MEDIUM",
      riskOwner: "Director of IT",
      status: "VALIDATED",
      reportedById: fatima.id,
      assignedToId: ahmed.id,
      strategicObjective:
        "Maintain and expand the current portfolio of real estate developments",
    },
  });

  const riskIT2 = await prisma.risk.create({
    data: {
      riskId: "BH-IT-2",
      title: "IT Strategy",
      description:
        "Inability to achieve corporate objectives that are dependent on technology and/or ineffective spend over IT assets and infrastructure due to lack of / inadequate IT strategy or misalignment of IT strategy with corporate strategy.",
      category: "OPERATIONAL",
      subcategoryL2: "Information Technology",
      subcategoryL3: "Governance",
      department: "Information Technology",
      process: "IT Governance",
      likelihood: 3,
      impact: 3,
      inherentScore: 9,
      riskLevel: "MEDIUM",
      riskOwner: "Director of IT",
      status: "VALIDATED",
      reportedById: fatima.id,
      assignedToId: ahmed.id,
    },
  });

  const riskIT3 = await prisma.risk.create({
    data: {
      riskId: "BH-IT-3",
      title: "IT Policies and Procedures",
      description:
        "Lack of direction and inconsistency of IT operations due to incomprehensive IT policy and procedures.",
      category: "OPERATIONAL",
      subcategoryL2: "Information Technology",
      subcategoryL3: "Governance",
      department: "Information Technology",
      process: "IT Governance",
      likelihood: 2,
      impact: 3,
      inherentScore: 6,
      riskLevel: "LOW",
      riskOwner: "Director of IT",
      status: "VALIDATED",
      reportedById: fatima.id,
      assignedToId: ahmed.id,
    },
  });

  // ─── Risks for Finance (Sarah's department) ─────────────────────────
  const riskFin1 = await prisma.risk.create({
    data: {
      riskId: "RSK-046",
      title: "Vendor Payment Fraud",
      description:
        "Risk of fraudulent vendor payments due to inadequate verification processes, potentially leading to financial losses and reputational damage.",
      category: "FINANCIAL",
      department: "Finance Department",
      process: "Accounts Payable",
      likelihood: 4,
      impact: 4,
      inherentScore: 16,
      riskLevel: "HIGH",
      fraudRisk: true,
      fraudCategory1: "Asset Misappropriation",
      fraudCategory2: "Billing Schemes",
      fraudDescription:
        "Fictitious vendor invoices or duplicate payments to colluding vendors",
      status: "VALIDATED",
      reportedById: sarah.id,
      assignedToId: ahmed.id,
    },
  });

  const riskFin2 = await prisma.risk.create({
    data: {
      riskId: "RSK-042",
      title: "Budget Forecasting Accuracy",
      description:
        "Inaccurate budget forecasting leading to significant variances between planned and actual expenditure, impacting strategic decision-making.",
      category: "FINANCIAL",
      department: "Finance Department",
      process: "Financial Planning",
      likelihood: 3,
      impact: 5,
      inherentScore: 15,
      riskLevel: "HIGH",
      status: "VALIDATED",
      reportedById: sarah.id,
      assignedToId: ahmed.id,
    },
  });

  const riskFin3 = await prisma.risk.create({
    data: {
      riskId: "RSK-052",
      title: "Payment Authorization Bypass",
      description:
        "Risk of unauthorized payments being processed due to inadequate segregation of duties and weak authorization controls in the payment workflow.",
      category: "OPERATIONAL",
      department: "Finance Department",
      process: "Treasury",
      likelihood: 3,
      impact: 4,
      inherentScore: 12,
      riskLevel: "MEDIUM",
      status: "VALIDATED",
      reportedById: sarah.id,
      assignedToId: ahmed.id,
    },
  });

  const riskFin4 = await prisma.risk.create({
    data: {
      riskId: "RSK-048",
      title: "Unauthorized System Access",
      description:
        "Risk of unauthorized access to financial systems due to weak access controls and lack of periodic access reviews.",
      category: "IT_CYBER",
      department: "Finance Department",
      process: "IT Security",
      likelihood: 3,
      impact: 4,
      inherentScore: 12,
      riskLevel: "MEDIUM",
      status: "IN_REVIEW",
      reportedById: sarah.id,
      assignedToId: ahmed.id,
    },
  });

  const riskFin5 = await prisma.risk.create({
    data: {
      riskId: "RSK-044",
      title: "Invoice Processing Errors",
      description:
        "Risk of errors in invoice processing leading to incorrect payments, duplicate payments, or missed early payment discounts.",
      category: "OPERATIONAL",
      department: "Finance Department",
      process: "Accounts Payable",
      likelihood: 2,
      impact: 3,
      inherentScore: 6,
      riskLevel: "LOW",
      status: "MITIGATED",
      reportedById: sarah.id,
      assignedToId: ahmed.id,
    },
  });

  // ─── Draft/Submitted risks (for Report New Risk flow) ─────────────────
  const riskDraft1 = await prisma.risk.create({
    data: {
      riskId: "RSK-061",
      title: "Regional Office Setup Delays",
      description:
        "Risk of delays in facility setup, equipment procurement, and operational readiness affecting the Q2 launch timeline for the Abu Dhabi regional office.",
      category: "OPERATIONAL",
      department: "Finance Department",
      likelihood: 3,
      impact: 4,
      inherentScore: 12,
      riskLevel: "MEDIUM",
      aiSuggested: true,
      aiLikelihood: 3,
      aiImpact: 4,
      notes:
        "Timeline is aggressive given current market conditions for commercial real estate in Abu Dhabi.",
      status: "SUBMITTED",
      reportedById: sarah.id,
      assignedToId: ahmed.id,
    },
  });

  const riskDraft2 = await prisma.risk.create({
    data: {
      riskId: "RSK-062",
      title: "UAE Regulatory & Licensing Requirements",
      description:
        "Risk of non-compliance with local business licensing, labor laws (WPS), tax registration (VAT), and industry-specific permits required for financial services operations in the UAE.",
      category: "COMPLIANCE",
      department: "Finance Department",
      likelihood: 4,
      impact: 5,
      inherentScore: 20,
      riskLevel: "HIGH",
      aiSuggested: true,
      aiLikelihood: 4,
      aiImpact: 5,
      status: "SUBMITTED",
      reportedById: sarah.id,
      assignedToId: ahmed.id,
    },
  });

  console.log("🛡️  Creating controls...");

  // Controls for Vendor Payment Fraud (RSK-046)
  const ctl1 = await prisma.control.create({
    data: {
      controlId: "CTL-001",
      description: "Dual-Approval Payment Process",
      type: "PREVENTIVE",
      designRating: 4,
      effectivenessRating: 3,
      totalRating: 12,
      adequacy: "Adequate",
      riskId: riskFin1.id,
    },
  });

  const ctl2 = await prisma.control.create({
    data: {
      controlId: "CTL-002",
      description: "Vendor Verification Workflow",
      type: "PREVENTIVE",
      designRating: 3,
      effectivenessRating: 3,
      totalRating: 9,
      adequacy: "Needs Improvement",
      riskId: riskFin1.id,
    },
  });

  // Controls for Budget Forecasting (RSK-042)
  const ctl3 = await prisma.control.create({
    data: {
      controlId: "CTL-003",
      description: "Monthly Transaction Reconciliation",
      type: "DETECTIVE",
      designRating: 4,
      effectivenessRating: 4,
      totalRating: 16,
      adequacy: "Adequate",
      riskId: riskFin2.id,
    },
  });

  // Controls for Payment Authorization (RSK-052)
  const ctl4 = await prisma.control.create({
    data: {
      controlId: "CTL-004",
      description: "Implement Dual-Approval Workflow",
      type: "PREVENTIVE",
      designRating: 4,
      effectivenessRating: 3,
      totalRating: 12,
      adequacy: "Adequate",
      riskId: riskFin3.id,
    },
  });

  // Controls for Unauthorized Access (RSK-048)
  const ctl5 = await prisma.control.create({
    data: {
      controlId: "CTL-005",
      description: "Access Rights Review Documentation",
      type: "DETECTIVE",
      designRating: 3,
      effectivenessRating: 2,
      totalRating: 6,
      adequacy: "Needs Improvement",
      riskId: riskFin4.id,
    },
  });

  // Controls for Invoice Processing (RSK-044)
  const ctl6 = await prisma.control.create({
    data: {
      controlId: "CTL-006",
      description: "Invoice Matching Control Test",
      type: "PREVENTIVE",
      designRating: 4,
      effectivenessRating: 4,
      totalRating: 16,
      adequacy: "Adequate",
      riskId: riskFin5.id,
    },
  });

  // Controls for IT risks
  const ctl7 = await prisma.control.create({
    data: {
      controlId: "CTL-007",
      description: "IT Governance Framework Review",
      type: "PREVENTIVE",
      designRating: 3,
      effectivenessRating: 2,
      totalRating: 6,
      adequacy: "Needs Improvement",
      riskId: riskIT1.id,
    },
  });

  const ctl8 = await prisma.control.create({
    data: {
      controlId: "CTL-008",
      description: "Data Classification Policy",
      type: "PREVENTIVE",
      designRating: 3,
      effectivenessRating: 3,
      totalRating: 9,
      adequacy: "Adequate",
      riskId: riskIT2.id,
    },
  });

  console.log("📋 Creating tasks...");

  // Tasks for Sarah (Business Owner - Finance)
  const task1 = await prisma.task.create({
    data: {
      taskId: "TSK-001",
      title: "Upload Q1 Control Testing Evidence",
      description:
        "Upload evidence of Q1 control testing for dual-approval payment process. Include test results, sample transactions, and exception reports.",
      status: "OVERDUE",
      dueDate: new Date("2026-03-05"),
      isOverdue: true,
      riskId: riskFin1.id,
      controlId: ctl1.id,
      assignedToId: sarah.id,
      evidenceCount: 2,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      taskId: "TSK-002",
      title: "Daily Reconciliation Report Setup",
      description:
        "Set up automated daily reconciliation reports for vendor payments. Configure the report template and distribution list.",
      status: "CHANGES_REQUESTED",
      dueDate: new Date("2026-03-15"),
      isOverdue: false,
      riskId: riskFin1.id,
      controlId: ctl2.id,
      assignedToId: sarah.id,
      evidenceCount: 1,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      taskId: "TSK-003",
      title: "Complete Budget Variance Control Assessment",
      description:
        "Complete the control assessment for budget variance monitoring. Document current effectiveness and identify gaps.",
      status: "OVERDUE",
      dueDate: new Date("2026-03-08"),
      isOverdue: true,
      riskId: riskFin2.id,
      controlId: ctl3.id,
      assignedToId: sarah.id,
      evidenceCount: 0,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      taskId: "TSK-004",
      title: "Implement Dual-Approval Workflow",
      description:
        "Implement the dual-approval workflow for all payments above AED 50,000. Document the workflow configuration and approval matrix.",
      status: "IN_PROGRESS",
      dueDate: new Date("2026-04-15"),
      isOverdue: false,
      riskId: riskFin3.id,
      controlId: ctl4.id,
      assignedToId: sarah.id,
      evidenceCount: 0,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      taskId: "TSK-005",
      title: "Access Rights Review Documentation",
      description:
        "Document the current access rights for all financial systems. Include user roles, permissions, and last review dates.",
      status: "PENDING",
      dueDate: new Date("2026-04-20"),
      isOverdue: false,
      riskId: riskFin4.id,
      controlId: ctl5.id,
      assignedToId: sarah.id,
      evidenceCount: 0,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      taskId: "TSK-006",
      title: "Invoice Matching Control Test",
      description:
        "Perform three-way matching test on a sample of 50 invoices. Document results and any exceptions found.",
      status: "SUBMITTED",
      dueDate: new Date("2026-03-20"),
      isOverdue: false,
      riskId: riskFin5.id,
      controlId: ctl6.id,
      assignedToId: sarah.id,
      evidenceCount: 3,
    },
  });

  console.log("📎 Creating evidence...");

  await prisma.evidence.createMany({
    data: [
      {
        fileName: "Q1_Payment_Approval_Log.xlsx",
        fileSize: "2.4 MB",
        fileType: "xlsx",
        taskId: task1.id,
      },
      {
        fileName: "Dual_Approval_Test_Results.pdf",
        fileSize: "1.1 MB",
        fileType: "pdf",
        taskId: task1.id,
      },
      {
        fileName: "Reconciliation_Template_v2.xlsx",
        fileSize: "890 KB",
        fileType: "xlsx",
        taskId: task2.id,
      },
      {
        fileName: "Invoice_Match_Sample_50.xlsx",
        fileSize: "3.2 MB",
        fileType: "xlsx",
        taskId: task6.id,
      },
      {
        fileName: "Three_Way_Match_Report.pdf",
        fileSize: "1.8 MB",
        fileType: "pdf",
        taskId: task6.id,
      },
      {
        fileName: "Exception_Summary_Q1.pdf",
        fileSize: "456 KB",
        fileType: "pdf",
        taskId: task6.id,
      },
    ],
  });

  console.log("💬 Creating comments...");

  await prisma.comment.createMany({
    data: [
      {
        content:
          "Please ensure the Q1 evidence includes the full approval chain for transactions above AED 50,000.",
        taskId: task1.id,
        userId: ahmed.id,
      },
      {
        content:
          "Uploaded the payment approval log. Working on the exception report now.",
        taskId: task1.id,
        userId: sarah.id,
      },
      {
        content:
          "The reconciliation template needs to include foreign currency transactions. Please revise and resubmit.",
        taskId: task2.id,
        userId: ahmed.id,
      },
      {
        content:
          "Good work on the invoice matching. The sample size meets our requirements. Moving to review.",
        taskId: task6.id,
        userId: ahmed.id,
      },
    ],
  });

  console.log("🤖 Creating chat session...");

  await prisma.chatSession.create({
    data: {
      userId: sarah.id,
      step: 3,
      messages: JSON.stringify([
        {
          role: "assistant",
          content:
            "👋 Hello Sarah! Tell me about a project, initiative, or situation you'd like to assess for risks. I'll analyze it and identify all potential risks for you to review.",
          timestamp: "2026-03-16T10:15:00Z",
        },
        {
          role: "user",
          content:
            "We're planning to open a new regional office in Abu Dhabi next quarter. This involves setting up facilities, hiring local staff, and integrating with our existing systems.",
          timestamp: "2026-03-16T10:18:00Z",
        },
        {
          role: "assistant",
          content:
            "I've analyzed your Abu Dhabi expansion initiative and identified 6 potential risks. Select the ones you'd like to report.",
          timestamp: "2026-03-16T10:18:30Z",
        },
      ]),
      draftRisks: JSON.stringify([
        {
          id: "draft-1",
          title: "Regional Office Setup Delays",
          category: "OPERATIONAL",
          description:
            "Risk of delays in facility setup, equipment procurement, and operational readiness affecting launch timeline.",
          selected: true,
          aiSuggested: true,
        },
        {
          id: "draft-2",
          title: "UAE Regulatory & Licensing Requirements",
          category: "COMPLIANCE",
          description:
            "Risk of non-compliance with local business licensing, labor laws, tax registration, and industry-specific permits.",
          selected: true,
          aiSuggested: true,
        },
        {
          id: "draft-3",
          title: "Budget Overrun & Cost Escalation",
          category: "FINANCIAL",
          description:
            "Risk of exceeding allocated budget due to unforeseen expenses, currency fluctuations, or scope creep.",
          selected: false,
          aiSuggested: true,
        },
        {
          id: "draft-4",
          title: "Local Talent Acquisition Challenges",
          category: "HR_TALENT",
          description:
            "Difficulty recruiting qualified local talent or relocating existing staff, impacting operational capacity.",
          selected: false,
          aiSuggested: true,
        },
        {
          id: "draft-5",
          title: "IT Infrastructure & System Integration",
          category: "IT_CYBER",
          description:
            "Risks related to network setup, data security, system integration, and compliance with UAE data protection laws.",
          selected: false,
          aiSuggested: true,
        },
        {
          id: "draft-6",
          title: "Market Entry & Competitive Landscape",
          category: "STRATEGIC",
          description:
            "Risk that market conditions, competitive dynamics, or customer demand differs from initial projections.",
          selected: false,
          aiSuggested: true,
        },
      ]),
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log(`   - ${4} users`);
  console.log(`   - ${10} risks`);
  console.log(`   - ${8} controls`);
  console.log(`   - ${6} tasks`);
  console.log(`   - ${6} evidence files`);
  console.log(`   - ${4} comments`);
  console.log(`   - ${1} chat session`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
