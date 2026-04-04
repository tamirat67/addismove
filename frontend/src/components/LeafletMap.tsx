"use client";

import { useEffect, useRef } from "react";
import { useTenant } from "@/context/TenantContext";

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

// FLEET_POSITIONS is now handled via props for real-time data integration

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
  const { adminTheme, buses: contextBuses } = useTenant();
  const isDark = adminTheme === "zinc";
  
  const displayBuses = propBuses || contextBuses || [];

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      // Guard against React StrictMode double-invoke and hot-reload re-runs
      if (!mapRef.current) return;
      if ((mapRef.current as any)._leaflet_id) return;

      const L = (await import("leaflet")).default;
      // await import("leaflet/dist/leaflet.css"); // MOVED TO LAYOUT CDN TO FIX VERCEL OOM/LIGHTNINGCSS ERROR

      // Second guard after async gap (in case of rapid unmount/remount)
      if (!mapRef.current || (mapRef.current as any)._leaflet_id) return;

      // Fix default marker icon paths (Next.js SSR issue)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [9.0192, 38.7525],
        zoom: compact ? 12 : 13,
        zoomControl: !compact,
        scrollWheelZoom: true,
        attributionControl: !compact,
      });

      // OpenStreetMap tiles — FREE, no API key needed
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Draw route polylines
      ROUTES_POLYLINES.forEach((route) => {
        const polyline = L.polyline(route.points, {
          color: route.color,
          weight: 4,
          opacity: 0.8,
          dashArray: "8, 4",
        }).addTo(map);
        polyline.bindTooltip(`<strong>${route.name}</strong>`, { sticky: true });

        // Add directional bus "ghost" icons along the route
        for (let j = 0; j < route.points.length - 1; j++) {
          const p1 = route.points[j];
          const p2 = route.points[j + 1];
          const midLat = (p1[0] + p2[0]) / 2;
          const midLng = (p1[1] + p2[1]) / 2;
          const angle = Math.atan2(p2[0] - p1[0], p2[1] - p1[1]) * (180 / Math.PI);
          
          const ghostIcon = L.divIcon({
            className: "",
            html: `<div style="
              width: 14px; height: 14px;
              opacity: 0.5;
              transform: rotate(${angle}deg);
            ">
              <svg viewBox="0 0 24 24" fill="${route.color}">
                <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
              </svg>
            </div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          L.marker([midLat, midLng], { icon: ghostIcon, interactive: false }).addTo(map);
        }
      });

      // Add terminal markers for routes
      ROUTES_POLYLINES.forEach((route) => {
        const startPoint = route.points[0];
        const endPoint = route.points[route.points.length - 1];
        
        const terminalIcon = (label: string) => L.divIcon({
          className: "",
          html: `<div style="
            background: ${route.color};
            color: white;
            font-size: 8px;
            font-weight: 900;
            padding: 3px 6px;
            border-radius: 6px;
            border: 1.5px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
          ">
            <svg viewBox="0 0 24 24" fill="white" width="10" height="10">
              <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
            </svg>
            ${label}
          </div>`,
          iconSize: [30, 16],
          iconAnchor: [15, 8],
        });

        L.marker(startPoint, { icon: terminalIcon(route.name.split(" ")[0]) }).addTo(map);
        L.marker(endPoint, { icon: terminalIcon(route.name.split(" ").at(-1) || "") }).addTo(map);
      });

      // Add bus stop markers
      ADDIS_STOPS.forEach((stop) => {
        const stopIcon = L.divIcon({
          className: "",
          html: `<div style="
            width: 8px; height: 8px;
            background: white;
            border: 2px solid #CC1F1F;
            border-radius: 50%;
            box-shadow: 0 0 0 2px rgba(204,31,31,0.1);
          "></div>`,
          iconSize: [8, 8],
          iconAnchor: [4, 4],
        });
        L.marker([stop.lat, stop.lng], { icon: stopIcon })
          .addTo(map)
          .bindTooltip(stop.name, { permanent: false, direction: "top", className: "leaflet-stop-tooltip" });
      });

      // Add live bus markers with animated icons
      displayBuses.forEach((bus) => {
        const matchingRoute = ROUTES_POLYLINES.find(r => r.name.includes(bus.routeId || "NULL"));
        const routeColor = matchingRoute ? matchingRoute.color : "#64748b";
        const loadColor = (bus.fuelLevel || 50) > 80 ? "#f43f5e" : (bus.fuelLevel || 50) > 50 ? "#FFD600" : "#10b981";
        const statusStr = bus.status?.toLowerCase() || "active";
        const busIcon = L.divIcon({
          className: "",
          html: `<div style="
            position: relative;
            width: 32px; height: 32px;
          ">
            ${statusStr === "active" ? `<div style="
              position: absolute; inset: -4px;
              border-radius: 8px;
              background: ${routeColor}33;
              animation: ping 2s infinite;
            "></div>` : ""}
            <div style="
              width: 32px; height: 32px;
              background: ${statusStr === "active" ? routeColor : "#94a3b8"};
              border: 2px solid white;
              border-radius: 8px;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
              </svg>
            </div>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([bus.gpsLat, bus.gpsLng], { icon: busIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: system-ui; min-width: 180px; padding: 4px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                <div style="background:#CC1F1F; color:white; font-weight:900; font-size:10px; padding:2px 8px; border-radius:20px; text-transform:uppercase; letter-spacing:0.1em;">${statusStr}</div>
              </div>
              <p style="font-weight:900; font-size:14px; margin:0 0 4px; text-transform:uppercase;">${bus.plate}</p>
              <p style="font-size:11px; color:#64748b; margin:0 0 2px; font-weight:600;">${bus.driverName}</p>
              <p style="font-size:10px; color:#94a3b8; margin:0 0 8px;">Line ${bus.routeId || "Unassigned"}</p>
              <div style="display:flex; align-items:center; gap:6px;">
                <div style="flex:1; height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden;">
                  <div style="width:${bus.fuelLevel || 50}%; height:100%; background:${loadColor}; border-radius:3px;"></div>
                </div>
                <span style="font-size:10px; font-weight:900; color:${loadColor};">${bus.fuelLevel || 50}%</span>
              </div>
              <p style="font-size:9px; color:#cbd5e1; margin:4px 0 0; text-transform:uppercase; letter-spacing:0.1em;">Service Status (Fuel)</p>
            </div>
          `, {
            maxWidth: 220,
            className: "leaflet-bus-popup",
          });
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem]" style={{ height }}>
      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-bus-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          border: 1px solid #f1f5f9;
          padding: 0;
        }
        .leaflet-bus-popup .leaflet-popup-content {
          margin: 12px 16px;
        }
        .leaflet-stop-tooltip {
          background: rgba(15,23,42,0.9) !important;
          color: white !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
        }
        .leaflet-stop-tooltip::before {
          border-top-color: rgba(15,23,42,0.9) !important;
        }
      `}</style>

      <div ref={mapRef} className="w-full h-full z-10" />

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-[400] space-y-2 pointer-events-none">
        <div className="px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Network</p>
            <p className="text-xs font-black text-slate-900 tracking-tight">Anbessa <span className="text-[#CC1F1F]">Fleet Radar</span></p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-white/60 shadow-lg flex items-center gap-2">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tracking {displayBuses.filter((b: any) => b.status === "Active" || b.status === "active").length} Active Units</span>
        </div>
      </div>

      {/* Legend */}
      {!compact && (
        <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-xl p-4 space-y-2">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Route Legend</p>
          {ROUTES_POLYLINES.map(r => (
            <div key={r.name} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-1 rounded-full block" style={{ backgroundColor: r.color }} />
                <svg viewBox="0 0 24 24" fill={r.color} width="10" height="10">
                  <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
                </svg>
              </div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{r.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Floating Service Status Card */}
      <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none">
        <div className="bg-[#f5f5f5cc] backdrop-blur-md border border-white/40 shadow-2xl rounded-[1.5rem] p-5 w-64">
           <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#CC1F1F]">Anbessa Pro</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           </div>
           
           <div className="space-y-3">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Live Status</p>
                <p className="text-xs font-black text-slate-800 uppercase">Normal Operations</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg viewBox="0 0 24 24" fill="#CC1F1F" width="10" height="10">
                      <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
                    </svg>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">From</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 truncate">Megenagna</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg viewBox="0 0 24 24" fill="#64748b" width="10" height="10">
                      <path d="M18 11V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h1a2 2 0 002-2v-1h10v1a2 2 0 002 2h1a2 2 0 002-2v-7a2 2 0 00-2-2zM4 7h12v4H4V7zm1 10a1 1 0 11-2 0 1 1 0 012 0zm14 0a1 1 0 11-2 0 1 1 0 012 0zm0-4h-2V9h2v4z"/>
                    </svg>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">To</p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-700 truncate">Piassa</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
