import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RunGate Ticketing",
  description:
    "Multi-tenant event ticketing platform with tenant admin, checkout, Midtrans fallback, voucher, quota, and collection workflows.",
  openGraph: {
    title: "RunGate Ticketing",
    description:
      "A modern SaaS ticketing prototype for fun runs and future event types.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RunGate Ticketing",
    description:
      "A modern SaaS ticketing prototype for fun runs and future event types.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
