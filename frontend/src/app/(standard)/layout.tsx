"use client";

import { Navigation } from "@/components/Navigation";

export default function StandardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 w-full pt-16 pb-20">
        <div className="max-w-6xl mx-auto w-full px-4 pt-4 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
