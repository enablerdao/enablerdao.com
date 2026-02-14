import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { username, token } = await request.json();

    if (!username || !token) {
      return NextResponse.json(
        { error: "Username and token are required" },
        { status: 400 }
      );
    }

    // TODO: Implement actual GitHub Gist verification
    // In production:
    // 1. Fetch public gists for the user via GitHub API
    // 2. Check if any gist contains "enabler-verify=<token>"
    // 3. Verify the gist is owned by the claimed username
    // For now, return mock success

    console.log(`[verify/github/check] Checking gists for ${username} with token ${token}`);

    return NextResponse.json({
      verified: true,
      username,
      timestamp: new Date().toISOString(),
      gist_url: `https://gist.github.com/${username}/mock-gist-id`,
      // TODO: Return cNFT mint transaction signature
      _mock: true,
    });
  } catch (err) {
    console.error("[verify/github/check] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
