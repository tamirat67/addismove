"use client";

import { useState } from "react";
import { anbessaRoutes, BusRoute } from "@/lib/routes";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Bus, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoutesDirectory() {
  const [search, setSearch] = useState("");

  const filteredRoutes = anbessaRoutes.filter((route) =>
    route.start.toLowerCase().includes(search.toLowerCase()) ||
    route.destination.toLowerCase().includes(search.toLowerCase()) ||
    route.passBy.toLowerCase().includes(search.toLowerCase()) ||
    route.id.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-4 lg:pt-8 pb-12 lg:pb-16 flex-1">
      <div className="w-full space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 uppercase">
          Routes <span style={{ color: "#CC1F1F" }}>Directory</span>
        </h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Bus className="w-4 h-4" style={{ color: "#CC1F1F" }} />
          115+ Active Bus Routes across Addis Ababa
        </p>
      </div>

      {/* Stats and Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: "#CC1F1F15", color: "#CC1F1F" }}>
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Routes</p>
              <p className="text-xl font-black">115</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: "#FFD60015", color: "#CC1F1F" }}>
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Length</p>
              <p className="text-xl font-black">14.1 Km</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: "#CC1F1F0D", color: "#CC1F1F" }}>
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longest Route</p>
              <p className="text-xl font-black">52 Km</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table Section */}
      <Card className="border-0 shadow-2xl shadow-red-900/5 bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">
            Route Search
          </CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <Input
              placeholder="Search by Station or Bus #"
              className="pl-10 h-11 bg-slate-50 border-0 focus-visible:ring-2 focus-visible:ring-[#CC1F1F]/20 rounded-xl text-sm font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">Pass-by</th>
                  <th className="px-6 py-4">Destination</th>
                  <th className="px-6 py-4 text-right">Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredRoutes.map((route, i) => (
                    <motion.tr
                      key={route.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.002 }} // Staggering 121 items slowly
                      className="group hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-[10px] font-black text-white" style={{ backgroundColor: "#CC1F1F" }}>
                          {route.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-black">{route.start}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-500 font-medium">{route.passBy === "-" ? "Direct" : route.passBy}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-black">{route.destination}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-black text-[#CC1F1F] bg-[#CC1F1F0D] px-2 py-1 rounded-md">
                          {route.distance === "N/A" ? "TBD" : route.distance}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {filteredRoutes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-sm font-bold text-slate-500">No routes found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* History/Info Section */}
      <div className="bg-[#CC1F1F] rounded-[3rem] p-8 lg:p-12 text-white relative overflow-hidden shadow-2xl">
        {/* Background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[10px] font-black uppercase tracking-widest">
              Established 1945
            </div>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase">
              The History of <br />
              <span style={{ color: "#FFD600" }}>Anbessa City Bus</span>
            </h2>
            <p className="text-white/80 text-sm leading-relaxed font-medium">
              Anbessa City Bus Service Enterprise is a state-owned public transport operator headquartered in Addis Ababa, Ethiopia. 
              The Anbessa City Bus started as a share company founded in 1945 and owned by Emperor Haile Selassie and members of the royal family, 
              before it was nationalised in 1974. It came to be a public enterprise only after it was re-established in 1994.
            </p>
            <div className="pt-4 flex gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-black" style={{ color: "#FFD600" }}>75+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Years of Service</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-black" style={{ color: "#FFD600" }}>State</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Owned Enterprise</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block relative h-64">
             {/* Abstract Bus Graphic or Placeholder */}
             <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center">
                <Bus className="w-24 h-24 text-white/10" strokeWidth={1} />
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="font-black text-sm uppercase tracking-widest">Service Operational</span>
             </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
