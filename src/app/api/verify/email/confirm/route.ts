import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // TODO: Implement actual code verification against stored codes
    // For now, accept any 6-digit code as valid (mock mode)
    const isValidCode = /^\d{6}$/.test(code);

    if (!isValidCode) {
      return NextResponse.json(
        { verified: false, error: "Invalid code format" },
        { status: 400 }
      );
    }

    console.log(`[verify/email/confirm] Email ${email} verified with code ${code}`);

    return NextResponse.json({
      verified: true,
      email,
      timestamp: new Date().toISOString(),
      // TODO: Return cNFT mint transaction signature
      _mock: true,
    });
  } catch (err) {
    console.error("[verify/email/confirm] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
