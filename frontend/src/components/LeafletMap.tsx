"use client";

import { useEffect, useRef, useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { 
  Bus, MapPin, Navigation, Signal, Users, 
  Settings2, Activity, ShieldCheck, Gauge,
  ArrowRightLeft
} from "lucide-react";

// Real Addis Ababa bus stops (GPS coordinates)
const ADDIS_STOPS = [
  { name: "Megenagna", lat: 9.0298, lng: 38.7612 },
  { name: "Piassa", lat: 9.0359, lng: 38.7473 },
  { name: "Bole", lat: 8.9956, lng: 38.7892 },
  { name: "Mexico Square", lat: 9.0098, lng: 38.7583 },
  { name: "Merkato", lat: 9.0367, lng: 38.7320 },
  { name: "Tor Hailoch", lat: 8.9965, lng: 38.7519 },
  { name: "Ayat", lat: 9.0471, lng: 38.8212 },
  { name: "Saris", lat: 8.9780, lng: 38.7650 },
  { name: "Sarbet", lat: 9.0052, lng: 38.7380 },
  { name: "Kality", lat: 8.9459, lng: 38.7432 },
  { name: "Stadium", lat: 9.0225, lng: 38.7524 },
  { name: "4 Kilo", lat: 9.0375, lng: 38.7628 },
  { name: "Arat Kilo", lat: 9.0401, lng: 38.7570 },
];

const ROUTES_POLYLINES = [
  { name: "Megenagna → Piassa", color: "#CC1F1F", points: [[9.0298, 38.7612], [9.0359, 38.7473]] as [number, number][] },
  { name: "Bole → Mexico", color: "#FFD600", points: [[8.9956, 38.7892], [9.0098, 38.7583]] as [number, number][] },
  { name: "Ayat → Tor Hailoch", color: "#3B82F6", points: [[9.0471, 38.8212], [8.9965, 38.7519]] as [number, number][] },
  { name: "Sarbet → Merkato", color: "#10B981", points: [[9.0052, 38.7380], [9.0367, 38.7320]] as [number, number][] },
];

interface LeafletMapProps {
  height?: string;
  compact?: boolean;
  buses?: any[];
}

export function LeafletMap({ height = "600px", compact = false, buses: propBuses }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const busLayerRef = useRef<any>(null);
  const { adminTheme, buses: contextBuses } = useTenant();
  const isDark = adminTheme === "zinc";
  
  const displayBuses = propBuses || contextBuses || [];

  useEffect(() => {
    let map: any;

    const init = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;
      
      // Fix marker asset paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      map = L.map(mapRef.current, {
        center: [9.0192, 38.7525],
        zoom: compact ? 12 : 13,
        zoomControl: false, // Custom controls instead
        scrollWheelZoom: true,
      });

      // Layer 1: Tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Layer 2: Routes
      ROUTES_POLYLINES.forEach((route) => {
        L.polyline(route.points, {
          color: route.color,
          weight: 4,
          opacity: 0.8,
          dashArray: "8, 6",
        }).addTo(map);

        // Terminals
        const termIcon = (label: string) => L.divIcon({
          className: "",
          html: `<div style="background:${route.color}; color:white; font-size:9px; font-weight:900; padding:2px 8px; border-radius:12px; border:2px solid white; box-shadow:0 10px 20px rgba(0,0,0,0.15); display:flex; align-items:center; gap:6px;">
            <img src="/bus-icon.png" style="width:14px; height:auto; filter:drop-shadow(0 0 1px white);" />
            ${label}
          </div>`,
          iconSize: [80, 24],
          iconAnchor: [40, 12]
        });

        L.marker(route.points[0], { icon: termIcon(route.name.split(" ")[0]) }).addTo(map);
        L.marker(route.points[route.points.length - 1], { icon: termIcon(route.name.split(" ").at(-1) || "") }).addTo(map);
      });

      // Layer 3: Stops
      ADDIS_STOPS.forEach((stop) => {
        L.circleMarker([stop.lat, stop.lng], {
          radius: 4,
          fillColor: "white",
          color: "#CC1F1F",
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map).bindTooltip(stop.name, { direction: "top" });
      });

      // Layer 4: Live Fleet
      busLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      
      // Initial render of markers
      syncMarkers();
    };

    const syncMarkers = async () => {
      if (!mapInstanceRef.current || !busLayerRef.current) return;
      const L = (await import("leaflet")).default;
      busLayerRef.current.clearLayers();

      displayBuses.forEach((bus) => {
        const matchingRoute = ROUTES_POLYLINES.find(r => r.name.includes(bus.routeId || "NULL"));
        const routeColor = matchingRoute ? matchingRoute.color : "#64748b";
        
        const busIcon = L.divIcon({
          className: "",
          html: `<div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 4px; background: white; border: 2.5px solid ${routeColor}; border-radius: 50%; box-shadow: 0 0 15px ${routeColor}44, 0 4px 8px rgba(0,0,0,0.1);"></div>
            <img src="/bus-icon.png" style="width: 32px; height: auto; position: relative; z-index: 10; transform: rotate(${bus.angle || 0}deg); filter: drop-shadow(0 0 2px white);" />
          </div>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        L.marker([bus.gpsLat, bus.gpsLng], { icon: busIcon, zIndexOffset: 1000 })
          .addTo(busLayerRef.current);
      });
    };

    init();

    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers reactively
  useEffect(() => {
    const update = async () => {
      if (!mapInstanceRef.current || !busLayerRef.current) return;
      const L = (await import("leaflet")).default;
      busLayerRef.current.clearLayers();
      
      displayBuses.forEach((bus) => {
        const matchingRoute = ROUTES_POLYLINES.find(r => r.name.includes(bus.routeId || "NULL"));
        const routeColor = matchingRoute ? matchingRoute.color : "#64748b";
        
        const busIcon = L.divIcon({
          className: "",
          html: `<div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 4px; background: white; border: 2.5px solid ${routeColor}; border-radius: 50%; box-shadow: 0 0 15px ${routeColor}44, 0 4px 8px rgba(0,0,0,0.1);"></div>
            <img src="/bus-icon.png" style="width: 32px; height: auto; position: relative; z-index: 10; transform: rotate(${bus.angle || 0}deg); filter: drop-shadow(0 0 2px white);" />
          </div>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        L.marker([bus.gpsLat, bus.gpsLng], { icon: busIcon, zIndexOffset: 1000 })
          .addTo(busLayerRef.current);
      });
    };
    update();
  }, [displayBuses]);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] rounded-[3rem] overflow-hidden border border-white/50 shadow-2xl bg-white">
      {/* MAP ENGINE */}
      <div 
        ref={mapRef} 
        className="absolute inset-0 z-0 bg-slate-50"
      />

      <style jsx global>{`
        .leaflet-container {
          background: #f8fafc !important;
          width: 100%;
          height: 100%;
        }
        .leaflet-tile {
          filter: saturate(1.2) contrast(1.1);
        }
        .leaflet-bar { border: none !important; }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          color: #64748b !important;
          margin: 4px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
        }
      `}</style>
      
      {/* UI OVERLAY: TOP LEFT HUD */}
      <div className="absolute top-8 left-8 z-[1000] space-y-3 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/50 p-5 rounded-[2rem] shadow-2xl flex items-center gap-6 animate-in slide-in-from-left duration-700">
          <div className="relative">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
              <Signal className="w-6 h-6 text-[#CC1F1F]" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Network</span>
              <span className="bg-emerald-100 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
            </div>
            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
              Anbessa <span className="text-[#CC1F1F]">Fleet Radar</span>
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-100/50 px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-4 animate-in slide-in-from-left delay-300 duration-700">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Tracking {displayBuses.length} Active Units
          </span>
        </div>
      </div>

      {/* UI OVERLAY: TOP RIGHT METRICS */}
      <div className="absolute top-8 right-8 z-[1000] animate-in slide-in-from-right duration-700 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/50 p-6 rounded-[2.5rem] shadow-2xl min-w-[240px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">System Active</span>
            </div>
            <Settings2 className="w-4 h-4 text-slate-300" />
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Fleet Count</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">112</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Efficiency</p>
              <p className="text-2xl font-black text-emerald-500 tracking-tighter">94.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* UI OVERLAY: BOTTOM LEFT STATUS */}
      <div className="absolute bottom-8 left-8 z-[1000] animate-in slide-in-from-bottom duration-700 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/50 p-6 rounded-[2.5rem] shadow-2xl min-w-[300px]">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-4 h-4 text-[#CC1F1F]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CC1F1F]">Anbessa Pro</span>
          </div>
          
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Live Status</p>
          <p className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-6">Normal Operations</p>
          
          <div className="flex items-center justify-between py-4 border-t border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">From</span>
              </div>
              <p className="text-xs font-black text-slate-800 uppercase">Megenagna</p>
            </div>
            <ArrowRightLeft className="w-4 h-4 text-slate-200" />
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">To</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              </div>
              <p className="text-xs font-black text-slate-800 uppercase">Piassa</p>
            </div>
          </div>
        </div>
      </div>

      {/* UI OVERLAY: BOTTOM RIGHT LEGEND */}
      <div className="absolute bottom-8 right-8 z-[1000] animate-in slide-in-from-bottom duration-700 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/50 p-6 rounded-[2.5rem] shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Route Legend</p>
          <div className="space-y-3">
            {ROUTES_POLYLINES.map((r) => (
              <div key={r.name} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-1 rounded-full" style={{ background: r.color }} />
                   <img src="/bus-icon.png" style={{ width: "16px", height: "auto" }} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-700">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
