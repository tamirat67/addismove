"use client";

import { useTenant, FLEET_REGISTRY } from "@/context/TenantContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCards } from "@/components/StatsCards";
import { RouteManager } from "@/components/RouteManager";
import { LeafletMap } from "@/components/LeafletMap";
import { TicketLog } from "@/components/TicketLog";
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
    Radio,
    Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Admin() {
  const { theme, adminTheme, validateTicket, bulkIssueTickets, tickets } = useTenant();
  const isDark = adminTheme === "zinc";

  const [reportPeriod, setReportPeriod] = useState<"today" | "weekly" | "monthly">("today");
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
  
  // -- DYNAMIC ANALYTICS ENGINE --
  const getFilteredTickets = () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    if (reportPeriod === "today") {
        return tickets.filter(t => t.createdAt.startsWith(todayStr));
    }
    
    const days = reportPeriod === "weekly" ? 7 : 30;
    const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return tickets.filter(t => new Date(t.createdAt) >= threshold);
  };

  const periodTickets = getFilteredTickets();
  const periodTotalSold = periodTickets.length;
  const periodRevenue = periodTickets.reduce((acc, t) => acc + t.price, 0);

  // Grouping logic for period-aware breakdowns
  const salesByRoute = periodTickets.reduce((acc: any, t) => {
    acc[t.route] = (acc[t.route] || 0) + 1;
    return acc;
  }, {});

  const salesByBus = periodTickets.reduce((acc: any, t) => {
    const key = t.plateNumber;
    if (!acc[key]) {
        acc[key] = { count: 0, revenue: 0, driver: t.driverName.replace('Driver: ', '') };
    }
    acc[key].count += 1;
    acc[key].revenue += t.price;
    return acc;
  }, {});

  const topBus = Object.entries(salesByBus).sort((a: any, b: any) => b[1].count - a[1].count)[0];

  const todayStr = new Date().toISOString().split('T')[0];

  // -- BUS MANIFEST (FOR NO-ID VALIDATION) --
  const busManifest = tickets.filter(t => 
    t.plateNumber === posBus && 
    t.status === "Active" &&
    t.createdAt.startsWith(todayStr)
  );

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

                {/* LIVE PASSENGER MANIFEST */}
                <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden transition-colors ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10">
                                    <Users className="w-5 h-5 text-emerald-500" />
                                </div>
                                <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>Bus Manifest</CardTitle>
                            </div>
                            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 uppercase tracking-widest">
                                {busManifest.length} Waiting
                            </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Assets for {posBus}</p>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-4">
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {busManifest.length > 0 ? busManifest.map((ticket) => (
                                <div key={ticket.id} className={`p-4 rounded-2xl border flex items-center justify-between group transition-all hover:scale-[1.02] ${
                                    isDark ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-slate-100"
                                }`}>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-tight">{ticket.id.split('-').pop()}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Code: {ticket.securityCode}</p>
                                    </div>
                                    <Button 
                                        onClick={() => handleValidate(ticket.id)}
                                        size="sm"
                                        className="h-8 px-4 rounded-xl text-[8px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Verify Boarding
                                    </Button>
                                </div>
                            )) : (
                                <div className="text-center py-12 space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto">
                                        <Users className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.2em]">No Passengers Enrolled</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
              </div>

              {/* MAIN ANALYSIS & MAP */}
              <div className="xl:col-span-8 space-y-8">
                <Tabs defaultValue="live" className="w-full">
                  <div className="flex items-center justify-between mb-4 w-full">
                    <TabsList className={`h-auto flex-wrap w-full p-1.5 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-slate-100 border-slate-200"}`}>
                      <TabsTrigger value="live" className={`flex-1 min-w-[100px] rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-2.5 data-[state=active]:bg-[#CC1F1F] data-[state=active]:text-white ${isDark ? "text-zinc-500 bg-zinc-900" : "text-slate-400 bg-slate-100"}`}>
                        Live Tracking
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className={`flex-1 min-w-[100px] rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-2.5 data-[state=active]:bg-[#CC1F1F] data-[state=active]:text-white ${isDark ? "text-zinc-500 bg-zinc-900" : "text-slate-400 bg-slate-100"}`}>
                        Fleet Analysis
                      </TabsTrigger>
                      <TabsTrigger value="tickets" className={`flex-1 min-w-[100px] rounded-xl font-black text-[10px] uppercase tracking-widest px-4 py-2.5 data-[state=active]:bg-[#CC1F1F] data-[state=active]:text-white ${isDark ? "text-zinc-500 bg-zinc-900" : "text-slate-400 bg-slate-100"}`}>
                        Ticket Ledger
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="live">
                    <div className={`rounded-[2.5rem] overflow-hidden border-4 ${isDark ? "border-zinc-800 shadow-2xl shadow-black/50" : "border-white shadow-xl"}`}>
                        <LeafletMap height="580px" />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 rounded-2xl border bg-slate-50/50 dark:bg-zinc-800/20 border-slate-100 dark:border-zinc-800">
                        {["today", "weekly", "monthly"].map((period) => (
                            <button
                                key={period}
                                onClick={() => setReportPeriod(period as any)}
                                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                    reportPeriod === period 
                                    ? "bg-white dark:bg-zinc-800 shadow-md text-[#CC1F1F]" 
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {period} Statistics
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Route Performance */}
                        <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Sold per Route</CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 space-y-4">
                                {Object.entries(salesByRoute).length > 0 ? Object.entries(salesByRoute).map(([route, count]) => (
                                    <div key={route} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#CC1F1F]"></div>
                                            <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[150px]">{route}</span>
                                        </div>
                                        <span className="text-sm font-black tracking-tighter" style={{ color: theme.primary }}>{count as number} <span className="text-[10px] uppercase opacity-40 ml-1">Tickets</span></span>
                                    </div>
                                )) : (
                                    <p className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-slate-300">No Sales for {reportPeriod}</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Bus Performance Leaderboard</CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 space-y-4">
                                {Object.entries(salesByBus).length > 0 ? Object.entries(salesByBus)
                                    .sort((a: any, b: any) => b[1].count - a[1].count)
                                    .map(([plate, data]: any, idx) => (
                                    <div key={plate} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                        idx === 0 
                                        ? "bg-[#FFD60010] border-[#FFD60030] shadow-sm" 
                                        : "bg-slate-50/50 dark:bg-zinc-800/50 border-slate-100 dark:border-zinc-800"
                                    }`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                                                idx === 0 ? "bg-[#FFD600] text-[#CC1F1F]" : "bg-slate-200 dark:bg-zinc-700 text-slate-500"
                                            }`}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-tight">{plate}</span>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{data.driver}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black tracking-tighter">{data.count} <span className="text-[8px] opacity-40 ml-0.5">X 12 ETB</span></p>
                                            <p className={`text-[10px] font-black ${idx === 0 ? "text-emerald-500" : "text-slate-400"}`}>= {data.revenue.toFixed(2)} ETB</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center py-10 text-[10px] font-black uppercase tracking-widest text-slate-300">No Fleet Activity for {reportPeriod}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary Row */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className={`p-8 rounded-[2.5rem] flex items-center justify-between ${isDark ? "bg-[#CC1F1F10] border border-[#CC1F1F20]" : "bg-[#CC1F1F05] border border-[#CC1F1F10]"}`}>
                            <div>
                                <p className="text-[10px] font-black text-[#CC1F1F] uppercase tracking-[0.25em] mb-1">Total {reportPeriod} Sold</p>
                                <p className="text-4xl font-black tracking-tighter">{periodTotalSold}</p>
                            </div>
                            <Ticket className="w-12 h-12 text-[#CC1F1F] opacity-20" />
                        </div>
                        <div className={`p-8 rounded-[2.5rem] flex items-center justify-between ${isDark ? "bg-[#FFD60010] border border-[#FFD60020]" : "bg-[#FFD60008] border border-[#FFD60015]"}`}>
                            <div>
                                <p className="text-[10px] font-black text-[#B09400] uppercase tracking-[0.25em] mb-1">Total {reportPeriod} Revenue</p>
                                <p className="text-4xl font-black tracking-tighter">{periodRevenue.toFixed(2)} <span className="text-sm">ETB</span></p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-[#FFD600] opacity-20" />
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tickets">
                    <TicketLog />
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
