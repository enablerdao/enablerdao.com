import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/data/qa-store";

const ADMIN_TOKEN = process.env.QA_ADMIN_TOKEN || "";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin token
    const token = request.nextUrl.searchParams.get("token");
    if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { answer } = body;

    if (!answer || typeof answer !== "string" || answer.trim().length === 0) {
      return NextResponse.json(
        { error: "回答内容は必須です" },
        { status: 400 }
      );
    }

    const updated = answerQuestion(id, answer.trim().slice(0, 10000));

    if (!updated) {
      return NextResponse.json(
        { error: "質問が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "回答を登録しました",
      question: updated,
    });
  } catch (err) {
    console.error("[api/qa/answer] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
