import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function npsLabel(score: number): string {
  if (score >= 9) return "Promoter";
  if (score >= 7) return "Passive";
  return "Detractor";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, comment, page, product } = body;

    // Validate score
    if (typeof score !== "number" || score < 0 || score > 10) {
      return NextResponse.json(
        { error: "スコアは0-10の数値で指定してください" },
        { status: 400 }
      );
    }

    const safePage = typeof page === "string" ? page.slice(0, 200) : "/";
    const safeComment = typeof comment === "string" ? comment.slice(0, 500) : "";
    const safeProduct = typeof product === "string" ? product.slice(0, 100) : "";

    console.log(
      `[api/feedback] NPS=${score} (${npsLabel(score)}) page=${safePage} product=${safeProduct} comment=${safeComment}`
    );

    // Send notification email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);

        await resend.emails.send({
          from: "EnablerDAO Feedback <info@enablerdao.com>",
          to: ["info@enablerdao.com"],
          subject: `[Feedback] NPS ${score}/10 (${npsLabel(score)}) - ${safePage}`,
          html: `
            <div style="font-family: monospace; max-width: 600px;">
              <div style="background: #0a0a0a; padding: 16px; border-bottom: 2px solid #00ff00;">
                <h2 style="color: #00ff00; margin: 0; font-size: 16px;">EnablerDAO Feedback</h2>
              </div>
              <div style="padding: 16px; background: #f9f9f9;">
                <table style="border-collapse: collapse; width: 100%;">
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; width: 120px;">NPS Score</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                      <strong style="font-size: 18px;">${score}</strong>/10
                      <span style="margin-left: 8px; padding: 2px 8px; border-radius: 4px; font-size: 12px; background: ${score >= 9 ? "#d4edda" : score >= 7 ? "#fff3cd" : "#f8d7da"}; color: ${score >= 9 ? "#155724" : score >= 7 ? "#856404" : "#721c24"};">
                        ${escapeHtml(npsLabel(score))}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Page</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(safePage)}</td>
                  </tr>
                  ${safeProduct ? `<tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Product</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(safeProduct)}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Comment</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(safeComment) || "<em style='color:#999;'>（コメントなし）</em>"}</td>
                  </tr>
                </table>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("[api/feedback] Email notification failed:", emailErr);
      }
    } else {
      console.log("[api/feedback] RESEND_API_KEY not set, skipping email");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/feedback] POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
