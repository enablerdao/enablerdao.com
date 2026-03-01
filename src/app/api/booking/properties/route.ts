import { NextRequest, NextResponse } from "next/server";

// --- Types ---

interface DateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
}

interface Property {
  id: string;
  name: string;
  location: string;
  type: "enabler" | "nah";
  image: string;
  description: string;
  capacity: string;
  airbnbUrl?: string;
  beds24PropertyId?: number;
  beds24RoomId?: number;
  bookedRanges: DateRange[];
  updatedAt: string;
}

// --- Property Definitions ---

const ENABLER_PROPERTIES = [
  {
    id: "property01",
    name: "WHITE HOUSE 熱海",
    location: "静岡県熱海市",
    description: "熱海の高台に位置するモダンなヴィラ。オーシャンビューのテラス付き。",
    capacity: "最大6名",
    airbnbUrl: "https://www.airbnb.jp/rooms/53223988",
    image: "/properties/atami.webp",
    icalUrl: "https://calendar.google.com/calendar/ical/c_e1a1c1b79db230e0c59c5e2d5e1e85a78e629153363db144669e5ce5cd64daeb%40group.calendar.google.com/private-41fe6327a33720ae918c65a3837a1a68/basic.ics",
    beds24PropertyId: 243406,
    beds24RoomId: 512691,
  },
  {
    id: "property02",
    name: "THE LODGE 弟子屈",
    location: "北海道弟子屈町",
    description: "摩周湖・屈斜路湖に囲まれた大自然の中のロッジ。温泉付き。",
    capacity: "最大8名",
    airbnbUrl: "https://www.airbnb.jp/rooms/597239384272621732",
    image: "/properties/lodge.webp",
    icalUrl: "https://calendar.google.com/calendar/ical/c_f952ccb017d44055413db2e30fd354e4690a9e1859debdad7bebd40fa05fd6d4%40group.calendar.google.com/private-426e5fcfae90bea4fc81a10fab9b902c/basic.ics",
    beds24PropertyId: 243408,
    beds24RoomId: 512693,
  },
  {
    id: "property03",
    name: "THE NEST 弟子屈",
    location: "北海道弟子屈町",
    description: "森に溶け込むデザインのコテージ。プライベート感抜群。",
    capacity: "最大4名",
    airbnbUrl: "https://www.airbnb.jp/rooms/911857804615412559",
    image: "/properties/nest.webp",
    icalUrl: "https://calendar.google.com/calendar/ical/c_6422e9e75accb74badf8648c2620e2922cbd7ac3d9e3a050c98fc38c09038dd2%40group.calendar.google.com/private-d71e78b5346301cd0030facdf39025d7/basic.ics",
    beds24PropertyId: 243409,
    beds24RoomId: 512694,
  },
  {
    id: "property04",
    name: "BEACH HOUSE ホノルル",
    location: "ハワイ州ホノルル",
    description: "ワイキキビーチ至近のビーチハウス。ハワイの風を感じる滞在を。",
    capacity: "最大4名",
    airbnbUrl: "https://www.airbnb.jp/rooms/1226550388535476490",
    image: "/properties/honolulu.webp",
    icalUrl: "https://calendar.google.com/calendar/ical/c_8abd7a86aa57cd0f923f9442b135ff0b1801d6afe1baa50c7c00633291248824%40group.calendar.google.com/private-e5e80721bd5601c5eb08049d6743c4c0/basic.ics",
    beds24PropertyId: 243407,
    beds24RoomId: 512692,
  },
];

const NAH_PROPERTIES = [
  {
    id: "nah_aoshima",
    name: "NOT A HOTEL AOSHIMA",
    location: "宮崎県宮崎市",
    description: "太平洋を望むラグジュアリーヴィラ。建築家・藤森照信氏設計。",
    capacity: "最大4名",
    image: "/properties/nah-aoshima.webp",
  },
  {
    id: "nah_asakusa",
    name: "NOT A HOTEL CLUB HOUSE ASAKUSA",
    location: "東京都台東区",
    description: "浅草の中心に位置するクラブハウス。東京観光の拠点に最適。",
    capacity: "最大6名",
    image: "/properties/nah-asakusa.webp",
  },
  {
    id: "nah_harumi",
    name: "NOT A HOTEL CLUB HOUSE HARUMI",
    location: "東京都中央区",
    description: "東京湾を一望できるタワーレジデンス。都心の非日常空間。",
    capacity: "最大4名",
    image: "/properties/nah-harumi.webp",
  },
];

// --- iCal Parser ---

function parseIcalEvents(icalText: string): DateRange[] {
  const ranges: DateRange[] = [];
  let inEvent = false;
  let start = "";
  let end = "";

  for (const rawLine of icalText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      start = "";
      end = "";
    } else if (line === "END:VEVENT") {
      if (inEvent && start && end) {
        const fmt = (s: string) =>
          s.length >= 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}` : s;
        ranges.push({ start: fmt(start), end: fmt(end) });
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith("DTSTART;VALUE=DATE:")) {
        start = line.slice("DTSTART;VALUE=DATE:".length);
      } else if (line.startsWith("DTSTART:")) {
        start = line.slice("DTSTART:".length).slice(0, 8);
      } else if (line.startsWith("DTEND;VALUE=DATE:")) {
        end = line.slice("DTEND;VALUE=DATE:".length);
      } else if (line.startsWith("DTEND:")) {
        end = line.slice("DTEND:".length).slice(0, 8);
      }
    }
  }

  return ranges;
}

// --- Demo Bookings ---

function generateDemoBookings(propertyId: string): DateRange[] {
  const today = new Date();
  const seed = propertyId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const patterns = [
    [[1,4],[7,10],[14,18],[22,25],[30,37],[42,45],[50,53],[58,62],[70,74],[80,83],[90,97],[105,109],[115,118],[125,132],[140,143],[155,160],[168,172]],
    [[3,6],[12,16],[24,28],[35,38],[48,55],[63,66],[75,79],[88,92],[102,106],[118,122],[135,142],[150,153],[165,170]],
    [[0,5],[8,11],[20,27],[40,43],[55,58],[65,72],[85,88],[95,102],[110,113],[130,137],[148,152],[160,167]],
    [[2,9],[15,18],[25,32],[40,47],[55,60],[70,77],[90,95],[105,112],[125,130],[145,152],[165,170]],
    [[1,3],[5,8],[12,15],[19,22],[26,29],[33,36],[40,47],[54,57],[61,64],[68,71],[75,82],[89,92],[96,99],[110,117],[124,127],[140,143],[155,162]],
  ];

  const pattern = patterns[seed % patterns.length];
  return pattern.map(([s, e]) => {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + s);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + e);
    return {
      start: startDate.toISOString().slice(0, 10),
      end: endDate.toISOString().slice(0, 10),
    };
  });
}

// --- NOT A HOTEL API ---

async function fetchNahAvailability(): Promise<Map<string, DateRange[]>> {
  const refreshToken = process.env.NAH_REFRESH_TOKEN;
  const apiKey = process.env.NAH_API_KEY;
  const result = new Map<string, DateRange[]>();

  if (!refreshToken || !apiKey) {
    return result;
  }

  try {
    // Refresh Firebase token
    const tokenRes = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      }
    );
    if (!tokenRes.ok) return result;
    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;
    if (!idToken) return result;

    // Fetch owner home data to discover properties
    const homeRes = await fetch(
      "https://app-gateway.notahotel.com/app/v1/get_owner_home_data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
          "not-a-platform": "web",
          "not-a-web-app-version": "v0.1.131",
        },
        body: JSON.stringify({}),
      }
    );
    if (!homeRes.ok) return result;
    const homeData = await homeRes.json();

    // Extract house group IDs
    const targets: { groupId: string; propertyId: string }[] = [];

    for (const prop of homeData.available_properties || []) {
      const bundle = prop.owned_house_bundle?.bundle;
      if (bundle?.house_group_ids) {
        for (const gid of bundle.house_group_ids) {
          targets.push({ groupId: gid, propertyId: `nah_${gid}` });
        }
      }
    }
    for (const ch of homeData.club_houses || []) {
      const hg = ch.house_group;
      if (hg?.id) {
        targets.push({ groupId: hg.id, propertyId: `nah_${hg.id}` });
      }
    }

    // Fetch vacancy for each
    for (const t of targets) {
      try {
        const vacRes = await fetch(
          "https://app-gateway.notahotel.com/app/v1/get_vacancy_calendar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
              "not-a-platform": "web",
              "not-a-web-app-version": "v0.1.131",
            },
            body: JSON.stringify({
              daoUse: {
                houseGroupId: t.groupId,
                limitToOwnedSlotDeadline: false,
              },
            }),
          }
        );
        if (!vacRes.ok) continue;
        const vacData = await vacRes.json();
        const calendar = vacData.calendar;
        if (!calendar?.months) continue;

        // Convert calendar to booked ranges
        const ranges: DateRange[] = [];
        let rangeStart: string | null = null;
        let lastBooked: string | null = null;

        for (const month of calendar.months) {
          for (const day of month.days) {
            const dateStr = `${day.date.year}-${String(day.date.month).padStart(2, "0")}-${String(day.date.day).padStart(2, "0")}`;
            if (!day.vacant) {
              if (!rangeStart) rangeStart = dateStr;
              lastBooked = dateStr;
            } else if (rangeStart && lastBooked) {
              ranges.push({ start: rangeStart, end: dateStr });
              rangeStart = null;
              lastBooked = null;
            }
          }
        }
        if (rangeStart && lastBooked) {
          const d = new Date(lastBooked);
          d.setDate(d.getDate() + 1);
          ranges.push({ start: rangeStart, end: d.toISOString().slice(0, 10) });
        }

        result.set(t.propertyId, ranges);
      } catch {
        // Individual property failure - continue
      }
    }
  } catch {
    // NAH API unavailable
  }

  return result;
}

// --- Cache ---

let enablerCache: { data: Property[]; expiresAt: number } | null = null;
let fullCache: { data: Property[]; expiresAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// --- Handler ---

export async function GET(request: NextRequest) {
  const includeNah = request.nextUrl.searchParams.get("include") === "nah";

  // Check cache
  if (includeNah && fullCache && Date.now() < fullCache.expiresAt) {
    return NextResponse.json({ properties: fullCache.data });
  }
  if (!includeNah && enablerCache && Date.now() < enablerCache.expiresAt) {
    return NextResponse.json({ properties: enablerCache.data });
  }

  const now = new Date().toISOString();

  // Fetch all availability in parallel
  const icalPromises = ENABLER_PROPERTIES.map(async (prop) => {
    try {
      const res = await fetch(prop.icalUrl, { next: { revalidate: 300 } });
      if (!res.ok) return [];
      const text = await res.text();
      const ranges = parseIcalEvents(text);
      // Only keep future ranges
      const today = new Date().toISOString().slice(0, 10);
      const futureRanges = ranges.filter((r) => r.end > today);
      return futureRanges.length > 0 ? futureRanges : generateDemoBookings(prop.id);
    } catch {
      return generateDemoBookings(prop.id);
    }
  });

  const [enablerResults, nahResults] = await Promise.all([
    Promise.allSettled(icalPromises),
    includeNah ? fetchNahAvailability() : Promise.resolve(new Map<string, DateRange[]>()),
  ]);

  const properties: Property[] = [];

  // Enabler properties
  ENABLER_PROPERTIES.forEach((prop, i) => {
    const result = enablerResults[i];
    const bookedRanges =
      result.status === "fulfilled" ? result.value : generateDemoBookings(prop.id);

    properties.push({
      id: prop.id,
      name: prop.name,
      location: prop.location,
      type: "enabler",
      image: prop.image,
      description: prop.description,
      capacity: prop.capacity,
      airbnbUrl: prop.airbnbUrl,
      beds24PropertyId: prop.beds24PropertyId,
      beds24RoomId: prop.beds24RoomId,
      bookedRanges,
      updatedAt: now,
    });
  });

  // NOT A HOTEL properties (only if requested)
  if (includeNah) {
    for (const prop of NAH_PROPERTIES) {
      const ranges = nahResults.get(prop.id) ?? generateDemoBookings(prop.id);
      properties.push({
        id: prop.id,
        name: prop.name,
        location: prop.location,
        type: "nah",
        image: prop.image,
        description: prop.description,
        capacity: prop.capacity,
        bookedRanges: ranges,
        updatedAt: now,
      });
    }
  }

  // Update cache
  if (includeNah) {
    fullCache = { data: properties, expiresAt: Date.now() + CACHE_TTL };
  } else {
    enablerCache = { data: properties, expiresAt: Date.now() + CACHE_TTL };
  }

  return NextResponse.json({ properties });
}
