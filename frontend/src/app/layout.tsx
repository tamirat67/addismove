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
      <body className={`${font.className} bg-slate-50 min-h-screen pt-16 pb-6 text-slate-800`}>
        <TenantProvider>
          <Navigation />
          <main className="max-w-5xl mx-auto p-4 lg:p-8">
            {children}
          </main>
        </TenantProvider>
      </body>
    </html>
  );
}
