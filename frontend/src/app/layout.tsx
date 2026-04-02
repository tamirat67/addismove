import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
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
          <Navigation />
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </TenantProvider>
      </body>
    </html>
  );
}
