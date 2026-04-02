"use client";

import { useTenant } from "@/context/TenantContext";
import { Card } from "@/components/ui/card";
import { Bus, Train } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LiveMap() {
  const { tenant, theme } = useTenant();

  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] rounded-3xl overflow-hidden bg-slate-900 aspect-square lg:aspect-auto lg:h-[480px] relative group h-full">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            Live Fleet Radar
          </span>
        </div>
        <div className="flex gap-2">
          <div className="px-2 py-1 bg-white/10 rounded-lg text-[8px] font-bold text-white uppercase border border-white/5">
            {tenant === "anbessa" ? "Hub: Piassa" : "Control: Stadium"}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        {/* Mock Map Grid */}
        <div className="w-full h-full opacity-30 pointer-events-none">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 border border-white/5"></div>
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M10,10 Q50,40 90,90" 
              stroke={theme.primary} 
              strokeWidth="0.5" 
              fill="none" 
              strokeDasharray="2 2" 
            />
          </svg>
        </div>

        {/* Vehicle Markers */}
        <AnimatePresence>
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
              }}
              transition={{ 
                duration: 15 + Math.random() * 20, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "linear"
              }}
              className="absolute"
            >
              <div className="relative group/marker">
                <div 
                  className="w-12 h-12 rounded-full blur-xl absolute -inset-2 opacity-20 transition-opacity group-hover/marker:opacity-40"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center relative border border-white/20 shadow-2xl transition-transform group-hover/marker:scale-110"
                  style={{ backgroundColor: theme.primary }}
                >
                  {tenant === "anbessa" ? (
                    <Bus className="w-4 h-4 text-white" />
                  ) : (
                    <Train className="w-4 h-4 text-white" />
                  )}
                  {/* Direction Arrow */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-white/80"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Map Actions */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2">
        <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all border border-white/5 shadow-lg active:scale-95">
          Recenter
        </button>
        <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all border border-white/5 shadow-lg active:scale-95">
          Filters
        </button>
      </div>
    </Card>
  );
}
