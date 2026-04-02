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
      <main className="flex-1 w-full pt-16 pb-12 lg:pb-16 flex flex-col">
        <div className="max-w-6xl mx-auto w-full px-4 pt-4 lg:pt-8 flex-1">
          {children}
        </div>
        
        {/* Global Public Footer */}
        <footer className="w-full py-8 mt-12 text-center border-t border-slate-100/50 bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Powered By: Tamirat T ©2026
          </p>
        </footer>
      </main>
    </div>
  );
}
