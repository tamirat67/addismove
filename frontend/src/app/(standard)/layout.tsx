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
        <footer className="w-full py-12 mt-auto text-center border-t border-[#CC1F1F10] bg-[#09090b]">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Powered By: Gemeda Tech Soln @ 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
