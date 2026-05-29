import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/layout/header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nova Store | Modern Shopping",
    template: "%s | Nova Store",
  },
  description:
    "Shop curated products across electronics, fashion, home, sports, and beauty at Nova Store. Fast browsing, smart filters, and a seamless cart experience.",
  keywords: [
    "Nova Store",
    "online shopping",
    "ecommerce",
    "electronics",
    "fashion",
    "home",
    "sports",
    "beauty",
    "curated products",
  ],
  openGraph: {
    title: "Nova Store | Modern Shopping",
    description:
      "Discover curated products across electronics, fashion, home, sports, and beauty.",
    url: "/",
    siteName: "Nova Store",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden">
        <Header />
        {children}
      </body>
    </html>
  );
}
