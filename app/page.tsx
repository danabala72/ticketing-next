import type { Metadata } from "next";
import { TicketingPlatform } from "./ticketing-platform";

export const metadata: Metadata = {
  title: "Eventra Ticketing",
  description:
    "Multi-tenant ticketing SaaS for fun runs, concerts, seminars, workshops, and collection workflows.",
};

export default function Home() {
  return <TicketingPlatform />;
}
