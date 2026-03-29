import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "GuardClaw - OpenClaw Model Picker",
  description:
    "Answer five questions and get a recommended OpenClaw primary and fallback model stack with a copyable config snippet.",
  authors: [{ name: "Rohit Kumar Suman / GuardClaw" }],
  metadataBase: new URL("https://picker.guardclaw.dev"),
  alternates: {
    canonical: "https://guardclaw.dev/picker",
  },
  robots: {
    index: false,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    title: "GuardClaw - OpenClaw Model Picker",
    description:
      "Answer five questions and get a recommended OpenClaw primary and fallback model stack with a copyable config snippet.",
    url: "https://guardclaw.dev/picker",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
        <Analytics />
        <GoogleAnalytics GA_MEASUREMENT_ID="G-9P4049TPFT" />
      </body>
    </html>
  );
}
