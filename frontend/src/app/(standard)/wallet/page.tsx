"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { TopUpDialog } from "@/components/TopUpDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, History, ArrowDownLeft, ArrowUpRight, ShieldCheck, Download, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Wallet() {
  const { balance, transactions } = useTenant();

  return (
    <div className="w-full px-4 lg:px-8 pb-32 lg:pb-12 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      <div className="flex flex-col lg:flex-row lg:items-end justify-between px-1 mb-10 gap-6 lg:gap-0">
        <div>
          <p className="text-[#CC1F1F] font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs mb-2">
            Anbessa Pro · Secure Wallet
          </p>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 uppercase leading-none">
            My <span style={{ color: "#CC1F1F" }}>Wallet</span>
          </h2>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-12 h-1 bg-[#FFD600] rounded-full"></span>
            <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Digital Transit Assets Secured
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-800 transition-all shadow-sm active:scale-95 items-center gap-2">
            <Download className="w-4 h-4" /> Download Statement
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Left Column: Core Finance (5 columns) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Balance Card - Cinematic Red */}
          <Card className="text-white overflow-hidden shadow-2xl border-0 relative rounded-[3rem]" 
                style={{ background: "linear-gradient(135deg, #CC1F1F 0%, #991B1B 100%)" }}>
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#FFD600]/10 rounded-full blur-3xl"></div>
            <CardContent className="p-10 relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Official Transit Account</span>
                  <p className="text-base font-black tracking-tight uppercase">Current Balance</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <motion.h2 
                  key={balance}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl lg:text-7xl font-black tracking-tighter"
                >
                  {balance.toFixed(2)} <span className="text-2xl lg:text-3xl font-bold opacity-60 ml-1">ETB</span>
                </motion.h2>
              </div>

              <div className="mt-12 flex gap-4">
                <TopUpDialog />
                <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md font-black text-[11px] uppercase tracking-widest h-14 rounded-2xl border border-white/20 text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg">
                  <Send className="w-4 h-4" /> Transfer
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Branded Reward Section */}
          <div className="rounded-[2rem] p-8 border-2 border-dashed border-[#FFD600]/30 bg-[#FFD600]/5 group hover:bg-[#FFD600]/10 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FFD600] rounded-lg">
                    <History className="w-4 h-4 text-[#CC1F1F]" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#CC1F1F]">Anbessa Rewards Active</h4>
            </div>
            <p className="text-base font-black text-slate-800 leading-tight uppercase tracking-tight">
              Earn 2x points on every <span className="text-[#CC1F1F]">Bus Rapid</span> pass purchased this week!
            </p>
          </div>
        </div>

        {/* Right Column: Activity & History (7 columns) */}
        <div className="lg:col-span-7">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Global Activity Log</h3>
              <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl w-full sm:w-auto border border-slate-200">
                <TabsTrigger value="all" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#CC1F1F] data-[state=active]:text-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest transition-all">All Records</TabsTrigger>
                <TabsTrigger value="recharges" className="rounded-xl px-6 py-3 data-[state=active]:bg-[#FFD600] data-[state=active]:text-[#CC1F1F] data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest transition-all">Top Ups</TabsTrigger>
                <TabsTrigger value="spends" className="rounded-xl px-6 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-lg font-black text-[10px] uppercase tracking-widest transition-all">Spends</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-4 mt-0 outline-none">
              {transactions.map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} index={i} />
              ))}
            </TabsContent>
            
            <TabsContent value="recharges" className="space-y-4 mt-0 outline-none">
              {transactions.filter(t => t.amount > 0).length > 0 ? (
                transactions.filter(t => t.amount > 0).map((tx, i) => (
                  <TransactionRow key={tx.id} tx={tx} index={i} />
                ))
              ) : (
                <EmptyState message="No Top Up history found." />
              )}
            </TabsContent>

            <TabsContent value="spends" className="space-y-4 mt-0 outline-none">
               {transactions.filter(t => t.amount < 0).length > 0 ? (
                transactions.filter(t => t.amount < 0).map((tx, i) => (
                  <TransactionRow key={tx.id} tx={tx} index={i} />
                ))
              ) : (
                <EmptyState message="No spending history found." />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ tx, index }: { tx: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-200/50 hover:border-[#FFD600]/30 cursor-pointer overflow-hidden rounded-[2rem] bg-white group hover:-translate-y-1">
        <CardContent className="p-5 lg:p-6 flex justify-between items-center">
          <div className="flex items-center gap-5 lg:gap-6">
            <div className={`p-4 lg:p-5 rounded-2xl transition-all shadow-inner ${
              tx.amount > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white" : "bg-slate-50 text-slate-500 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white"
            }`}>
              {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5 lg:w-6 lg:h-6" /> : <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6" />}
            </div>
            <div>
              <p className="font-black text-base lg:text-lg tracking-tighter uppercase transition-all group-hover:text-[#CC1F1F]">{tx.type}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> {tx.date}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-black text-lg lg:text-xl tracking-tighter ${tx.amount > 0 ? "text-emerald-600" : "text-slate-900"}`}>
              {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)} <span className="text-[10px] opacity-40">ETB</span>
            </p>
            <span 
              className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-100 mt-2 inline-block shadow-sm"
              style={{ color: tx.status === "Success" ? "#10b981" : "#f43f5e", backgroundColor: tx.status === "Success" ? "#10b98110" : "#f43f5e10" }}
            >
              {tx.status}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 border border-dashed border-slate-200 rounded-[3rem] animate-in fade-in duration-500">
      <div className="p-6 bg-white rounded-full shadow-inner mb-6">
        <History className="w-10 h-10 text-slate-300" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 max-w-[200px] leading-loose">{message}</p>
    </div>
  );
}
