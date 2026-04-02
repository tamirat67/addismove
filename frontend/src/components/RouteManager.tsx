"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bus, Train, MoreVertical, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockRoutes = {
  anbessa: [
    { id: "a1", name: "Megenagna - Piassa", status: true, vehicles: 12 },
    { id: "a2", name: "Ayat - Bole", status: true, vehicles: 8 },
    { id: "a3", name: "Kality - Stadium", status: false, vehicles: 0 },
  ],
  lrt: [
    { id: "l1", name: "Ayat - Torhailoch (East-West)", status: true, trains: 10 },
    { id: "l2", name: "Kality - Menelik II (North-South)", status: true, trains: 6 },
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
    <Card className="border-0 shadow-sm mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">
          Management
        </CardTitle>
        <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="popLayout">
          {routes.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  {tenant === "anbessa" ? (
                    <Bus className="w-4 h-4" style={{ color: theme.primary }} />
                  ) : (
                    <Train className="w-4 h-4" style={{ color: theme.primary }} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{route.name}</p>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> 
                    {'vehicles' in route ? `${route.vehicles} Buses` : ('trains' in route ? `${route.trains} Trains` : '')}
                  </p>
                </div>
              </div>
              <Switch 
                checked={activeIds.includes(route.id)}
                onCheckedChange={() => toggleRoute(route.id)}
                className="data-[state=checked]:bg-green-500"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
