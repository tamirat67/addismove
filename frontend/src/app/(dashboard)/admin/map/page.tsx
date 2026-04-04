"use client";

import { useTenant } from "@/context/TenantContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LeafletMap } from "@/components/LeafletMap";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MapPin, Bus, Users, Activity, Navigation } from "lucide-react";

export default function FleetMapPage() {
  const { adminTheme, theme, buses, trips } = useTenant();
  const isDark = adminTheme === "zinc";

  const activeBuses = buses.filter(b => b.status === "Active");
  const activeTrips = trips.filter(t => t.status === "In Progress");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={`text-3xl font-black tracking-tight uppercase flex items-center gap-3 ${isDark ? "text-white" : "text-slate-800"}`}>
              Fleet <span style={{ color: theme.primary }}>Map</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              Real-time Addis Ababa bus network · OpenStreetMap
            </p>
          </motion.div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live · {activeBuses.length} Active Buses</span>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Buses", value: activeBuses.length, icon: Bus, color: theme.primary },
            { label: "Live Trips", value: activeTrips.length, icon: Navigation, color: "#3b82f6" },
            { label: "Total Stops", value: "13", icon: MapPin, color: "#10b981" },
            { label: "Total Passengers", value: activeTrips.reduce((a, t) => a + t.passengersCarried, 0), icon: Users, color: "#8b5cf6" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={`border-0 shadow-lg rounded-[1.75rem] ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-slate-50 border-slate-100"}`} style={{ color: s.color }}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{s.label}</p>
                    <p className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Full Leaflet Map */}
        <div className={`rounded-[3rem] overflow-hidden shadow-2xl border-4 ${isDark ? "border-zinc-800" : "border-white"}`}>
          <LeafletMap height="65vh" />
        </div>

        {/* Active Trip Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeTrips.map((trip, idx) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className={`border-0 shadow-lg rounded-[2rem] ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.primary}15` }}>
                        <Bus className="w-4 h-4" style={{ color: theme.primary }} />
                      </div>
                      <div>
                        <p className={`text-xs font-black uppercase ${isDark ? "text-white" : "text-slate-900"}`}>{trip.busPlate}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">{trip.driverName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Live</span>
                    </div>
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-tight truncate ${isDark ? "text-zinc-300" : "text-slate-700"}`}>{trip.route}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="text-[9px] font-black text-slate-500 uppercase">{trip.passengersCarried} pax</span>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 uppercase">{trip.revenue.toFixed(0)} ETB</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
