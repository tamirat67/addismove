import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MapPin, ArrowRight, Bus, Train, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="max-w-md mx-auto w-full px-4 pt-4 pb-20 space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      {/* Header / Intro */}
      <div className="pt-4 px-1">
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 leading-tight">
          Where would you <br /> 
          <span className="text-[#060267]">like to go?</span>
        </h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 ml-0.5">
          Fast & Safe transit across Addis
        </p>
      </div>

      {/* Search Section */}
      <Card className="border-0 shadow-2xl shadow-blue-900/10 bg-white overflow-hidden rounded-[2.5rem] relative">
        <CardContent className="p-8 space-y-6">
          <div className="relative space-y-0.5">
            {/* Vertical Line Decor */}
            <div className="absolute left-[1.35rem] top-10 bottom-10 w-0.5 bg-slate-100 rounded-full z-0"></div>
            
            <div className="relative z-10 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-slate-300 bg-white group-focus-within:border-[#92c01f] transition-colors"></div>
              <Input 
                placeholder="From: e.g. Megenagna" 
                className="pl-12 h-14 bg-slate-50/50 border-0 focus-visible:ring-2 focus-visible:ring-[#92c01f]/20 rounded-2xl text-sm font-bold placeholder:text-slate-400 transition-all focus-visible:bg-white" 
              />
            </div>

            <div className="relative z-10 group pt-2">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 rounded-sm group-focus-within:bg-[#060267] transition-colors"></div>
              <Input 
                placeholder="To: e.g. Piassa" 
                className="pl-12 h-14 bg-slate-50/50 border-0 focus-visible:ring-2 focus-visible:ring-[#060267]/20 rounded-2xl text-sm font-bold placeholder:text-slate-400 transition-all focus-visible:bg-white" 
              />
            </div>
          </div>

          <Link href="/results" className="block pt-2">
            <Button className="w-full bg-[#060267] hover:bg-black text-white shadow-xl shadow-blue-900/20 text-sm font-black uppercase tracking-widest h-14 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              Find Best Route <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Transport Options */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 uppercase px-2 tracking-[0.2em]">Quick Select</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Anbessa", icon: Bus, color: "#D32F2F", bg: "#FEF2F2" },
            { label: "LRT Rail", icon: Train, color: "#00796B", bg: "#F0FDF4" },
            { label: "Smart Mix", icon: Shuffle, color: "#1E1B4B", bg: "#EEF2FF" }
          ].map((item, i) => (
            <motion.button
              key={item.label}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm transition-all hover:shadow-md hover:border-slate-200"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
