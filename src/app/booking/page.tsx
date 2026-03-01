import type { Metadata } from "next";
import BookingClient from "./BookingClient";

export const metadata: Metadata = {
  title: "Booking — EBRメンバー限定施設予約",
  description:
    "EBRトークン1,000以上保有者限定。Enabler民泊施設とNOT A HOTELの予約・空室確認ができます。",
};

export default function BookingPage() {
  return <BookingClient />;
}
