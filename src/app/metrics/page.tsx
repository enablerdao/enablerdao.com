import { Metadata } from "next";
import MetricsClient from "./MetricsClient";

export const metadata: Metadata = {
  title: "Growth Metrics | EnablerDAO",
  description: "Real-time growth metrics across all EnablerDAO products",
};

export default function MetricsPage() {
  return <MetricsClient />;
}
