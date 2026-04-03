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
  const { theme, adminTheme } = useTenant();
  const [activeIds, setActiveIds] = useState<string[]>(routes.map(r => r.id));
  const isDark = adminTheme === "zinc";

  const toggleRoute = (id: string) => {
    setActiveIds((prev: string[]) => 
      prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
    );
  };

  return (
    <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden transition-colors ${
        isDark ? "bg-zinc-900" : "bg-white/80 backdrop-blur-sm"
    }`}>
      <CardHeader className={`flex flex-row items-center justify-between border-b px-8 py-6 ${
          isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-slate-50/50 border-slate-100"
      }`}>
        <div>
          <CardTitle className={`text-sm font-black uppercase tracking-widest ${
              isDark ? "text-white" : "text-slate-800"
          }`}>
            Fleet Management
          </CardTitle>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Real-time status tracking
          </p>
        </div>
        <button className={`p-2 rounded-xl transition-colors ${
            isDark ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-white text-slate-400"
        }`}>
          <MoreVertical className="w-5 h-5 font-black" />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase tracking-widest ${
                  isDark ? "border-zinc-800 text-zinc-500" : "border-slate-50 text-slate-400"
              }`}>
                <th className="px-8 py-5">Line / Route</th>
                <th className="px-8 py-5">Capacity</th>
                <th className="px-8 py-5 text-right">Service</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-zinc-800" : "divide-slate-50"}`}>
              <AnimatePresence mode="popLayout" initial={false}>
                {routes.map((route: any, i: number) => (
                  <motion.tr
                    key={route.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`group transition-all ${
                        isDark ? "hover:bg-zinc-800/50" : "hover:bg-slate-50/80"
                    }`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div 
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm border transition-colors ${
                              isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-white"
                          }`}
                          style={{ color: theme.primary }}
                        >
                          <Bus className="w-5 h-5 font-black" />
                        </div>
                        <div>
                          <p className={`text-sm font-black transition-colors ${
                              isDark ? "text-zinc-100 group-hover:text-white" : "text-slate-800 group-hover:text-black"
                          }`}>
                            {route.id}: {route.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span 
                              className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
                              style={{ color: activeIds.includes(route.id) ? "#10b981" : "#f43f5e", backgroundColor: "currentColor" }}
                            ></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                              {activeIds.includes(route.id) ? "Live Shift" : "Standby"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${
                          isDark ? "bg-zinc-950 border-zinc-800 text-zinc-400" : "bg-slate-50 border-slate-100 text-slate-600"
                      }`}>
                        <MapPin className={`w-4 h-4 ${isDark ? "text-zinc-600" : "text-slate-300"}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {`${route.vehicles} Units`}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Switch 
                        checked={activeIds.includes(route.id)}
                        onCheckedChange={() => toggleRoute(route.id)}
                        className="data-[state=checked]:bg-emerald-500 scale-100"
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
