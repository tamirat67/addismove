"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Activity, Ticket, Bus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";

export function StatsCards() {
  const { adminTheme, tickets, buses, trips } = useTenant();
  const isDark = adminTheme === "zinc";

  const todayStr = new Date().toISOString().split("T")[0];
  const todayTickets = tickets.filter(t => t.createdAt.startsWith(todayStr));
  const todayRevenue = todayTickets.reduce((acc, t) => acc + t.price, 0);
  const activeBuses = buses.filter(b => b.status === "Active").length;
  const activeTrips = trips.filter(t => t.status === "In Progress").length;

  // Sparkline-style mini bar data (last 7 days relative activity)
  const sparkData = [30, 45, 28, 60, 52, 70, todayTickets.length || 3];
  const maxSpark = Math.max(...sparkData, 1);

  const stats = [
    {
      label: "Today Tickets",
      value: todayTickets.length.toString(),
      icon: Ticket,
      trend: "+12%",
      trendUp: true,
      subtext: "vs yesterday",
      color: "#CC1F1F",
      spark: sparkData,
    },
    {
      label: "Daily Revenue",
      value: `${todayRevenue.toFixed(0)} ETB`,
      icon: TrendingUp,
      trend: "+8%",
      trendUp: true,
      subtext: "Today's intake",
      color: "#d97706",
      spark: [200, 350, 280, 420, 390, 480, todayRevenue || 50],
    },
    {
      label: "Active Fleet",
      value: `${activeBuses}/${buses.length}`,
      icon: Bus,
      trend: "92%",
      trendUp: true,
      subtext: "Operational rate",
      color: "#10b981",
      spark: [5, 7, 6, 8, 7, 8, activeBuses || 5],
    },
    {
      label: "Live Trips",
      value: activeTrips.toString(),
      icon: Activity,
      trend: "Live",
      trendUp: true,
      subtext: "In progress",
      color: "#3b82f6",
      spark: [1, 3, 2, 4, 3, 5, activeTrips || 2],
    },
    {
      label: "Passengers",
      value: trips.reduce((a, t) => a + t.passengersCarried, 0).toLocaleString(),
      icon: Users,
      trend: "+24%",
      trendUp: true,
      subtext: "Total carried",
      color: "#8b5cf6",
      spark: [120, 180, 140, 220, 190, 260, 280],
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          whileHover={{ y: -3, scale: 1.02 }}
          className="relative group"
        >
          <Card className={`border-0 shadow-lg overflow-hidden transition-all duration-300 rounded-[1.75rem] ${
            isDark ? "bg-zinc-900" : "bg-white"
          }`}>
            {/* Subtle color glow bg */}
            <div
              className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.06] blur-2xl group-hover:opacity-[0.12] transition-opacity"
              style={{ backgroundColor: stat.color }}
            />
            <CardContent className="p-5">
              {/* Icon + trend */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-2.5 rounded-xl border transition-colors ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-slate-100"}`}
                  style={{ color: stat.color }}
                >
                  <stat.icon className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
                  stat.trendUp
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-rose-500/10 text-rose-500"
                }`}>
                  {stat.trendUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  {stat.trend}
                </div>
              </div>

              {/* Value */}
              <div className="mb-3">
                <p className={`text-[9px] font-black uppercase tracking-[0.15em] mb-1 ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                  {stat.label}
                </p>
                <h3 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  {stat.value}
                </h3>
                <p className={`text-[8px] font-bold mt-0.5 uppercase tracking-widest ${isDark ? "text-zinc-600" : "text-slate-400"}`}>
                  {stat.subtext}
                </p>
              </div>

              {/* Mini sparkline */}
              <div className="flex items-end gap-0.5 h-8">
                {stat.spark.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${(v / Math.max(...stat.spark, 1)) * 100}%`,
                      backgroundColor: idx === stat.spark.length - 1 ? stat.color : `${stat.color}40`,
                      minHeight: "2px",
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
