"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { TopUpDialog } from "@/components/TopUpDialog";
import { CreditCard, History, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Wallet() {
  const { balance, transactions } = useTenant();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#060267]">My Wallet</h2>
        <History className="text-gray-400 w-5 h-5 hover:text-[#060267] cursor-pointer transition-colors" />
      </div>

      <Card className="bg-gradient-to-br from-[#060267] to-[#1a118c] text-white overflow-hidden shadow-lg border-0 relative">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#49a5d7]/20 rounded-full blur-2xl"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <span className="text-white/80 text-sm font-medium">Available Balance</span>
            <CreditCard className="w-6 h-6 text-white/50" />
          </div>
          <motion.h2 
            key={balance}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-extrabold tracking-tight"
          >
            {balance.toFixed(2)} <span className="text-lg font-normal text-white/80">ETB</span>
          </motion.h2>
          <div className="mt-8 flex gap-3">
            <TopUpDialog />
            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white border-0 font-medium h-11 rounded-lg backdrop-blur-sm transition-colors">
              Transfer
            </button>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Recent Transactions</h3>
          <span className="text-xs text-[#49a5d7] font-bold cursor-pointer hover:underline">View All</span>
        </div>
        <div className="space-y-3">
          {transactions.map((tx, i) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-sm transition-all hover:bg-gray-50 cursor-pointer overflow-hidden relative">
                <CardContent className="p-4 flex justify-between items-center bg-white relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.amount > 0 ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"}`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{tx.type}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)} ETB
                    </p>
                    <p className="text-[9px] font-bold text-gray-400/80 uppercase">{tx.status}</p>
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
