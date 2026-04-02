"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveUpRight, Navigation, Map as MapIcon, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export function LiveMap() {
  const { tenant, theme } = useTenant();

  return (
    <Card className="border-0 shadow-sm overflow-hidden mb-6 group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">
          Live Tracking
        </CardTitle>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin-slow" />
          <span className="text-[10px] font-bold text-gray-400 uppercase">Updating</span>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative h-64 bg-slate-100 overflow-hidden">
        {/* Placeholder SVG Map */}
        <div className="absolute inset-0 bg-blue-50/50">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,20 L100,20 M0,50 L100,50 M0,80 L100,80 M20,0 L20,100 M50,0 L50,100 M80,0 L80,100" stroke="#000" strokeWidth="0.2" fill="none" />
            <path d="M10,10 Q50,40 90,90" stroke={theme.primary} strokeWidth="1" fill="none" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* Interactive Markers */}
        <motion.div 
          animate={{ x: [20, 50, 40], y: [30, 60, 50] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-10 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: theme.primary }}
        >
          <Navigation className="w-3 h-3 text-white rotate-45" />
        </motion.div>

        <motion.div 
          animate={{ x: [80, 40, 60], y: [10, 30, 20] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute z-10 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: tenant === "anbessa" ? "#49a5d7" : "#166534" }}
        >
          <Navigation className="w-3 h-3 text-white rotate-[120deg]" />
        </motion.div>

        <div className="absolute bottom-4 right-4 z-20">
          <button 
            className="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow text-gray-700 active:scale-95"
            style={{ color: theme.primary }}
          >
            <MapIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-bold text-gray-600 shadow-sm border border-white/40">
            {tenant === "anbessa" ? "BUS MAP ACTIVE" : "TRAIN NETWORK ACTIVE"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
