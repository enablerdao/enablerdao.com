import { NextRequest, NextResponse } from "next/server";

const BEDS24_API = "https://beds24.com/api/v2";

// --- Beds24 Token Management ---

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getBeds24Token(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const refreshToken = process.env.BEDS24_REFRESH_TOKEN;
  if (!refreshToken) {
    throw new Error("BEDS24_REFRESH_TOKEN not configured");
  }

  const res = await fetch(`${BEDS24_API}/authentication/token`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      refreshToken,
    },
  });

  if (!res.ok) {
    throw new Error(`Beds24 token refresh failed: ${res.status}`);
  }

  const data = await res.json();
  if (!data.token) {
    throw new Error("Beds24 token refresh returned empty token");
  }

  tokenCache = {
    token: data.token,
    expiresAt: Date.now() + (data.expiresIn || 3600) * 1000 - 60000, // 1min buffer
  };

  return data.token;
}

// --- Property lookup ---

const PROPERTY_MAP: Record<string, { beds24PropertyId: number; beds24RoomId: number }> = {
  property01: { beds24PropertyId: 243406, beds24RoomId: 512691 }, // WHITE HOUSE 熱海
  property02: { beds24PropertyId: 243408, beds24RoomId: 512693 }, // THE LODGE 弟子屈
  property03: { beds24PropertyId: 243409, beds24RoomId: 512694 }, // THE NEST 弟子屈
  property04: { beds24PropertyId: 243407, beds24RoomId: 512692 }, // BEACH HOUSE ホノルル
};

// --- Validation ---

function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s).getTime());
}

// --- Handler ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      firstName,
      lastName,
      email,
      phone,
      message,
    } = body;

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guests || !firstName || !email) {
      return NextResponse.json(
        { error: "必須項目が不足しています (propertyId, checkIn, checkOut, guests, firstName, email)" },
        { status: 400 }
      );
    }

    if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
      return NextResponse.json({ error: "日付形式が不正です" }, { status: 400 });
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return NextResponse.json({ error: "チェックアウトはチェックイン以降にしてください" }, { status: 400 });
    }

    if (new Date(checkIn) < new Date(new Date().toISOString().slice(0, 10))) {
      return NextResponse.json({ error: "過去の日付は指定できません" }, { status: 400 });
    }

    const numGuests = Number(guests);
    if (!numGuests || numGuests < 1 || numGuests > 20) {
      return NextResponse.json({ error: "人数は1〜20名で指定してください" }, { status: 400 });
    }

    const mapping = PROPERTY_MAP[propertyId];
    if (!mapping) {
      return NextResponse.json({ error: "対象物件が見つかりません" }, { status: 400 });
    }

    // Get Beds24 token
    const token = await getBeds24Token();

    // Create booking on Beds24 (API expects an array)
    const bookingPayload = [{
      propertyId: mapping.beds24PropertyId,
      roomId: mapping.beds24RoomId,
      arrival: checkIn,
      departure: checkOut,
      numAdult: numGuests,
      numChild: 0,
      firstName: firstName,
      lastName: lastName || "",
      email: email,
      phone: phone || "",
      notes: message
        ? `[EnablerDAO Booking] ${message}`
        : "[EnablerDAO Booking]",
      status: "new",
    }];

    const res = await fetch(`${BEDS24_API}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        token,
      },
      body: JSON.stringify(bookingPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[booking/create] Beds24 error:", res.status, errText);
      return NextResponse.json(
        { error: "予約の作成に失敗しました。日程が既に埋まっている可能性があります。" },
        { status: 422 }
      );
    }

    const resultArr = await res.json();
    const result = Array.isArray(resultArr) ? resultArr[0] : resultArr;

    if (result?.success === false) {
      console.error("[booking/create] Beds24 rejected:", JSON.stringify(result));
      return NextResponse.json(
        { error: "予約の作成に失敗しました。日程が既に埋まっている可能性があります。" },
        { status: 422 }
      );
    }

    // Also notify via email (fire and forget)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "EnablerDAO Booking <info@enablerdao.com>",
          to: "info@enablerdao.com",
          subject: `[予約確定] ${firstName} ${lastName || ""} - ${checkIn}〜${checkOut}`,
          html: `
            <h2>新規予約</h2>
            <p><strong>物件:</strong> ${propertyId}</p>
            <p><strong>チェックイン:</strong> ${checkIn}</p>
            <p><strong>チェックアウト:</strong> ${checkOut}</p>
            <p><strong>人数:</strong> ${numGuests}名</p>
            <p><strong>予約者:</strong> ${firstName} ${lastName || ""}</p>
            <p><strong>メール:</strong> ${email}</p>
            <p><strong>電話:</strong> ${phone || "未入力"}</p>
            <p><strong>メッセージ:</strong> ${message || "なし"}</p>
            <p><strong>Beds24 ID:</strong> ${result?.new?.id || "N/A"}</p>
          `,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      bookingId: result?.new?.id || null,
      message: "予約が確定しました",
    });
  } catch (err) {
    console.error("[booking/create] Error:", err);
    return NextResponse.json(
      { error: "予約の処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
