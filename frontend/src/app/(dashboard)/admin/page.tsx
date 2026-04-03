"use client";

import { useTenant, FLEET_REGISTRY } from "@/context/TenantContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { RouteManager } from "@/components/RouteManager";
import { LiveMap } from "@/components/LiveMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    TrendingUp, 
    ShieldCheck, 
    Activity, 
    BarChart3, 
    AlertCircle, 
    Ticket, 
    Scan, 
    CheckCircle2, 
    XCircle,
    Radio
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Admin() {
  const { theme, adminTheme, validateTicket, bulkIssueTickets, tickets } = useTenant();
  const isDark = adminTheme === "zinc";

  const [validateInput, setValidateInput] = useState("");
  const [validationResult, setValidationResult] = useState<null | { success: boolean, msg: string, ticket?: any }>(null);
  
  // -- STATION POS STATE --
  const [posRoute, setPosRoute] = useState(Object.keys(FLEET_REGISTRY)[0]);
  const [posBus, setPosBus] = useState(FLEET_REGISTRY[posRoute as keyof typeof FLEET_REGISTRY][0].plate);
  const [posQuantity, setPosQuantity] = useState(1);
  const [posSuccess, setPosSuccess] = useState(false);

  // Auto-sync bus when route changes
  const handleRouteLimit = (route: string) => {
    setPosRoute(route);
    const buses = (FLEET_REGISTRY as any)[route];
    if (buses && buses.length > 0) {
      setPosBus(buses[0].plate);
    }
  };

  const selectedDriver = (FLEET_REGISTRY as any)[posRoute]?.find((b: any) => b.plate === posBus)?.driver || "N/A";

  const handleBulkIssue = () => {
    bulkIssueTickets(posRoute, "Station Issue", 12.00, posBus, selectedDriver, posQuantity);
    setPosSuccess(true);
    setTimeout(() => setPosSuccess(false), 3000);
  };

  const handleValidate = (id?: string) => {
    const target = id || validateInput;
    if (!target) return;
    
    // Find ticket first for display
    const ticket = tickets.find(t => t.id === target || t.securityCode === target || t.nfcId === target);
    const success = validateTicket(target);
    
    setValidationResult({
        success,
        msg: success ? "Pass Validated. Welcome Aboard!" : "Invalid or Already Used Pass.",
        ticket: success ? ticket : undefined
    });
    
    setTimeout(() => setValidationResult(null), 6000); // Longer visibility for metadata
    setValidateInput("");
  };

  const handleMockNfc = () => {
    // Simulate finding the nearest active ticket for mock tap
    const activeTicket = tickets.find(t => t.status === "Active");
    if (activeTicket) {
        handleValidate(activeTicket.nfcId);
    } else {
        setValidationResult({ success: false, msg: "No Active NFC Signal Detected." });
        setTimeout(() => setValidationResult(null), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className={`text-3xl font-black tracking-tight uppercase flex items-center gap-3 ${isDark ? "text-white" : "text-slate-800"}`}>
              Control <span style={{ color: theme.primary }}>Center</span>
              <span className={`text-[10px] px-2.5 py-1 rounded-lg tracking-[0.2em] border font-black ${
                  isDark ? "bg-zinc-800 text-zinc-400 border-zinc-700" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                PRO
              </span>
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 
                Secure Terminal
              </p>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                Anbessa Fleet Network
              </p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-3">
            <button className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 border ${
                isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
              Fleet Report
            </button>
            <button 
              className="px-5 py-2.5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
              style={{ backgroundColor: theme.primary }}
            >
              System Export
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={adminTheme}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <StatsCards />
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              
              {/* OPERATIONAL HUB */}
              <div className="xl:col-span-4 space-y-8">
                {/* STATION POS */}
                <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden transition-colors ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-[#CC1F1F0F]">
                                <Ticket className="w-5 h-5 text-[#CC1F1F]" />
                            </div>
                            <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>Station POS</CardTitle>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multiple Ticket Issuance</p>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Route Path</label>
                                <select 
                                    value={posRoute}
                                    onChange={(e) => handleRouteLimit(e.target.value)}
                                    className={`w-full h-12 px-4 rounded-2xl font-bold transition-all outline-none border ${
                                        isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"
                                    }`}
                                >
                                    {Object.keys(FLEET_REGISTRY).map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Bus Targa</label>
                                    <select 
                                        value={posBus}
                                        onChange={(e) => setPosBus(e.target.value)}
                                        className={`w-full h-12 px-4 rounded-2xl font-bold outline-none border ${
                                            isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"
                                        }`}
                                    >
                                        {(FLEET_REGISTRY as any)[posRoute]?.map((b: any) => <option key={b.plate} value={b.plate}>{b.plate}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Quantity</label>
                                    <Input 
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={posQuantity}
                                        onChange={(e) => setPosQuantity(parseInt(e.target.value) || 1)}
                                        className={`h-12 rounded-2xl font-bold ${
                                            isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className={`p-4 rounded-2xl border border-dashed transition-all ${
                                isDark ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-200"
                            }`}>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Assigned Duty Officer</p>
                                <p className={`text-xs font-black uppercase ${isDark ? "text-emerald-500" : "text-[#CC1F1F]"}`}>{selectedDriver}</p>
                            </div>
                        </div>

                        <Button 
                            onClick={handleBulkIssue}
                            disabled={posSuccess}
                            className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all ${
                                posSuccess ? "bg-emerald-500 hover:bg-emerald-500" : ""
                            }`}
                            style={{ backgroundColor: posSuccess ? undefined : theme.primary }}
                        >
                            {posSuccess ? (
                                <span className="flex items-center gap-2 animate-in zoom-in duration-300">
                                    <CheckCircle2 className="w-4 h-4" /> Batch Issued Successfully
                                </span>
                            ) : `Issue ${posQuantity} Ticket${posQuantity > 1 ? 's' : ''} (Manual)`}
                        </Button>
                    </CardContent>
                </Card>

                {/* BOARDING VALIDATOR */}
                <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden transition-colors ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-[#CC1F1F0F]">
                                <Scan className="w-5 h-5 text-[#CC1F1F]" />
                            </div>
                            <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>Boarding Validator</CardTitle>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conductor Verification Tool</p>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-6">
                        <div className="relative">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-2">Scan ID / Security Code</label>
                            <Input 
                                placeholder="Enter ID or Code..."
                                value={validateInput}
                                onChange={(e) => setValidateInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleValidate()}
                                className={`h-12 rounded-2xl font-bold pr-12 ${
                                    isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"
                                }`}
                            />
                            <Button 
                                onClick={() => handleValidate()}
                                size="icon" 
                                className="absolute right-1 top-[29px] h-10 w-10 rounded-xl bg-slate-900 hover:bg-black text-white"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <Button 
                                onClick={handleMockNfc}
                                variant="outline" 
                                className={`h-14 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 group relative overflow-hidden ${
                                    isDark ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700" : "bg-slate-50 border-slate-100 hover:bg-slate-100"
                                }`}
                            >
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1] }} 
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-[#CC1F1F]/5 opacity-0 group-hover:opacity-100"
                                />
                                <Radio className="w-4 h-4 text-[#CC1F1F]" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Mock NFC Tap</span>
                            </Button>
                            <div className={`h-14 rounded-2xl border-2 flex items-center justify-center ${
                                isDark ? "bg-zinc-950 border-zinc-800" : "bg-slate-100 border-slate-200"
                            }`}>
                                <AnimatePresence mode="wait">
                                    {validationResult ? (
                                        <motion.div 
                                            key="result"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex flex-col items-center"
                                        >
                                            {validationResult.success ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-rose-500" />
                                            )}
                                        </motion.div>
                                    ) : (
                                        <div className="flex flex-col items-center py-2">
                                            <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Standby</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {validationResult && (
                             <div className="space-y-4">
                                <p className={`text-[10px] font-black text-center uppercase tracking-widest animate-pulse ${
                                    validationResult.success ? "text-emerald-500" : "text-rose-500"
                                }`}>
                                   {validationResult.msg}
                                </p>
                                
                                {validationResult.success && validationResult.ticket && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                                            isDark ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-100"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Bus Targa</span>
                                            <span className="text-xs font-black text-emerald-500 uppercase">{validationResult.ticket.plateNumber}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Duty Officer</span>
                                            <span className={`text-[10px] font-black uppercase ${isDark ? "text-white" : "text-slate-900"}`}>{validationResult.ticket.driverName.replace('Driver: ', '')}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-dashed mt-1 pt-2 transition-colors border-slate-200 dark:border-zinc-800">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Path</span>
                                            <span className={`text-[10px] font-black uppercase truncate max-w-[120px] ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{validationResult.ticket.route}</span>
                                        </div>
                                    </motion.div>
                                )}
                             </div>
                        )}
                    </CardContent>
                </Card>
              </div>

              {/* MAIN ANALYSIS & MAP */}
              <div className="xl:col-span-8 space-y-8">
                <Tabs defaultValue="live" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className={`p-1.5 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-slate-100 border-slate-200"}`}>
                      <TabsTrigger value="live" className={`rounded-xl font-black text-[10px] uppercase tracking-widest px-8 data-[state=active]:bg-[#CC1F1F] data-[state=active]:text-white ${isDark ? "text-zinc-500 bg-zinc-900" : "text-slate-400 bg-slate-100"}`}>
                        Live Tracking
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className={`rounded-xl font-black text-[10px] uppercase tracking-widest px-8 data-[state=active]:bg-[#CC1F1F] data-[state=active]:text-white ${isDark ? "text-zinc-500 bg-zinc-900" : "text-slate-400 bg-slate-100"}`}>
                        Fleet Analysis
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="live">
                    <div className={`p-1 rounded-[3rem] border-4 ${isDark ? "border-zinc-800 shadow-2xl shadow-black/50" : "border-white shadow-xl"}`}>
                        <LiveMap />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics">
                    <Card className={`border-0 shadow-xl rounded-[3rem] p-12 text-center transition-colors ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                        <BarChart3 className={`w-16 h-16 mx-auto mb-6 ${isDark ? "text-zinc-800" : "text-slate-100"}`} />
                        <h3 className={`text-lg font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>Generating Intelligence</h3>
                        <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto font-medium">Synthesizing real-time ridership data and fleet heatmaps for the current shift.</p>
                    </Card>
                  </TabsContent>
                </Tabs>
                
                <RouteManager />
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
