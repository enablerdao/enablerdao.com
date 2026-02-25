import { NextRequest, NextResponse } from "next/server";
import { getAllIdeas, addIdea, likeIdea } from "@/data/ideas-store";

export const runtime = "edge";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET() {
  try {
    const ideas = getAllIdeas();
    return NextResponse.json({ ideas });
  } catch (err) {
    console.error("[api/ideas] GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Like action
    if (action === "like") {
      const { id } = body;
      if (!id || typeof id !== "string") {
        return NextResponse.json(
          { error: "IDは必須です" },
          { status: 400 }
        );
      }
      const updated = likeIdea(id);
      if (!updated) {
        return NextResponse.json(
          { error: "アイデアが見つかりません" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, idea: updated });
    }

    // Submit new idea
    const { title, category, detail, nickname, email } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }

    if (title.trim().length > 50) {
      return NextResponse.json(
        { error: "タイトルは50文字以内にしてください" },
        { status: 400 }
      );
    }

    if (!detail || typeof detail !== "string" || detail.trim().length === 0) {
      return NextResponse.json(
        { error: "詳細は必須です" },
        { status: 400 }
      );
    }

    if (detail.trim().length > 500) {
      return NextResponse.json(
        { error: "詳細は500文字以内にしてください" },
        { status: 400 }
      );
    }

    const validCategories = ["daily", "business", "entertainment", "education", "other"];
    const safeCategory = validCategories.includes(category) ? category : "other";

    const newIdea = addIdea({
      title: title.trim().slice(0, 50),
      category: safeCategory,
      detail: detail.trim().slice(0, 500),
      nickname: typeof nickname === "string" ? nickname.trim().slice(0, 30) : "",
      email: typeof email === "string" ? email.trim().slice(0, 200) : "",
    });

    // Send email notifications (fire-and-forget)
    await sendNotificationEmail(newIdea).catch((err) => {
      console.error("[api/ideas] Admin notification failed:", err);
    });

    // If submitter provided email, send token address request
    if (newIdea.email) {
      await sendTokenAddressRequest(newIdea).catch((err) => {
        console.error("[api/ideas] Token address request email failed:", err);
      });
    }

    return NextResponse.json({
      success: true,
      message: newIdea.email
        ? "アイデアを投稿しました。メールをご確認ください。"
        : "アイデアを投稿しました",
      id: newIdea.id,
    });
  } catch (err) {
    console.error("[api/ideas] POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function sendTokenAddressRequest(idea: {
  id: string;
  title: string;
  email: string;
  nickname: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !idea.email) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const displayName = idea.nickname || "アイデア投稿者";
  const _replyToAddress = `token-claim+${idea.id}@enablerdao.com`;

  await resend.emails.send({
    from: "EnablerDAO <info@enablerdao.com>",
    to: [idea.email],
    replyTo: "info@enablerdao.com",
    subject: "EBRトークンのお受け取りについて - EnablerDAO Ideas",
    html: `
      <div style="max-width:600px; margin:0 auto; font-family:'Helvetica Neue',Arial,sans-serif; color:#333;">
        <div style="background:#0a0a0a; padding:24px; border-bottom:2px solid #00ff00;">
          <h1 style="color:#00ff00; font-size:18px; margin:0;">EnablerDAO Ideas</h1>
        </div>
        <div style="padding:24px; background:#f9f9f9;">
          <p style="font-size:15px; line-height:1.6;">${escapeHtml(displayName)} 様</p>
          <p style="font-size:15px; line-height:1.6;">
            アイデア「<strong>${escapeHtml(idea.title)}</strong>」のご投稿ありがとうございます！
          </p>
          <p style="font-size:15px; line-height:1.6;">
            EnablerDAOでは、アイデアを投稿していただいた方に
            <strong style="color:#00aa00;">EBRトークン</strong>を付与しています。
          </p>

          <div style="background:#fff; border:1px solid #ddd; border-left:4px solid #00aa00; padding:16px; margin:20px 0;">
            <p style="font-size:14px; line-height:1.6; margin:0 0 12px;">
              <strong>トークンを受け取るために</strong>、以下の情報をこのメールに返信してお知らせください：
            </p>
            <ul style="font-size:14px; line-height:1.8; margin:0; padding-left:20px;">
              <li><strong>ウォレットアドレス</strong>（Ethereum / Polygon 対応）</li>
            </ul>
            <p style="font-size:12px; color:#888; margin:12px 0 0;">
              ※ MetaMask等のウォレットをお持ちでない場合も、今後のエアドロップ対象として登録いたします。
              「まだウォレットを持っていません」とご返信いただくだけでOKです。
            </p>
          </div>

          <p style="font-size:14px; line-height:1.6; color:#666;">
            あなたのアイデアがチームのレビューで採用された場合、
            追加のEBRトークンも付与されます。進捗はEnablerDAOサイトでお知らせします。
          </p>

          <div style="margin-top:24px; padding-top:16px; border-top:1px solid #eee;">
            <p style="font-size:12px; color:#888; margin:0;">
              EnablerDAO — みんなの力で未来を創る<br/>
              <a href="https://enablerdao.com/ideas" style="color:#00aa00;">enablerdao.com/ideas</a>
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

async function sendNotificationEmail(idea: {
  id: string;
  title: string;
  category: string;
  detail: string;
  nickname: string;
  email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[api/ideas] RESEND_API_KEY not set, skipping email notification");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const categoryLabels: Record<string, string> = {
    daily: "生活の不便",
    business: "ビジネス効率化",
    entertainment: "エンタメ",
    education: "教育",
    other: "その他",
  };

  await resend.emails.send({
    from: "EnablerDAO Ideas <info@enablerdao.com>",
    to: ["info@enablerdao.com"],
    subject: `[Ideas] 新しいアイデア: ${idea.title}`,
    html: `
      <h2>EnablerDAO Ideas - 新しいアイデア投稿</h2>
      <table style="border-collapse:collapse; width:100%; max-width:600px;">
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">ID</td><td style="padding:8px; border:1px solid #ddd;">${escapeHtml(idea.id)}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">タイトル</td><td style="padding:8px; border:1px solid #ddd;">${escapeHtml(idea.title)}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">カテゴリ</td><td style="padding:8px; border:1px solid #ddd;">${escapeHtml(categoryLabels[idea.category] || idea.category)}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">詳細</td><td style="padding:8px; border:1px solid #ddd;">${escapeHtml(idea.detail)}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">ニックネーム</td><td style="padding:8px; border:1px solid #ddd;">${escapeHtml(idea.nickname || "(匿名)")}</td></tr>
        <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">メール</td><td style="padding:8px; border:1px solid #ddd;">${escapeHtml(idea.email || "(未入力)")}</td></tr>
      </table>
    `,
  });
}
