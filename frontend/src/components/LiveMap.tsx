"use client";

import { useTenant } from "@/context/TenantContext";
import { Card } from "@/components/ui/card";
import { Bus, MapPin, Navigation, Radio, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ROUTES = [
    { id: "1", d: "M 10 50 Q 25 20 50 50 T 90 40", color: "#CC1F1F" },
    { id: "4", d: "M 20 10 Q 40 60 80 90", color: "#FFD600" },
    { id: "15", d: "M 10 10 L 30 40 L 70 20 L 90 80", color: "#CC1F1F" },
    { id: "22", d: "M 80 10 Q 60 40 20 80", color: "#FFD600" },
    { id: "31", d: "M 50 10 L 50 90", color: "#F43F5E" },
];

const INITIAL_FLEET = [
    { id: "ANB-F1", routeIdx: 0, speed: 0.000002, offset: 0.1, plate: "AB-2-0991", driver: "Abebe K.", load: 68 },
    { id: "ANB-F2", routeIdx: 0, speed: 0.0000016, offset: 0.6, plate: "AB-2-1204", driver: "Solomon T.", load: 42 },
    { id: "ANB-F3", routeIdx: 1, speed: 0.0000024, offset: 0.2, plate: "AB-3-A772", driver: "Kassa G.", load: 85 },
    { id: "ANB-F4", routeIdx: 2, speed: 0.0000018, offset: 0.0, plate: "AB-4-B110", driver: "Abnet S.", load: 12 },
    { id: "ANB-F5", routeIdx: 3, speed: 0.0000022, offset: 0.4, plate: "AB-1-X001", driver: "Mulu L.", load: 94 },
    { id: "ANB-F6", routeIdx: 4, speed: 0.000003, offset: 0.1, plate: "AB-3-Y224", driver: "Dawit M.", load: 30 },
    { id: "ANB-F7", routeIdx: 1, speed: 0.000002, offset: 0.7, plate: "AB-2-9981", driver: "Kebede H.", load: 55 },
    { id: "ANB-F8", routeIdx: 2, speed: 0.0000016, offset: 0.5, plate: "AB-4-A220", driver: "Hagos F.", load: 72 },
];

export function LiveMap() {
  const { tenant, theme, adminTheme } = useTenant();
  const isDark = adminTheme === "zinc";
  
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [fleetPositions, setFleetPositions] = useState<{ id: string, x: number, y: number, angle: number, info: any }[]>([]);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const elapsed = time - startTimeRef.current;
    
    // Animate Live Fleet (Existing)
    const newPositions = INITIAL_FLEET.map((bus) => {
        const path = pathRefs.current[bus.routeIdx];
        if (!path) return null;
        const totalLength = path.getTotalLength();
        const progress = (bus.offset + elapsed * bus.speed) % 1;
        const currentLength = progress * totalLength;
        const point = path.getPointAtLength(currentLength);
        const nextPoint = path.getPointAtLength((currentLength + 1) % totalLength);
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
        return { id: bus.id, x: point.x, y: point.y, angle, info: bus };
    }).filter(Boolean) as any[];

    // Animate Route Flow (DECORATION)
    const newFlowPositions: any[] = [];
    ROUTES.forEach((route, i) => {
        const path = pathRefs.current[i];
        if (!path) return;
        const totalLength = path.getTotalLength();
        
        // Add 3 ghost icons per route
        [0.1, 0.4, 0.7].forEach((baseOffset, j) => {
            const progress = (baseOffset + elapsed * 0.0000008) % 1;
            const currentLength = progress * totalLength;
            const point = path.getPointAtLength(currentLength);
            const nextPoint = path.getPointAtLength((currentLength + 0.5) % totalLength);
            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
            newFlowPositions.push({ id: `flow-${i}-${j}`, x: point.x, y: point.y, angle, color: route.color });
        });
    });

    setFleetPositions(newPositions);
    setRouteFlowPositions(newFlowPositions);
    requestRef.current = requestAnimationFrame(animate);
  };

  const [routeFlowPositions, setRouteFlowPositions] = useState<any[]>([]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <Card className={`border shadow-2xl rounded-[3rem] overflow-hidden transition-colors min-h-[500px] lg:h-[600px] relative w-full group ${
        isDark ? "bg-zinc-950 border-zinc-800" : "bg-slate-50 border-white"
    }`}>
      {/* MAP GRID & ROUTES */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
            className={`w-full h-full absolute inset-0 opacity-10 transition-opacity ${isDark ? "opacity-20" : "opacity-10"}`}
            style={{ backgroundImage: `linear-gradient(${isDark ? "#3f3f46" : "#cbd5e1"} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? "#3f3f46" : "#cbd5e1"} 1px, transparent 1px)`, backgroundSize: "40px 40px" }}
        ></div>
        
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {ROUTES.map((route, i) => (
                <g key={route.id}>
                    {/* Path Glow */}
                    <path 
                        d={route.d} 
                        fill="none" 
                        stroke={route.id === "1" ? "#CC1F1F" : (isDark ? "#3f3f46" : "#cbd5e1")} 
                        strokeWidth="1.5" 
                        strokeOpacity="0.4"
                        filter="url(#glow)"
                        strokeLinecap="round" 
                    />
                    {/* Main Path */}
                    <path 
                        ref={el => { pathRefs.current[i] = el; }}
                        d={route.d} 
                        fill="none" 
                        stroke={route.id === "1" ? "#CC1F1F" : (isDark ? "#27272a" : "#e2e8f0")} 
                        strokeWidth="0.8" 
                        strokeLinecap="round" 
                        strokeDasharray={i % 2 === 0 ? "none" : "2 2"}
                    />
                    {/* Stop Markers (Ends of paths) */}
                    <circle cx={route.d.split(' ')[1] || "0"} cy={route.d.split(' ')[2] || "0"} r="0.8" fill={isDark ? "#52525b" : "#94a3b8"} />
                    <circle cx={route.d.split(' ').at(-2) || "0"} cy={route.d.split(' ').at(-1) || "0"} r="0.8" fill={isDark ? "#52525b" : "#94a3b8"} />
                </g>
            ))}
        </svg>
      </div>
      
      {/* BUS MARKERS */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        {/* Route Flow Decoration */}
        {routeFlowPositions.map((flow) => (
          <div
            key={flow.id}
            style={{ 
              left: `${flow.x}%`, 
              top: `${flow.y}%`,
              transform: `rotate(${flow.angle}deg) translate(-50%, -50%)`,
              opacity: 0.2
            } as any}
            className="absolute z-10"
          >
            <svg viewBox="0 0 24 24" fill={flow.color} width="12" height="12">
              <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
            </svg>
          </div>
        ))}

        <AnimatePresence>
          {fleetPositions.map((bus) => (
            <motion.div
              key={bus.id}
              style={{ 
                left: `${bus.x}%`, 
                top: `${bus.y}%`,
                transform: `rotate(${bus.angle}deg) translate(-50%, -50%)`
              } as any}
              className="absolute z-20 pointer-events-auto cursor-crosshair group/bus"
            >
                {/* Radar Pulse for Lead Vehicle (ID: 1) */}
                {bus.info.routeIdx === 0 && (
                    <motion.div 
                        animate={{ scale: [1, 4], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 w-8 h-8 -ml-3 -mt-3 rounded-full bg-[#CC1F1F]/20 blur-sm pointer-events-none"
                    />
                )}

                <div className="relative">
                    {/* Floating HUD Label */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/bus:opacity-100 transition-all duration-300 scale-90 group-hover/bus:scale-100">
                        <div className={`px-4 py-2 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col gap-1 min-w-[120px] ${
                            isDark ? "bg-zinc-900/90 border-zinc-700" : "bg-white/95 border-slate-200"
                        }`}>
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-black uppercase text-[#CC1F1F] tracking-widest">{bus.info.plate}</span>
                                <div className="flex items-center gap-1">
                                    <Users className="w-2.5 h-2.5 text-slate-400" />
                                    <span className="text-[8px] font-black text-slate-500 uppercase">{bus.info.load}%</span>
                                </div>
                            </div>
                            <p className={`text-[10px] font-black uppercase truncate ${isDark ? "text-white" : "text-slate-800"}`}>{bus.info.driver}</p>
                            <div className="flex items-center gap-1.5 mt-1 border-t border-slate-100 dark:border-zinc-800 pt-1.5">
                                <Navigation className="w-2.5 h-2.5 text-emerald-500" />
                                <span className="text-[7px] font-black text-emerald-600 uppercase tracking-tighter">Line {ROUTES[bus.info.routeIdx].id} Active</span>
                            </div>
                        </div>
                        <div className={`w-2 h-2 rotate-45 mx-auto -mt-1 border-r border-b ${
                            isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-slate-200"
                        }`}></div>
                    </div>

                    {/* Bus Icon */}
                    <div 
                        className={`w-7 h-7 rounded-lg flex items-center justify-center relative border shadow-lg transition-all duration-300 group-hover/bus:scale-125 ${
                            bus.info.routeIdx === 0 ? "bg-[#CC1F1F] border-red-400" : (isDark ? "bg-zinc-800 border-zinc-700" : "bg-white border-slate-200")
                        }`}
                        style={{ transform: `rotate(${bus.angle}deg)` } as any}
                    >
                        <svg viewBox="0 0 24 24" fill={bus.info.routeIdx === 0 ? "white" : (isDark ? "#a1a1aa" : "#64748b")} width="18" height="18">
                          <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
                        </svg>
                        
                        {/* Status Glow */}
                        <div className={`absolute -inset-1 blur-md opacity-20 rounded-full transition-opacity group-hover/bus:opacity-60`}
                             style={{ backgroundColor: bus.info.routeIdx === 0 ? "#CC1F1F" : "#10b981" }}
                        ></div>
                    </div>
                </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* OVERLAYS & HUD */}
      <div className="absolute top-8 left-8 z-30 space-y-3 pointer-events-none">
          <div className={`px-5 py-3 rounded-2xl border shadow-xl backdrop-blur-md flex items-center gap-4 transition-colors ${
              isDark ? "bg-zinc-900/80 border-zinc-700 text-white" : "bg-white/80 border-slate-200 text-slate-800"
          }`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Network</p>
                  <p className="text-xs font-black uppercase tracking-tighter">Anbessa <span className="text-[#CC1F1F]">Fleet Radar</span> Active</p>
              </div>
          </div>
          <div className={`px-4 py-2 rounded-xl border shadow-lg backdrop-blur-sm flex items-center gap-3 transition-colors ${
              isDark ? "bg-zinc-900/60 border-zinc-800 text-zinc-400" : "bg-white/60 border-slate-100 text-slate-500"
          }`}>
              <Radio className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Tracking {fleetPositions.length} Units</span>
          </div>
      </div>

      <div className="absolute bottom-8 right-8 z-30 pointer-events-auto">
          <button className={`p-4 rounded-3xl border shadow-2xl transition-all active:scale-90 flex items-center gap-3 group ${
              isDark ? "bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800" : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
          }`}>
              <MapPin className="w-5 h-5 text-[#CC1F1F] group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Recenter Map</span>
          </button>
      </div>

      {/* Route Legend Overlay */}
      <div className="absolute bottom-8 left-8 z-30 pointer-events-none">
          <div className={`p-5 rounded-[2rem] border shadow-2xl backdrop-blur-xl space-y-3 transition-colors ${
              isDark ? "bg-zinc-900/90 border-zinc-700 text-white" : "bg-white/95 border-slate-200 text-slate-800"
          }`}>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Active Network Lines</p>
              <div className="flex flex-col gap-2.5">
                  {ROUTES.map((route) => (
                      <div key={route.id} className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                              <div className="w-5 h-1 rounded-full" style={{ backgroundColor: route.color }} />
                              <svg viewBox="0 0 24 24" fill={route.color} width="11" height="11">
                                  <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
                              </svg>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tighter opacity-80">Line {route.id}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* SCANNING LINES */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
          <motion.div 
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-[1px] bg-sky-400"
          />
      </div>
    </Card>
  );
}
