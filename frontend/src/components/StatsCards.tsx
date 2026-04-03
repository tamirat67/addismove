"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function StatsCards() {
  const { tenant, theme, adminTheme, tickets } = useTenant();
  const isDark = adminTheme === "zinc";

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTickets = tickets.filter(t => t.createdAt.startsWith(todayStr));
  const todayRevenue = todayTickets.reduce((acc, t) => acc + t.price, 0);

  const stats = [
    {
      label: "Today Tickets",
      value: todayTickets.length.toString(),
      icon: Users,
      trend: "Real-time",
      subtext: "Total Assets Sold",
      color: "#CC1F1F", // Anbessa Red
    },
    {
      label: "Daily Revenue",
      value: `${todayRevenue.toFixed(2)} ETB`,
      icon: TrendingUp,
      trend: "+0%",
      subtext: "Today's Intake",
      color: "#FFD600", // Anbessa Gold
    },
    {
      label: "Fleet Health",
      value: "92%",
      icon: Activity,
      trend: "Optimal",
      subtext: "42/45 Units Active",
      color: "#10b981", // Emerald
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={`${tenant}-${stat.label}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -4 }}
          className="relative group"
        >
          <Card className={`border-0 shadow-xl overflow-hidden transition-all duration-500 rounded-[2rem] ${
              isDark ? "bg-zinc-900 border-zinc-800" : "bg-white hover:bg-slate-50/50 backdrop-blur-sm"
          }`}>
            <div 
              className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.05] blur-3xl group-hover:opacity-[0.1] transition-opacity"
              style={{ backgroundColor: stat.color }}
            ></div>
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div 
                  className={`p-4 rounded-2xl shadow-inner border transition-colors ${
                      isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-white"
                  }`}
                  style={{ color: stat.color }}
                >
                  <stat.icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="flex flex-col items-end">
                  <span 
                    className="text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm border border-white/10"
                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                  >
                    {stat.trend}
                  </span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 px-1">
                    {stat.subtext}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                  {stat.label}
                </p>
                <h3 className={`text-3xl font-black tracking-tight transition-colors ${
                    isDark ? "text-white" : "text-slate-900"
                }`}>
                  {stat.value}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
