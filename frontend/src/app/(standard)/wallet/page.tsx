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
    <div className="w-full pb-20 lg:pb-0 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between px-1 mb-8">
        <div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-800 uppercase">My Wallet</h2>
          <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Digital Payments
          </p>
        </div>
        <div className="flex gap-3">
          <button className="hidden lg:flex px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all shadow-sm active:scale-95 items-center gap-2">
            <Download className="w-4 h-4" /> Statement
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Core Finance (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Balance Card */}
          <Card className="text-white overflow-hidden shadow-2xl border-0 relative rounded-[2.5rem]" style={{ backgroundColor: "#CC1F1F" }}>
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl transition-transform duration-1000 hover:scale-110"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-widest italic">Personal Account</span>
                  <p className="text-sm font-bold tracking-tight">Active Balance</p>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-1">
                <motion.h2 
                  key={balance}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl lg:text-6xl font-black tracking-tighter"
                >
                  {balance.toFixed(2)} <span className="text-xl lg:text-2xl font-bold opacity-60 ml-1">ETB</span>
                </motion.h2>
              </div>

              <div className="mt-10 flex gap-4">
                <TopUpDialog />
                <button className="flex-1 bg-white hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest h-12 rounded-[1.25rem] shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2" style={{ color: "#CC1F1F" }}>
                  <Send className="w-4 h-4" /> Transfer
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats or Promo Space */}
          <div className="hidden lg:block rounded-3xl p-6" style={{ background: "linear-gradient(135deg, #FFD60015, transparent)", border: "1px solid #FFD60030" }}>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#CC1F1F" }}>Rewards Active</h4>
            <p className="text-sm font-bold text-slate-700 leading-snug">
              Earn 2x points on every Anbessa Bus pass purchased this week!
            </p>
          </div>
        </div>

        {/* Right Column: Activity & History (7 columns) */}
        <div className="lg:col-span-7">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-[10px] hidden sm:block font-black text-slate-400 uppercase tracking-[0.2em] px-2">Activity Log</h3>
              <TabsList className="bg-white border border-slate-100 shadow-sm p-1.5 rounded-2xl w-full sm:w-auto">
                <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-sm" style={{ ['--tw-data-state-active-bg' as string]: '#CC1F1F' }}>All</TabsTrigger>
                <TabsTrigger value="recharges" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-sm">Recharges</TabsTrigger>
                <TabsTrigger value="spends" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-rose-500 data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-sm">Spends</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-3 mt-0 outline-none">
              {transactions.map((tx, i) => (
                <TransactionRow key={tx.id} tx={tx} index={i} />
              ))}
            </TabsContent>
            
            <TabsContent value="recharges" className="space-y-3 mt-0 outline-none">
              {transactions.filter(t => t.amount > 0).length > 0 ? (
                transactions.filter(t => t.amount > 0).map((tx, i) => (
                  <TransactionRow key={tx.id} tx={tx} index={i} />
                ))
              ) : (
                <EmptyState message="No recharges found." />
              )}
            </TabsContent>

            <TabsContent value="spends" className="space-y-3 mt-0 outline-none">
               {transactions.filter(t => t.amount < 0).length > 0 ? (
                transactions.filter(t => t.amount < 0).map((tx, i) => (
                  <TransactionRow key={tx.id} tx={tx} index={i} />
                ))
              ) : (
                <EmptyState message="No spends found." />
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/40 hover:border-slate-200 cursor-pointer overflow-hidden rounded-[1.5rem] bg-white group">
        <CardContent className="p-4 lg:p-5 flex justify-between items-center">
          <div className="flex items-center gap-4 lg:gap-5">
            <div className={`p-3 lg:p-4 rounded-2xl transition-colors ${
              tx.amount > 0 ? "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100" : "bg-rose-50 text-rose-500 group-hover:bg-rose-100"
            }`}>
              {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5 lg:w-6 lg:h-6" /> : <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6" />}
            </div>
            <div>
              <p className="font-black text-sm lg:text-base tracking-tight transition-all group-hover:text-[color:#CC1F1F]">{tx.type}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 lg:mt-1.5">{tx.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-black text-sm lg:text-base tracking-tight ${tx.amount > 0 ? "text-emerald-600" : "text-slate-800"}`}>
              {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}
            </p>
            <span 
              className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border border-slate-100 mt-1 inline-block"
              style={{ color: tx.status === "Success" ? "#10b981" : "#f43f5e" }}
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
    <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 border border-dashed border-slate-200 rounded-[2rem]">
      <History className="w-10 h-10 text-slate-300 mb-4" />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{message}</p>
    </div>
  );
}
