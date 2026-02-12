import { NextRequest, NextResponse } from "next/server";
import {
  getAllQuestions,
  getPublicQuestions,
  addQuestion,
} from "@/data/qa-store";

const ADMIN_TOKEN = process.env.QA_ADMIN_TOKEN || "";

function isAdmin(request: NextRequest): boolean {
  const token = request.nextUrl.searchParams.get("token");
  return !!ADMIN_TOKEN && token === ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  try {
    const admin = isAdmin(request);
    const questions = admin ? getAllQuestions() : getPublicQuestions();

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("[api/qa] GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, question, category } = body;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json(
        { error: "質問内容は必須です" },
        { status: 400 }
      );
    }

    const validCategories = [
      "general",
      "technical",
      "token",
      "contribution",
      "partnership",
    ];
    const safeCategory = validCategories.includes(category)
      ? category
      : "general";

    const newQuestion = addQuestion({
      name: typeof name === "string" ? name.trim().slice(0, 100) : "",
      email: typeof email === "string" ? email.trim().slice(0, 200) : "",
      question: question.trim().slice(0, 5000),
      category: safeCategory,
    });

    // Send email notification to founder
    await sendNotificationEmail(newQuestion).catch((err) => {
      console.error("[api/qa] Email notification failed:", err);
    });

    return NextResponse.json({
      success: true,
      message: "質問を受け付けました",
      id: newQuestion.id,
    });
  } catch (err) {
    console.error("[api/qa] POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function sendNotificationEmail(item: {
  id: string;
  name: string;
  email: string;
  question: string;
  category: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[api/qa] RESEND_API_KEY not set, skipping email notification");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const categoryLabels: Record<string, string> = {
    general: "General",
    technical: "Technical",
    token: "Token",
    contribution: "Contribution",
    partnership: "Partnership",
  };

  await resend.emails.send({
    from: "EnablerDAO Q&A <info@enablerdao.com>",
    to: ["info@enablerdao.com"],
    subject: `[Q&A] 新しい質問: ${item.question.slice(0, 50)}...`,
    html: `
      <h2>EnablerDAO Q&A - 新しい質問</h2>
      <table style="border-collapse:collapse; width:100%; max-width:600px;">
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">ID</td><td style="padding:8px; border:1px solid #ddd;">${item.id}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">名前</td><td style="padding:8px; border:1px solid #ddd;">${item.name || "(匿名)"}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">メール</td><td style="padding:8px; border:1px solid #ddd;">${item.email || "(未入力)"}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">カテゴリ</td><td style="padding:8px; border:1px solid #ddd;">${categoryLabels[item.category] || item.category}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">質問</td><td style="padding:8px; border:1px solid #ddd;">${item.question}</td></tr>
      </table>
      <p style="margin-top:16px;">
        <a href="https://enablerdao.com/qa?admin=true&token=${ADMIN_TOKEN}">管理画面で回答する</a>
      </p>
    `,
  });
}
