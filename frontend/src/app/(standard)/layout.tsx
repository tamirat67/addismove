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
      <main className="flex-1 w-full pt-[3.75rem] flex flex-col">
        {children}

        {/* Global Public Footer */}
        <footer className="w-full py-6 mt-auto text-center" style={{ backgroundColor: "#CC1F1F", borderTop: "4px solid #FFD600" }}>
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.7)" }}>
            <span style={{ color: "#FFD600" }}>Anbessa Bus</span> · Addis Ababa City Transport · ©2026
          </p>
        </footer>
      </main>
    </div>
  );
}
