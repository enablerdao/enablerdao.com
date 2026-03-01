import { NextRequest, NextResponse } from "next/server";

interface InquiryBody {
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message?: string;
  walletAddress: string;
}

export async function POST(request: NextRequest) {
  let body: InquiryBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  // Validate
  if (!body.propertyId || !body.checkIn || !body.checkOut) {
    return NextResponse.json(
      { ok: false, error: "missing required fields" },
      { status: 400 }
    );
  }
  if (!body.guests || body.guests < 1 || body.guests > 20) {
    return NextResponse.json(
      { ok: false, error: "guests must be 1-20" },
      { status: 400 }
    );
  }
  if (!body.walletAddress) {
    return NextResponse.json(
      { ok: false, error: "wallet address required" },
      { status: 400 }
    );
  }

  console.log(
    `[inquiry] property=${body.propertyName} checkIn=${body.checkIn} checkOut=${body.checkOut} guests=${body.guests} wallet=${body.walletAddress.slice(0, 8)}...`
  );

  // Send email via Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[inquiry] RESEND_API_KEY not set — inquiry logged only");
    return NextResponse.json({ ok: true });
  }

  const toEmail = process.env.INQUIRY_EMAIL || "info@enablerdao.com";

  const html = `
<h2>EBRメンバー物件予約リクエスト</h2>
<table style="border-collapse:collapse;font-family:monospace;">
<tr><td style="padding:4px 12px;font-weight:bold;color:#555;">物件</td><td style="padding:4px 12px;">${escapeHtml(body.propertyName)} (${escapeHtml(body.propertyId)})</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;color:#555;">チェックイン</td><td style="padding:4px 12px;">${escapeHtml(body.checkIn)}</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;color:#555;">チェックアウト</td><td style="padding:4px 12px;">${escapeHtml(body.checkOut)}</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;color:#555;">人数</td><td style="padding:4px 12px;">${body.guests}名</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;color:#555;">ウォレット</td><td style="padding:4px 12px;font-family:monospace;font-size:12px;">${escapeHtml(body.walletAddress)}</td></tr>
<tr><td style="padding:4px 12px;font-weight:bold;color:#555;">メッセージ</td><td style="padding:4px 12px;">${body.message ? escapeHtml(body.message) : "(なし)"}</td></tr>
</table>
<hr style="border-color:#eee;margin:16px 0;">
<p style="color:#888;font-size:12px;">このリクエストはenablerdao.com/bookingから送信されました（EBR≧1000認証済み）</p>
`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "EnablerDAO <noreply@enablerdao.com>",
        to: [toEmail],
        subject: `[予約リクエスト] ${body.propertyName} ${body.checkIn}〜${body.checkOut}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error(`[inquiry] Resend API error: ${res.status}`);
      return NextResponse.json({ ok: true }); // Still return ok — inquiry was logged
    }
  } catch (err) {
    console.error("[inquiry] Resend request failed:", err);
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
