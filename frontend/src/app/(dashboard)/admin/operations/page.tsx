"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Bus, User, MapPin, Clock, CheckCircle2,
  XCircle, Loader2, TrendingUp, Calendar, ArrowRight,
  ChevronDown, ChevronUp
} from "lucide-react";

const TRIP_STATUS_STYLES: Record<string, { badge: string; icon: any }> = {
  "In Progress": { badge: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Loader2 },
  "Completed": { badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", icon: CheckCircle2 },
  "Cancelled": { badge: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: XCircle },
};

export default function OperationsPage() {
  const { trips, drivers, buses, adminTheme, theme } = useTenant();
  const isDark = adminTheme === "zinc";
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredTrips = trips.filter(t => filterStatus === "All" || t.status === filterStatus);
  const totalRevenue = trips.filter(t => t.status === "Completed").reduce((a, t) => a + t.revenue, 0);
  const totalPassengers = trips.filter(t => t.status === "Completed").reduce((a, t) => a + t.passengersCarried, 0);
  const inProgressTrips = trips.filter(t => t.status === "In Progress");

  const formatDuration = (start: string, end: string | null) => {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();
    const mins = Math.round((e.getTime() - s.getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-ET", { hour: "2-digit", minute: "2-digit" });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={`text-3xl font-black tracking-tight uppercase flex items-center gap-3 ${isDark ? "text-white" : "text-slate-800"}`}>
              Operations <span style={{ color: theme.primary }}>Hub</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              Live & historical trip activity · Driver logs
            </p>
          </motion.div>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Trips", value: inProgressTrips.length, icon: Activity, color: "#3b82f6" },
            { label: "Completed Today", value: trips.filter(t => t.status === "Completed").length, icon: CheckCircle2, color: "#10b981" },
            { label: "Total Revenue", value: `${totalRevenue.toFixed(0)} ETB`, icon: TrendingUp, color: theme.primary },
            { label: "Passengers", value: totalPassengers.toString(), icon: User, color: "#8b5cf6" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={`border-0 shadow-lg rounded-[1.75rem] ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-slate-50 border-slate-100"}`} style={{ color: s.color }}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{s.label}</p>
                  <h3 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{s.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Live In-Progress Feed */}
        {inProgressTrips.length > 0 && (
          <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}>
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>
                  Live Operations Feed
                </CardTitle>
                <span className="text-[9px] font-black px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 uppercase tracking-widest animate-pulse">
                  {inProgressTrips.length} Active
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-3">
              {inProgressTrips.map((trip) => (
                <div key={trip.id} className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-blue-50/50 border-blue-100"}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                      <Bus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-xs font-black uppercase ${isDark ? "text-white" : "text-slate-900"}`}>{trip.busPlate}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{trip.driverName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[160px]">{trip.route}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className={`text-[10px] font-black ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{formatDuration(trip.startTime, null)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{trip.passengersCarried} pax</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Trip Log Table */}
        <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}>
          <CardHeader className="p-8 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#CC1F1F0F]">
                  <Calendar className="w-5 h-5 text-[#CC1F1F]" />
                </div>
                <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>
                  Trip Ledger
                </CardTitle>
              </div>
              <div className={`flex items-center gap-1 p-1 rounded-xl border ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-slate-50 border-slate-100"}`}>
                {["All", "In Progress", "Completed", "Cancelled"].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      filterStatus === s ? "text-white shadow-sm" : isDark ? "text-zinc-500" : "text-slate-400"
                    }`}
                    style={{ backgroundColor: filterStatus === s ? theme.primary : "transparent" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50 dark:divide-zinc-800">
              <AnimatePresence>
                {filteredTrips.map((trip, idx) => {
                  const StatusIcon = TRIP_STATUS_STYLES[trip.status]?.icon || CheckCircle2;
                  const isExpanded = expandedId === trip.id;
                  return (
                    <motion.div key={trip.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}>
                      <div
                        className={`px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-all ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-slate-50/80"}`}
                        onClick={() => setExpandedId(isExpanded ? null : trip.id)}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-slate-50 border-slate-100"}`} style={{ color: theme.primary }}>
                            <Bus className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{trip.busPlate}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{trip.driverName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 flex-1 min-w-0">
                          <span className="truncate">{trip.startStop}</span>
                          <ArrowRight className="w-3 h-3 shrink-0 text-slate-300" />
                          <span className="truncate">{trip.endStop}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right hidden md:block">
                            <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>Revenue</p>
                            <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>{trip.revenue.toFixed(0)} ETB</p>
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${TRIP_STATUS_STYLES[trip.status]?.badge}`}>
                            <StatusIcon className={`w-3 h-3 ${trip.status === "In Progress" ? "animate-spin" : ""}`} />
                            {trip.status}
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`px-8 pb-5 overflow-hidden ${isDark ? "bg-zinc-950/50" : "bg-slate-50/50"}`}
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                              {[
                                { label: "Start Time", value: formatTime(trip.startTime) },
                                { label: "End Time", value: trip.endTime ? formatTime(trip.endTime) : "Ongoing" },
                                { label: "Duration", value: formatDuration(trip.startTime, trip.endTime) },
                                { label: "Passengers", value: `${trip.passengersCarried} pax` },
                              ].map(d => (
                                <div key={d.label} className={`p-4 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-100"}`}>
                                  <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isDark ? "text-zinc-600" : "text-slate-400"}`}>{d.label}</p>
                                  <p className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>{d.value}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Driver Status Grid */}
        <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}>
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10">
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>
                Driver Status Board
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {drivers.map((driver, idx) => {
                const statusColors: Record<string, string> = {
                  "On Duty": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                  "Off Duty": "text-slate-400 bg-slate-500/10 border-slate-500/20",
                  "Leave": "text-amber-500 bg-amber-500/10 border-amber-500/20",
                };
                return (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${isDark ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-100"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white font-black text-sm">
                        {driver.name.charAt(0)}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusColors[driver.status]}`}>
                        {driver.status}
                      </span>
                    </div>
                    <p className={`text-xs font-black uppercase tracking-tight mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{driver.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">{driver.assignedBus}</p>
                    <div className="flex items-center gap-1.5">
                      {"★★★★★".split("").map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.floor(driver.rating) ? "text-amber-400" : "text-slate-200"}`}>★</span>
                      ))}
                      <span className="text-[9px] font-black text-slate-400 ml-1">{driver.rating}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
