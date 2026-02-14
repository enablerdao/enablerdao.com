import { NextRequest, NextResponse } from "next/server";

// Cloudflare Pages requires Edge Runtime
export const runtime = 'edge';

// TODO: Resend統合 - 以下のコマンドでインストール
// npm install resend

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // バリデーション
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    // TODO: Resend APIで送信
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'EnablerDAO <noreply@enablerdao.com>',
    //   to: email,
    //   subject: 'Welcome to EnablerDAO!',
    //   html: '<p>ウェルカムメール本文</p>',
    // });

    // TODO: データベースに保存（Supabase等）
    // await supabase.from('newsletter_subscribers').insert({ email, subscribed_at: new Date() });

    // 仮実装: コンソールログのみ
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
