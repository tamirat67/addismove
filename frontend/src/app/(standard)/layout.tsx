"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function StandardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 w-full pt-[3.75rem] flex flex-col">
        {children}

        <Footer />
      </main>
    </div>
  );
}
