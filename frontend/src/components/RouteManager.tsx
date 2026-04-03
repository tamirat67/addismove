"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bus, MoreVertical, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { anbessaRoutes } from "@/lib/routes";

const routes = anbessaRoutes.slice(0, 5).map(r => ({
  id: r.id,
  name: `${r.start} - ${r.destination}`,
  status: true,
  vehicles: Math.floor(Math.random() * 10) + 5
}));

export function RouteManager() {
  const { theme } = useTenant();
  const [activeIds, setActiveIds] = useState<string[]>(routes.map(r => r.id));

  const toggleRoute = (id: string) => {
    setActiveIds((prev: string[]) => 
      prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
    );
  };

  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
            Fleet Management
          </CardTitle>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
            Real-time status tracking
          </p>
        </div>
        <button className="p-2 hover:bg-white rounded-xl transition-colors">
          <MoreVertical className="w-5 h-5 text-slate-400" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Line / Route</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4 text-right">Service</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {routes.map((route: any, i: number) => (
                  <motion.tr
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-white"
                          style={{ backgroundColor: `${theme.primary}10`, color: theme.primary }}
                        >
                          <Bus className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-black transition-colors">
                            {route.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: activeIds.includes(route.id) ? "#10b981" : "#f43f5e" }}
                            ></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {activeIds.includes(route.id) ? "Live" : "Standby"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-xs font-black text-slate-600">
                          {`${route.vehicles} Vehicles`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Switch 
                        checked={activeIds.includes(route.id)}
                        onCheckedChange={() => toggleRoute(route.id)}
                        className="data-[state=checked]:bg-emerald-500 scale-90"
                      />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
