import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // TODO: Implement actual email sending with verification code
    // For now, return mock success
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`[verify/email/send] Code ${code} generated for ${email}`);

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      // In production, do NOT return the code in the response
      // This is only for development/mock purposes
      _mock_code: code,
    });
  } catch (err) {
    console.error("[verify/email/send] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
