import type { Metadata } from "next";
import { TicketingPlatform } from "./ticketing-platform";

export const metadata: Metadata = {
  title: "RunGate Ticketing",
  description:
    "Multi-tenant ticketing SaaS for fun runs, concerts, seminars, workshops, and collection workflows.",
};

export default function Home() {
  return <TicketingPlatform />;
}
