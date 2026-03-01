"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const EBR_MINT = "E1JxwaWRd8nw8vDdWMdqwdbXGBshqDcnTcinHzNMqg2Y";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const EBR_MIN_BALANCE = 1000;

// Calendar months: 2 for guests, 6 for EBR members
const MONTHS_DEFAULT = 2;
const MONTHS_MEMBER = 6;

// --- Types ---

interface DateRange {
  start: string;
  end: string;
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

type AuthState = "disconnected" | "connecting" | "connected" | "member";

interface BookingForm {
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

// --- Helpers ---

function isDateBooked(dateStr: string, ranges: DateRange[]): boolean {
  return ranges.some((r) => dateStr >= r.start && dateStr < r.end);
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function getMonthList(count: number): { year: number; month: number }[] {
  const now = new Date();
  const list: { year: number; month: number }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    list.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return list;
}

// --- Calendar Component ---

function MiniCalendar({
  year,
  month,
  bookedRanges,
  selectedCheckIn,
  selectedCheckOut,
  onSelectDate,
}: {
  year: number;
  month: number;
  bookedRanges: DateRange[];
  selectedCheckIn: string;
  selectedCheckOut: string;
  onSelectDate: (dateStr: string) => void;
}) {
  const days = daysInMonth(year, month);
  const offset = firstDayOfWeek(year, month);
  const today = formatDate(new Date());
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return (
    <div>
      <div className="text-[#00ffff] text-xs mb-1 text-center">
        {monthNames[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-px text-[10px]">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[#555] py-0.5">
            {d}
          </div>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isPast = dateStr < today;
          const booked = isDateBooked(dateStr, bookedRanges);
          const isCheckIn = dateStr === selectedCheckIn;
          const isCheckOut = dateStr === selectedCheckOut;
          const inRange =
            selectedCheckIn &&
            selectedCheckOut &&
            dateStr > selectedCheckIn &&
            dateStr < selectedCheckOut;

          let cls = "text-center py-1 sm:py-0.5 cursor-pointer rounded-sm ";
          if (isPast) {
            cls += "text-[#333] cursor-default";
          } else if (booked) {
            cls += "text-[#ff4444]/60 line-through cursor-not-allowed";
          } else if (isCheckIn || isCheckOut) {
            cls += "bg-[#00ff00]/30 text-[#00ff00] font-bold";
          } else if (inRange) {
            cls += "bg-[#00ff00]/10 text-[#00ff00]";
          } else {
            cls += "text-[#888] hover:bg-[#1a3a1a] hover:text-[#00ff00]";
          }

          return (
            <div
              key={dateStr}
              className={cls}
              onClick={() => {
                if (!isPast && !booked) onSelectDate(dateStr);
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Property Card ---

function PropertyCard({
  property,
  onBook,
  onInquiry,
  calendarMonths,
}: {
  property: Property;
  onBook: (property: Property, form: BookingForm) => Promise<boolean>;
  onInquiry: (property: Property, form: BookingForm) => void;
  calendarMonths: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<"success" | "error" | null>(null);

  const months = getMonthList(calendarMonths);

  const handleDateSelect = (dateStr: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut("");
    } else if (dateStr > checkIn) {
      const hasBookedInRange = property.bookedRanges.some(
        (r) => r.start < dateStr && r.end > checkIn
      );
      if (hasBookedInRange) {
        setCheckIn(dateStr);
        setCheckOut("");
      } else {
        setCheckOut(dateStr);
      }
    } else {
      setCheckIn(dateStr);
      setCheckOut("");
    }
  };

  const hasDates = checkIn && checkOut && guests > 0;
  const canBook = hasDates && firstName && email;

  const handleBook = async () => {
    if (!canBook) return;
    setSubmitting(true);
    setBookingResult(null);
    const success = await onBook(property, {
      checkIn, checkOut, guests, firstName, lastName, email, phone, message,
    });
    setSubmitting(false);
    setBookingResult(success ? "success" : "error");
    if (success) {
      setTimeout(() => setBookingResult(null), 10000);
    }
  };

  const vacantDays = (() => {
    const today = formatDate(new Date());
    const lookAhead = calendarMonths * 30;
    let count = 0;
    for (let i = 0; i < lookAhead; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const ds = formatDate(d);
      if (ds >= today && !isDateBooked(ds, property.bookedRanges)) {
        count++;
      }
    }
    return count;
  })();

  const lookAheadDays = calendarMonths * 30;

  return (
    <div className="terminal-box">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[10px] px-1.5 py-0.5 border ${
                  property.type === "nah"
                    ? "border-[#ff88ff]/30 text-[#ff88ff]"
                    : "border-[#00ff00]/30 text-[#00ff00]"
                }`}
              >
                {property.type === "nah" ? "NOT A HOTEL" : "Enabler"}
              </span>
              <span className="text-[#555] text-[10px]">{property.capacity}</span>
            </div>
            <h3 className="text-[#00ff00] text-sm font-bold truncate">
              {property.name}
            </h3>
            <p className="text-[#555] text-xs">{property.location}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[#888] text-xs">
              {vacantDays}<span className="text-[#555]">/{lookAheadDays}日</span>
            </div>
            <div className="text-[#555] text-[10px]">空室</div>
            <span className="text-[#555] text-xs">
              {expanded ? "[-]" : "[+]"}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1a3a1a]">
          <p className="text-[#888] text-xs mt-3 mb-3">{property.description}</p>

          {/* Calendar grid — responsive columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {months.map((m) => (
              <MiniCalendar
                key={`${m.year}-${m.month}`}
                year={m.year}
                month={m.month}
                bookedRanges={property.bookedRanges}
                selectedCheckIn={checkIn}
                selectedCheckOut={checkOut}
                onSelectDate={handleDateSelect}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] mb-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#888]" /> 空室
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#ff4444]/60" /> 予約済
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#00ff00]/30" /> 選択中
            </span>
          </div>

          {/* Selected dates */}
          {checkIn && (
            <div className="text-xs mb-3">
              <span className="text-[#555]">check-in: </span>
              <span className="text-[#00ff00]">{checkIn}</span>
              {checkOut && (
                <>
                  <span className="text-[#555]"> → check-out: </span>
                  <span className="text-[#00ff00]">{checkOut}</span>
                  <span className="text-[#555]">
                    {" "}
                    ({Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)}泊)
                  </span>
                </>
              )}
            </div>
          )}

          {/* Booking result */}
          {bookingResult === "success" && (
            <div className="p-3 border border-[#00ff00]/30 bg-[#00ff00]/5 mb-3">
              <p className="text-[#00ff00] text-xs">予約が確定しました。確認メールをお送りします。</p>
            </div>
          )}
          {bookingResult === "error" && (
            <div className="p-3 border border-[#ff4444]/30 bg-[#ff4444]/5 mb-3">
              <p className="text-[#ff4444] text-xs">予約に失敗しました。日程を変更してお試しください。</p>
            </div>
          )}

          {/* Booking form */}
          {property.beds24PropertyId ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <div>
                  <label className="text-[#555] text-[10px] block mb-1">人数</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="bg-[#0a0a0a] border border-[#1a3a1a] text-[#888] text-xs px-2 py-1 focus:border-[#00ff00]/30 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n}名</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-w-[100px]">
                  <label className="text-[#555] text-[10px] block mb-1">姓 *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="山田"
                    className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#888] text-xs px-2 py-1 focus:border-[#00ff00]/30 focus:outline-none placeholder:text-[#333]"
                  />
                </div>
                <div className="flex-1 min-w-[100px]">
                  <label className="text-[#555] text-[10px] block mb-1">名</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="太郎"
                    className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#888] text-xs px-2 py-1 focus:border-[#00ff00]/30 focus:outline-none placeholder:text-[#333]"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[150px]">
                  <label className="text-[#555] text-[10px] block mb-1">メール *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#888] text-xs px-2 py-1 focus:border-[#00ff00]/30 focus:outline-none placeholder:text-[#333]"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="text-[#555] text-[10px] block mb-1">電話</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="090-1234-5678"
                    className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#888] text-xs px-2 py-1 focus:border-[#00ff00]/30 focus:outline-none placeholder:text-[#333]"
                  />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-[#555] text-[10px] block mb-1">メッセージ</label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="リクエストなど..."
                    className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#888] text-xs px-2 py-1 focus:border-[#00ff00]/30 focus:outline-none placeholder:text-[#333]"
                  />
                </div>
                <button
                  disabled={!canBook || submitting}
                  onClick={handleBook}
                  className={`px-4 py-1 text-xs border transition-colors flex-shrink-0 ${
                    canBook && !submitting
                      ? "border-[#00ff00]/50 text-[#00ff00] bg-[#00ff00]/10 hover:bg-[#00ff00]/20"
                      : "border-[#1a3a1a] text-[#333] cursor-not-allowed"
                  }`}
                >
                  {submitting ? "$ booking..." : "$ book --confirm"}
                </button>
              </div>
            </div>
          ) : (
            /* Inquiry form for NAH properties */
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="text-[#555] text-[10px] block mb-1">人数</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="bg-[#0a0a0a] border border-[#1a3a1a] text-[#888] text-xs px-2 py-1 focus:border-[#00ff00]/30 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n}名</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="text-[#555] text-[10px] block mb-1">メッセージ (任意)</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="リクエストなど..."
                  className="w-full bg-[#0a0a0a] border border-[#1a3a1a] text-[#888] text-xs px-2 py-1 focus:border-[#00ff00]/30 focus:outline-none placeholder:text-[#333]"
                />
              </div>
              <button
                disabled={!hasDates}
                onClick={() =>
                  onInquiry(property, { checkIn, checkOut, guests, firstName, lastName, email, phone, message })
                }
                className={`px-4 py-1 text-xs border transition-colors ${
                  hasDates
                    ? "border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/10"
                    : "border-[#1a3a1a] text-[#333] cursor-not-allowed"
                }`}
              >
                $ book --inquiry
              </button>
            </div>
          )}

          {/* External links */}
          <div className="mt-3 flex items-center gap-4">
            {property.airbnbUrl && (
              <a
                href={property.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#555] text-[10px] hover:text-[#00ffff] transition-colors"
              >
                Airbnbで確認 →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---

export default function BookingClient() {
  // "disconnected" = no wallet, "connecting", "connected" = wallet but <1000 EBR, "member" = >=1000 EBR
  const [authState, setAuthState] = useState<AuthState>("disconnected");
  const [walletAddress, setWalletAddress] = useState("");
  const [ebrBalance, setEbrBalance] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "enabler" | "nah">("all");
  const [inquiryStatus, setInquiryStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const isMember = authState === "member";
  const calendarMonths = isMember ? MONTHS_MEMBER : MONTHS_DEFAULT;

  // Check EBR balance
  const checkEBRBalance = useCallback(
    async (address: string): Promise<number> => {
      const res = await fetch(SOLANA_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            address,
            { mint: EBR_MINT },
            { encoding: "jsonParsed" },
          ],
        }),
      });
      const data = await res.json();
      if (data.result?.value?.length > 0) {
        const info =
          data.result.value[0].account.data.parsed.info.tokenAmount;
        return parseFloat(info.uiAmountString || "0");
      }
      return 0;
    },
    []
  );

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setError("");
      setAuthState("connecting");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const solana = (window as any).solana;
      if (!solana?.isPhantom) {
        setError("Phantom Walletが見つかりません。インストールしてください。");
        setAuthState("disconnected");
        return;
      }

      const resp = await solana.connect();
      const address: string = resp.publicKey.toString();
      setWalletAddress(address);

      const balance = await checkEBRBalance(address);
      setEbrBalance(balance);

      if (balance >= EBR_MIN_BALANCE) {
        setAuthState("member");
      } else {
        setAuthState("connected");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "ウォレット接続に失敗しました";
      setError(msg);
      setAuthState("disconnected");
    }
  }, [checkEBRBalance]);

  // Fetch properties
  const fetchProperties = useCallback(
    async (includeNah: boolean) => {
      setLoading(true);
      setError("");
      try {
        const url = includeNah
          ? "/api/booking/properties?include=nah"
          : "/api/booking/properties";
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setProperties(data.properties);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "物件データの取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create booking via Beds24
  const handleBook = useCallback(
    async (property: Property, form: BookingForm): Promise<boolean> => {
      try {
        const res = await fetch("/api/booking/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property.id,
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            guests: form.guests,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            message: form.message,
          }),
        });
        return res.ok;
      } catch {
        return false;
      }
    },
    []
  );

  // Submit inquiry (for NAH properties)
  const handleInquiry = useCallback(
    async (property: Property, form: BookingForm) => {
      setInquiryStatus("sending");
      try {
        const res = await fetch("/api/booking/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: property.id,
            propertyName: property.name,
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            guests: form.guests,
            message: form.message,
            walletAddress: walletAddress || "guest",
          }),
        });
        if (!res.ok) throw new Error("送信に失敗しました");
        setInquiryStatus("sent");
        setTimeout(() => setInquiryStatus("idle"), 5000);
      } catch {
        setInquiryStatus("error");
        setTimeout(() => setInquiryStatus("idle"), 3000);
      }
    },
    [walletAddress]
  );

  // Fetch Enabler properties immediately on mount
  useEffect(() => {
    fetchProperties(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch with NAH when member authenticated
  useEffect(() => {
    if (authState === "member") {
      fetchProperties(true);
    }
  }, [authState, fetchProperties]);

  // Visible properties based on auth
  const visibleProperties = isMember
    ? properties
    : properties.filter((p) => p.type === "enabler");

  const filtered =
    filter === "all"
      ? visibleProperties
      : visibleProperties.filter((p) => p.type === filter);

  const hasNah = properties.some((p) => p.type === "nah");

  return (
    <div className="grid-bg">
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="terminal-box p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1a3a1a]">
              <span className="text-[#555] text-xs">
                enablerdao@web3:~/booking$
              </span>
              <span className="text-[#00ff00] text-xs">
                reserve {isMember ? "--member" : "--public"}
              </span>
              <span className="cursor-blink text-[#00ff00] text-xs" />
            </div>

            <div className="mt-3">
              {/* Wallet status bar */}
              {(authState === "disconnected" || authState === "connected") && (
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <p className="text-[#888] mb-1">
                      Enabler民泊施設の空室確認・予約リクエスト
                    </p>
                    <p className="text-[#555] text-[10px]">
                      EBR {EBR_MIN_BALANCE.toLocaleString()}+
                      保有で NOT A HOTEL + 6ヶ月先まで表示
                    </p>
                  </div>
                  <button
                    onClick={connectWallet}
                    className="px-4 py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-xs hover:bg-[#00ff00]/20 transition-colors flex-shrink-0"
                  >
                    {authState === "connected"
                      ? "$ upgrade --ebr"
                      : "$ connect --wallet"}
                  </button>
                </div>
              )}

              {authState === "connecting" && (
                <p className="text-[#ffaa00] text-xs animate-pulse">
                  Connecting to Phantom Wallet...
                </p>
              )}

              {/* Connected but not member */}
              {authState === "connected" && walletAddress && (
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa00]" />
                  <span className="text-[#555]">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                  </span>
                  <span className="text-[#333]">|</span>
                  <span className="text-[#ffaa00]">
                    {ebrBalance.toLocaleString()} EBR
                  </span>
                  <span className="text-[#555] text-[10px]">
                    ({EBR_MIN_BALANCE.toLocaleString()}以上でNOT A HOTEL解放)
                  </span>
                </div>
              )}

              {/* Member */}
              {authState === "member" && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                  <span className="text-[#555]">
                    {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                  </span>
                  <span className="text-[#333]">|</span>
                  <span className="text-[#00ff00]">
                    {ebrBalance.toLocaleString()} EBR
                  </span>
                  <span className="text-[#333]">|</span>
                  <span className="text-[#00ffff]">MEMBER</span>
                  <span className="text-[#555] text-[10px]">
                    — NOT A HOTEL + 6ヶ月先表示
                  </span>
                </div>
              )}

              {error && (
                <p className="text-[#ff4444] text-xs mt-2">
                  <span className="text-[#555]">[</span>ERROR
                  <span className="text-[#555]">]</span> {error}
                </p>
              )}
            </div>
          </div>

          {/* Inquiry notification */}
          {inquiryStatus === "sent" && (
            <div className="terminal-box p-3 mb-4 border-[#00ff00]/30">
              <p className="text-[#00ff00] text-xs text-center">
                予約リクエストを送信しました。担当者より連絡いたします。
              </p>
            </div>
          )}
          {inquiryStatus === "error" && (
            <div className="terminal-box p-3 mb-4 border-[#ff4444]/30">
              <p className="text-[#ff4444] text-xs text-center">
                送信に失敗しました。もう一度お試しください。
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && properties.length === 0 && (
            <div className="terminal-box p-4 text-center">
              <p className="text-[#00ff00] text-xs animate-pulse">
                $ fetching properties and availability...
              </p>
            </div>
          )}

          {/* Properties */}
          {!loading && visibleProperties.length > 0 && (
            <>
              {/* Filter tabs — only show NAH tab for members */}
              <div className="flex items-center gap-0 mb-4">
                {[
                  { key: "all" as const, label: "ALL", count: visibleProperties.length },
                  {
                    key: "enabler" as const,
                    label: "Enabler",
                    count: visibleProperties.filter((p) => p.type === "enabler").length,
                  },
                  ...(isMember && hasNah
                    ? [
                        {
                          key: "nah" as const,
                          label: "NOT A HOTEL",
                          count: visibleProperties.filter((p) => p.type === "nah").length,
                        },
                      ]
                    : []),
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-3 py-1 text-xs border border-[#1a3a1a] -ml-px first:ml-0 transition-colors ${
                      filter === tab.key
                        ? "bg-[#1a3a1a] text-[#00ff00] border-b-[#0d0d0d]"
                        : "text-[#555] hover:text-[#00ff00] hover:bg-[#111]"
                    }`}
                  >
                    {tab.label}
                    <span className="text-[#333] ml-1">({tab.count})</span>
                  </button>
                ))}
              </div>

              {/* Property list */}
              <div className="space-y-3">
                {filtered.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onBook={handleBook}
                    onInquiry={handleInquiry}
                    calendarMonths={calendarMonths}
                  />
                ))}
              </div>

              {/* NOT A HOTEL teaser for non-members */}
              {!isMember && (
                <div className="terminal-box p-4 mt-4 border-[#ff88ff]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#ff88ff] text-xs mb-1">
                        NOT A HOTEL 3施設 — EBRメンバー限定
                      </p>
                      <p className="text-[#555] text-[10px]">
                        AOSHIMA (宮崎) / CLUB HOUSE ASAKUSA (東京) / CLUB HOUSE
                        HARUMI (東京)
                      </p>
                      <p className="text-[#444] text-[10px] mt-1">
                        EBR {EBR_MIN_BALANCE.toLocaleString()}
                        以上保有で空室確認・予約リクエストが可能になります
                      </p>
                    </div>
                    {authState === "disconnected" && (
                      <button
                        onClick={connectWallet}
                        className="px-3 py-1 border border-[#ff88ff]/30 text-[#ff88ff] text-xs hover:bg-[#ff88ff]/10 transition-colors flex-shrink-0"
                      >
                        $ unlock
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Info footer */}
              <div className="terminal-box p-4 mt-4">
                <p className="text-[#555] text-[10px] mb-1">
                  # 施設予約について
                </p>
                <p className="text-[#444] text-[10px] leading-relaxed">
                  Enabler民泊施設はどなたでも空室確認・直接予約が可能です（2ヶ月先まで表示）。
                  カレンダーで日程を選び、お名前・メールを入力して予約確定できます。
                  EBRトークンを{EBR_MIN_BALANCE.toLocaleString()}
                  以上保有するメンバーは、NOT A
                  HOTELの提携施設も利用でき、6ヶ月先までの空室状況を確認できます。
                </p>
                <p className="text-[#444] text-[10px] mt-2">
                  EBRトークンの取得方法は{" "}
                  <Link
                    href="/token"
                    className="text-[#00ffff] hover:text-[#00ff00] transition-colors"
                  >
                    ~/token
                  </Link>{" "}
                  を参照してください。
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
