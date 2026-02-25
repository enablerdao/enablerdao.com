import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Cloudflare Pages requires Edge Runtime
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    // Send welcome email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "EnablerDAO <info@enablerdao.com>",
        to: email,
        subject: "Welcome to EnablerDAO!",
        html: `
          <div style="font-family: monospace; background: #0a0a0a; color: #e0e0e0; padding: 32px; max-width: 600px;">
            <h1 style="color: #00ff00; font-size: 24px;">EnablerDAO へようこそ</h1>
            <p style="color: #888; line-height: 1.8;">
              ニュースレターにご登録いただきありがとうございます。<br/>
              新プロダクトのリリース、技術記事、コミュニティの動きを週1回お届けします。
            </p>
            <div style="background: #1a1a1a; border: 1px solid #333; padding: 16px; margin: 24px 0;">
              <p style="color: #00ffff; margin: 0 0 8px 0; font-size: 14px;">初回限定クーポン</p>
              <p style="color: #00ff00; font-size: 24px; font-weight: bold; margin: 0;">ENABLER10</p>
            </div>
            <p style="color: #555; font-size: 12px;">
              EnablerDAO - みんなで作る、みんなのためのソフトウェア<br/>
              <a href="https://enablerdao.com" style="color: #00ffff;">enablerdao.com</a>
            </p>
          </div>
        `,
      });
    }

    console.log("Newsletter subscription:", email);

    return NextResponse.json(
      {
        success: true,
        message: "登録完了！ウェルカムメールをご確認ください。",
        coupon: "ENABLER10",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
