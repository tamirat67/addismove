import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TenantProvider } from "@/context/TenantContext";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anbessa Bus",
  description: "Addis Ababa City Bus • Tap & Ride • Smart Transit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
          crossOrigin="" 
        />
      </head>
      <body className={`${font.className} bg-slate-50 min-h-screen text-slate-800`}>
        <TenantProvider>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
