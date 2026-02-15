import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = 'edge';

const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || "";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function verifyWebhookSignature(body: string, signature: string | null): Promise<boolean> {
  if (!WEBHOOK_SECRET || !signature) return false;

  // Use Web Crypto API instead of Node.js crypto
  const encoder = new TextEncoder();
  const keyData = encoder.encode(WEBHOOK_SECRET);
  const messageData = encoder.encode(body);

  // Import the key for HMAC
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Generate HMAC signature
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const expected = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Timing-safe comparison
  if (signature.length !== expected.length) return false;

  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }

  return result === 0;
}

// Auto-reply templates based on email content keywords
function generateReply(
  fromEmail: string,
  fromName: string,
  subject: string,
  body: string
): { subject: string; html: string } {
  const lowerBody = (body + " " + subject).toLowerCase();

  // Determine the type of inquiry
  let category = "general";
  if (
    lowerBody.includes("セキュリティ") ||
    lowerBody.includes("security") ||
    lowerBody.includes("診断") ||
    lowerBody.includes("scan")
  ) {
    category = "security";
  } else if (
    lowerBody.includes("トークン") ||
    lowerBody.includes("token") ||
    lowerBody.includes("ebr") ||
    lowerBody.includes("dao")
  ) {
    category = "dao";
  } else if (
    lowerBody.includes("採用") ||
    lowerBody.includes("参加") ||
    lowerBody.includes("join") ||
    lowerBody.includes("contribute") ||
    lowerBody.includes("コントリビュート")
  ) {
    category = "join";
  } else if (
    lowerBody.includes("ai") ||
    lowerBody.includes("elio") ||
    lowerBody.includes("chatweb")
  ) {
    category = "ai";
  } else if (
    lowerBody.includes("提携") ||
    lowerBody.includes("パートナー") ||
    lowerBody.includes("partner") ||
    lowerBody.includes("business") ||
    lowerBody.includes("協業")
  ) {
    category = "partnership";
  }

  const name = fromName || fromEmail.split("@")[0];

  const categoryContent: Record<string, string> = {
    security: `
      <p>セキュリティに関するお問い合わせありがとうございます。</p>
      <p>EnablerDAOでは以下のセキュリティサービスを提供しています：</p>
      <ul>
        <li><strong>Security Scanner</strong>（<a href="https://chatnews.tech">chatnews.tech</a>）- WebサイトのセキュリティをAIで自動診断</li>
      </ul>
      <p>詳しい内容について、担当者より改めてご連絡いたします。</p>
    `,
    dao: `
      <p>EnablerDAOおよびEBRトークンに関するお問い合わせありがとうございます。</p>
      <p>EnablerDAOは「みんなで作る、みんなのためのソフトウェア」を目指す分散型組織です。</p>
      <ul>
        <li>EBRトークンは、DAOの意思決定に参加するための投票券のようなものです</li>
        <li>プロジェクトへの貢献に応じて報酬として受け取れます</li>
        <li>詳細は <a href="https://enablerdao.com">enablerdao.com</a> をご覧ください</li>
      </ul>
      <p>担当者より改めてご連絡いたします。</p>
    `,
    join: `
      <p>EnablerDAOへの参加に興味をお持ちいただきありがとうございます！</p>
      <p>私たちは常に新しい仲間を歓迎しています。参加方法は以下の通りです：</p>
      <ul>
        <li><strong>GitHub</strong>: <a href="https://github.com/enablerdao">github.com/enablerdao</a> でコードに貢献</li>
        <li><strong>プロジェクト提案</strong>: 新しいアイデアを提案して、みんなで投票</li>
        <li><strong>報酬</strong>: 貢献に応じてEBRトークンが付与されます</li>
      </ul>
      <p>詳しくは担当者より改めてご連絡いたします。</p>
    `,
    ai: `
      <p>AIプロダクトに関するお問い合わせありがとうございます。</p>
      <p>EnablerDAOでは以下のAIサービスを開発・運営しています：</p>
      <ul>
        <li><strong>Chatweb.ai</strong>（<a href="https://chatweb.ai">chatweb.ai</a>）- 音声・テキストでAIがWeb操作を自動化</li>
        <li><strong>Elio Chat</strong>（<a href="https://elio.love">elio.love</a>）- 完全オフラインAIチャット</li>
        <li><strong>News.xyz</strong>（<a href="https://news.xyz">news.xyz</a>）- AIニュース配信</li>
        <li><strong>News.cloud</strong>（<a href="https://news.cloud">news.cloud</a>）- News APIプラットフォーム</li>
      </ul>
      <p>担当者より改めてご連絡いたします。</p>
    `,
    partnership: `
      <p>提携・パートナーシップに関するお問い合わせありがとうございます。</p>
      <p>EnablerDAOでは12以上のプロダクトを運営しており、さまざまな形での協業を歓迎しています。</p>
      <p>担当者より改めて詳細をご連絡いたします。</p>
    `,
    general: `
      <p>お問い合わせありがとうございます。</p>
      <p>EnablerDAOは「みんなで作る、みんなのためのソフトウェア」を目指す分散型組織です。</p>
      <p>現在12以上のプロダクトを開発・運営しています。詳しくは <a href="https://enablerdao.com">enablerdao.com</a> をご覧ください。</p>
      <p>担当者より改めてご連絡いたします。</p>
    `,
  };

  const replyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
    a { color: #0066cc; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 13px; color: #666; }
    .logo { font-size: 18px; font-weight: bold; color: #000; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="logo">EnablerDAO</div>
  <p>${escapeHtml(name)}様</p>
  <p>ご連絡いただきありがとうございます。</p>
  ${categoryContent[category]}
  <p>通常1〜2営業日以内に返信いたします。</p>
  <p>よろしくお願いいたします。</p>
  <div class="footer">
    <p><strong>EnablerDAO</strong></p>
    <p>Web: <a href="https://enablerdao.com">enablerdao.com</a></p>
    <p>GitHub: <a href="https://github.com/enablerdao">github.com/enablerdao</a></p>
    <p>X: <a href="https://x.com/enablerdao">@enablerdao</a></p>
  </div>
</body>
</html>`;

  return {
    subject: `Re: ${subject}`,
    html: replyHtml,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature if secret is configured
    const rawBody = await request.text();
    const signature = request.headers.get("svix-signature") || request.headers.get("x-webhook-signature");
    if (WEBHOOK_SECRET && !(await verifyWebhookSignature(rawBody, signature))) {
      console.error("Webhook signature verification failed");
      return NextResponse.json({ status: "error", error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Resend inbound webhook payload
    const {
      from: fromEmail,
      to,
      subject,
      text,
      html: emailHtml,
    } = payload;

    // Extract sender name and email
    const fromMatch = fromEmail?.match(/^(.+?)\s*<(.+?)>$/);
    const senderName = fromMatch ? fromMatch[1].trim() : "";
    const senderEmail = fromMatch ? fromMatch[2] : fromEmail;

    // Skip auto-reply for noreply addresses, bounce messages, or our own emails
    if (
      !senderEmail ||
      senderEmail.includes("noreply") ||
      senderEmail.includes("no-reply") ||
      senderEmail.includes("mailer-daemon") ||
      senderEmail.includes("postmaster") ||
      senderEmail.endsWith("@enablerdao.com") ||
      subject?.toLowerCase().includes("undelivered") ||
      subject?.toLowerCase().includes("delivery failed") ||
      subject?.toLowerCase().includes("auto-reply") ||
      subject?.toLowerCase().includes("自動返信")
    ) {
      return NextResponse.json({ status: "skipped", reason: "auto-reply not needed" });
    }

    // Generate contextual reply
    const reply = generateReply(
      senderEmail,
      senderName,
      subject || "(件名なし)",
      text || ""
    );

    // Determine which @enablerdao.com address received the email
    const toAddress = Array.isArray(to) ? to[0] : to;
    const replyFrom = toAddress?.includes("@enablerdao.com")
      ? toAddress
      : "info@enablerdao.com";

    // Send auto-reply
    const { error } = await getResend().emails.send({
      from: `EnablerDAO <${replyFrom}>`,
      to: [senderEmail],
      subject: reply.subject,
      html: reply.html,
      replyTo: "info@enablerdao.com",
      headers: {
        "X-Auto-Reply": "true",
        "Auto-Submitted": "auto-replied",
      },
    });

    if (error) {
      console.error("Failed to send auto-reply:", error);
      return NextResponse.json({ status: "error", error: error.message }, { status: 500 });
    }

    console.log(`Auto-reply sent to ${senderEmail} (category: ${subject})`);
    return NextResponse.json({ status: "sent", to: senderEmail });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { status: "error", error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Resend may send a GET to verify the webhook endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", service: "EnablerDAO Email Webhook" });
}
