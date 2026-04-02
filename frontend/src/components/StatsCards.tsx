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
      value: tenant === "anbessa" ? "1,204" : "842",
      icon: Users,
      color: theme.primary,
      bg: `${theme.primary}10`,
    },
    {
      label: "Today's Revenue",
      value: tenant === "anbessa" ? "45,200 ETB" : "32,800 ETB",
      icon: TrendingUp,
      color: theme.primary,
      bg: `${theme.primary}10`,
    },
    {
      label: "Fleet Status",
      value: tenant === "anbessa" ? "92%" : "98%",
      icon: Activity,
      color: theme.primary,
      bg: `${theme.primary}10`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={`${tenant}-${stat.label}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="border-0 shadow-sm overflow-hidden relative group">
            <div 
              className="absolute left-0 top-0 w-1.5 h-full transition-all group-hover:w-2"
              style={{ backgroundColor: theme.primary }}
            ></div>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold tracking-tight" style={{ color: theme.text }}>
                  {stat.value}
                </h3>
              </div>
              <div 
                className="p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
