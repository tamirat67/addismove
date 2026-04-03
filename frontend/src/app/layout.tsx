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
      <body className={`${font.className} bg-slate-50 min-h-screen text-slate-800`}>
        <TenantProvider>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
