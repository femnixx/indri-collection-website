import React from "react";
import { Metadata } from "next";
import "./globals.css"; 

// Import komponen Analytics & Speed Insights dari Vercel
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

//import script ga4 analytics
import Script from "next/script";

// Import wrapper pengondisian rute admin
import LayoutContentWrapper from "../components/layout/LayoutContentWrapper";

export const metadata: Metadata = {
  title: "Indri Collection | Konveksi Inklusif & Jasa Jahit Malang",
  description:
    "Indri Collection adalah usaha konveksi pemberdayaan disabilitas di Malang, menghasilkan ragam pakaian dengan kualitas jahitan premium yang penuh ketelitian.",
  keywords: [
    "konveksi malang",
    "pemberdayaan disabilitas",
    "gamis malang",
    "tunik",
    "hijab",
    "Indri Collection",
    "jahitan",
    "permak baju malang",
    "jahit baju malang",
    "weave for change",
  ],
  verification: {
    google: "4Mpk9pVH-tT6SMvlwWbd0sVrOVJeJxX58kyJZ9SGTZ4",
  },
  alternates: {
    canonical: "https://indri-collection-website.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Indri Collection | Konveksi Inklusif & Jasa Jahit Malang",
    description:
      "Indri Collection adalah usaha konveksi pemberdayaan disabilitas di Malang, menghasilkan ragam pakaian dengan kualitas jahitan premium yang penuh ketelitian.",
    url: "https://indri-collection-website.vercel.app",
    siteName: "Indri Collection",
    images: [
      {
        url: "/about.webp",
        width: 1200,
        height: 630,
        alt: "Indri Collection Workshop",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Indri Collection | Konveksi Inklusif Malang",
    description:
      "Usaha konveksi pemberdayaan disabilitas di Malang dengan kualitas jahitan premium.",
    images: ["/about.webp"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className="min-h-screen bg-slate-50 antialiased text-slate-800"
        suppressHydrationWarning
      >
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-2CG3BPV3HG`}
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2CG3BPV3HG');
          `}
        </Script>

        {/* Aturan rute otomatis dieksekusi di dalam wrapper ini */}
        <LayoutContentWrapper>
          {children}
        </LayoutContentWrapper>

        {/* Tracking tools tetap berjalan global di latar belakang */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}