"use client";

import { useTenant } from "@/context/TenantContext";
import { Card } from "@/components/ui/card";
import { Bus, Train } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LiveMap() {
  const { tenant, theme } = useTenant();

  return (
    <Card className="border shadow-sm border-gray-200 rounded-3xl overflow-hidden bg-gray-50 min-h-[400px] lg:h-[480px] relative w-full group">
      {/* Mock Map Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div style={{ backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", backgroundSize: "24px 24px" }} className="w-full h-full"></div>
      </div>
      
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200"></div>
          <span className="text-xs font-black text-gray-800 uppercase tracking-widest">
            Live Fleet Radar
          </span>
        </div>
        <div className="flex gap-2">
          <div className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase border border-gray-200">
            {tenant === "anbessa" ? "Hub: Piassa" : "Control: Stadium"}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
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
                  className="w-12 h-12 rounded-full blur-xl absolute -inset-2 opacity-30 transition-opacity group-hover/marker:opacity-50"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center relative border-2 border-white shadow-md transition-transform group-hover/marker:scale-110"
                  style={{ backgroundColor: theme.primary }}
                >
                  {tenant === "anbessa" ? (
                    <Bus className="w-4 h-4 text-white" />
                  ) : (
                    <Train className="w-4 h-4 text-white" />
                  )}
                  {/* Direction Arrow */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] rounded-sm" style={{ borderBottomColor: theme.primary }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Map Actions */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-2">
        <button className="flex-1 py-3 bg-white/95 hover:bg-white backdrop-blur-md rounded-xl text-xs font-bold text-gray-700 uppercase tracking-widest transition-all border border-gray-200 shadow-sm active:scale-95">
          Recenter
        </button>
        <button className="flex-1 py-3 bg-white/95 hover:bg-white backdrop-blur-md rounded-xl text-xs font-bold text-gray-700 uppercase tracking-widest transition-all border border-gray-200 shadow-sm active:scale-95">
          Filters
        </button>
      </div>
    </Card>
  );
}
