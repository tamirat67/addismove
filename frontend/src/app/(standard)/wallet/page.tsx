"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { TopUpDialog } from "@/components/TopUpDialog";
import { CreditCard, History, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Wallet() {
  const { balance, transactions } = useTenant();

  return (
    <div className="w-full px-4 pt-4 space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 uppercase">My Wallet</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Secure Digital Payments</p>
        </div>
        <button className="p-3 bg-white shadow-sm border border-slate-100 rounded-2xl text-slate-400 hover:text-[#060267] transition-all active:scale-95">
          <History className="w-5 h-5" />
        </button>
      </header>

      {/* Balance Card */}
      <Card className="bg-[#060267] text-white overflow-hidden shadow-2xl shadow-blue-900/20 border-0 relative rounded-[2.5rem]">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
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
              className="text-5xl font-black tracking-tighter"
            >
              {balance.toFixed(2)} <span className="text-xl font-bold opacity-60 ml-1">ETB</span>
            </motion.h2>
          </div>

          <div className="mt-10 flex gap-4">
            <TopUpDialog />
            <button className="flex-1 bg-white hover:bg-slate-100 text-[#060267] font-black text-xs uppercase tracking-widest h-12 rounded-[1.25rem] shadow-lg transition-all active:scale-[0.98]">
              Transfer
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity Log</h3>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest cursor-pointer hover:underline">Full History</span>
        </div>
        
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200 cursor-pointer overflow-hidden rounded-[1.5rem]">
                <CardContent className="p-4 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${tx.amount > 0 ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm leading-tight">{tx.type}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm tracking-tight ${tx.amount > 0 ? "text-emerald-600" : "text-slate-800"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}
                    </p>
                    <span 
                      className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-full border border-slate-100 mt-1 inline-block"
                      style={{ color: tx.status === "Success" ? "#10b981" : "#f43f5e" }}
                    >
                      {tx.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
