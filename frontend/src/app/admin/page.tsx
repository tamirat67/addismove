"use client";

import { useTenant } from "@/context/TenantContext";
import { TenantSwitcher } from "@/components/TenantSwitcher";
import { StatsCards } from "@/components/StatsCards";
import { RouteManager } from "@/components/RouteManager";
import { LiveMap } from "@/components/LiveMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TrendingUp, Settings, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Admin() {
  const { tenant, theme } = useTenant();

  return (
    <div className="space-y-6 pb-12">
      <header className="flex justify-between items-start">
        <div>
          <motion.h2 
            key={tenant}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tight uppercase"
            style={{ color: theme.text }}
          >
            {tenant === "anbessa" ? "Anbessa Bus" : "Addis LRT"}
          </motion.h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-green-500" /> Authorized Admin
          </p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
      </header>

      <TenantSwitcher />

      <AnimatePresence mode="wait">
        <motion.div
          key={tenant}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <StatsCards />
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl mb-4">
              <TabsTrigger value="overview" className="rounded-lg font-bold text-xs uppercase tracking-wider">Overview</TabsTrigger>
              <TabsTrigger value="reports" className="rounded-lg font-bold text-xs uppercase tracking-wider">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <LiveMap />
              <RouteManager />
            </TabsContent>
            
            <TabsContent value="reports">
              <Card className="border-dashed border-2 border-gray-200 shadow-none py-12 text-center bg-transparent">
                <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest">Generating Monthly Reports...</h3>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
