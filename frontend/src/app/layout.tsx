import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TenantProvider } from "@/context/TenantContext";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AddisMove",
  description: "One App • Bus + Train • Smart Travel",
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
