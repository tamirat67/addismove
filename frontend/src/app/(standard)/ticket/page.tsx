"use client";

import { useTenant } from "@/context/TenantContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, ArrowLeft, RefreshCw, Bus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Ticket() {
  const { tickets } = useTenant();
  const latestTicket = tickets[0];

  if (!latestTicket) {
    return (
      <div className="py-20 text-center space-y-4">
        <QrCode className="w-16 h-16 text-gray-200 mx-auto" strokeWidth={1} />
        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No Active Tickets</p>
        <Link href="/">
          <Button variant="link" style={{ color: "#CC1F1F" }}>Search Routes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 pt-4 space-y-6 animate-in zoom-in-95 duration-500 fade-in pb-10">
      <div className="flex items-center justify-between mb-4">
        <Link href="/results" className="text-gray-500 hover:text-black">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
          {latestTicket.status}
        </span>
        <div className="w-5" />
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Card className="text-center overflow-hidden border-0 shadow-2xl bg-white max-w-sm mx-auto relative group">
          {/* Anbessa Bus livery stripe */}
          <div className="absolute top-0 w-full h-1.5" style={{ backgroundColor: "#FFD600" }} />
          <div className="absolute top-1.5 w-full h-10" style={{ backgroundColor: "#CC1F1F" }} />
          <div className="absolute top-11.5 w-full h-1" style={{ backgroundColor: "#FFD600" }} />

          <CardContent className="pt-16 pb-6 px-6 relative">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white font-black text-[10px] uppercase tracking-tighter mb-2"
              style={{ backgroundColor: "#CC1F1F" }}
            >
              <Bus className="w-3 h-3" /> {latestTicket.type} Pass
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase" style={{ color: "#CC1F1F" }}>
              {latestTicket.route}
            </h2>

            <div className="my-8 flex justify-center relative">
              <div className="absolute inset-0 rounded-xl blur-xl transition-all" style={{ backgroundColor: "#FFD60020" }}></div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 relative z-10 w-48 h-48 flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-800" strokeWidth={1} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-3 mt-4 text-left border-t border-dashed border-gray-200 pt-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Valid until</span>
                <span className="font-black" style={{ color: "#CC1F1F" }}>{latestTicket.expiry}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Ticket ID</span>
                <span className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[11px] font-bold tracking-tight">
                  {latestTicket.id}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Price Paid</span>
                <span className="font-black text-gray-900">{latestTicket.price.toFixed(2)} ETB</span>
              </div>
            </div>
          </CardContent>

          <div className="absolute left-[-12px] bottom-1/3 w-6 h-6 bg-slate-50 rounded-full border-r border-gray-100"></div>
          <div className="absolute right-[-12px] bottom-1/3 w-6 h-6 bg-slate-50 rounded-full border-l border-gray-100"></div>
        </Card>
      </motion.div>

      <div className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 mt-4 bg-white py-4 rounded-xl shadow-sm border border-gray-50">
        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Security Refresh in 10s
      </div>
    </div>
  );
}
