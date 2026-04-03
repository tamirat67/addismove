"use client";

import { useTenant } from "@/context/TenantContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { RouteManager } from "@/components/RouteManager";
import { LiveMap } from "@/components/LiveMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShieldCheck, Activity, BarChart3, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Admin() {
  const { tenant, theme } = useTenant();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            key={tenant}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-black tracking-tight text-slate-800 uppercase flex items-center gap-3">
              Control Center 
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 tracking-widest border border-slate-200">
                PRO
              </span>
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 
                Secure Session
              </p>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Network: Anbessa Bus
              </p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 transition-all shadow-sm active:scale-95">
              Refill Report
            </button>
            <button 
              className="px-4 py-2 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
              style={{ backgroundColor: theme.primary }}
            >
              Export CSV
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={tenant}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <StatsCards />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <Tabs defaultValue="live" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      <TabsTrigger value="live" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Live Tracking
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className="rounded-xl font-black text-[10px] uppercase tracking-widest px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Analysis
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="live">
                    <LiveMap />
                  </TabsContent>
                  
                  <TabsContent value="analytics">
                    <Card className="border-0 shadow-lg shadow-black/[0.03] rounded-3xl bg-white p-8">
                      <div className="h-[400px] flex flex-col items-center justify-center text-center">
                        <BarChart3 className="w-12 h-12 text-slate-200 mb-4" />
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Generating Metrics</h3>
                        <p className="text-xs text-slate-400 mt-1">Fetching real-time passenger data patterns...</p>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <RouteManager />
              </div>

              <div className="space-y-8">
                {/* Secondary Sidebar Stats */}
                <Card className="border-0 shadow-lg shadow-black/[0.03] rounded-3xl bg-white overflow-hidden">
                  <header 
                    className="p-4 flex items-center justify-between"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Log</span>
                    <Activity className="w-4 h-4 text-slate-300" />
                  </header>
                  <CardContent className="p-4 space-y-4">
                    {[
                      { type: "Warning", msg: "Line 4 delayed (12m)", time: "Just now" },
                      { type: "Success", msg: "Maintenance complete: V12", time: "18m ago" },
                      { type: "Update", msg: "Shift changed: Stadium Hub", time: "1h ago" }
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                          log.type === "Warning" ? "bg-amber-400" : log.type === "Success" ? "bg-emerald-400" : "bg-sky-400"
                        }`}></div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-700 leading-tight group-hover:text-black">{log.msg}</p>
                          <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase mt-1">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg shadow-black/[0.03] rounded-3xl bg-slate-800 text-white p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <AlertCircle className="w-8 h-8 opacity-20 mb-4" />
                    <h3 className="text-lg font-black tracking-tight mb-2 uppercase">Safety Protocol</h3>
                    <p className="text-xs text-slate-400 font-bold leading-relaxed">
                      All operators must verify fleet health status before 22:00 UTC shifts.
                    </p>
                    <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white text-xs font-black uppercase tracking-widest text-white hover:text-slate-900 rounded-xl transition-all border border-white/10">
                      View Procedures
                    </button>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
