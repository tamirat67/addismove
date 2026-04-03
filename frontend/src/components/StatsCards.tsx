"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function StatsCards() {
  const { tenant, theme } = useTenant();

  const stats = [
    {
      label: "Active Passengers",
      value: "1,204",
      icon: Users,
      trend: "+12.5%",
      subtext: "vs last hour",
      color: "#CC1F1F",
    },
    {
      label: "Today's Revenue",
      value: "45,200 ETB",
      icon: TrendingUp,
      trend: "+8.2%",
      subtext: "vs yesterday",
      color: "#FFD600",
    },
    {
      label: "Fleet Status",
      value: "92%",
      icon: Activity,
      trend: "Optimal",
      subtext: "42/45 active",
      color: "#10b981",
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
          <Card className="border-0 shadow-lg shadow-black/[0.03] overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-3xl">
            <div 
              className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] blur-2xl group-hover:opacity-[0.08] transition-opacity"
              style={{ backgroundColor: stat.color }}
            ></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="p-3 rounded-2xl shadow-inner border border-white/50"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                  <span 
                    className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
                    style={{ backgroundColor: `${stat.color}10`, color: stat.color }}
                  >
                    {stat.trend}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    {stat.subtext}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black tracking-tight text-slate-800">
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
