"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bus, MoreVertical, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockRoutes = {
  anbessa: [
    { id: "a1", name: "Megenagna - Piassa", status: true, vehicles: 12 },
    { id: "a2", name: "Ayat - Bole", status: true, vehicles: 8 },
    { id: "a3", name: "Kality - Stadium", status: false, vehicles: 0 },
    { id: "a4", name: "Lebu - Mexico", status: true, vehicles: 6 },
    { id: "a5", name: "Shiro Meda - Merkato", status: true, vehicles: 9 },
  ],
};

export function RouteManager() {
  const { tenant, theme } = useTenant();
  const routes = mockRoutes[tenant];
  const [activeIds, setActiveIds] = useState(routes.map(r => r.id));

  const toggleRoute = (id: string) => {
    setActiveIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div>
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
            {tenant === "anbessa" ? "Fleet Management" : "Network Operations"}
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
                {routes.map((route, i) => (
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
