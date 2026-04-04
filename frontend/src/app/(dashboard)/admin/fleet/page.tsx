"use client";

import { useState } from "react";
import { useTenant, BusData } from "@/context/TenantContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bus, Plus, Search, Filter, Edit3, Trash2, CheckCircle2,
  AlertTriangle, WrenchIcon, XCircle, Fuel, Gauge, MapPin,
  X, ChevronRight
} from "lucide-react";

const STATUS_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
  Active: { dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", label: "Active" },
  Maintenance: { dot: "bg-amber-400", badge: "bg-amber-400/10 text-amber-600 border-amber-400/20", label: "Maintenance" },
  Idle: { dot: "bg-blue-400", badge: "bg-blue-400/10 text-blue-600 border-blue-400/20", label: "Idle" },
  "Out of Service": { dot: "bg-rose-500", badge: "bg-rose-500/10 text-rose-600 border-rose-500/20", label: "Out of Service" },
};

const EMPTY_BUS: Omit<BusData, "id"> = {
  plate: "", model: "", capacity: 45, year: 2022, status: "Active",
  routeId: "R-01", driverName: "", driverId: "",
  fuelLevel: 80, mileage: 0, lastService: new Date().toISOString().split("T")[0],
  gpsLat: 9.019, gpsLng: 38.752,
};

export default function FleetPage() {
  const { buses, updateBus, addBus, removeBus, adminTheme, theme } = useTenant();
  const isDark = adminTheme === "zinc";

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [editBus, setEditBus] = useState<BusData | null>(null);
  const [adding, setAdding] = useState(false);
  const [newBus, setNewBus] = useState<Omit<BusData, "id">>(EMPTY_BUS);

  const filtered = buses.filter(b => {
    const matchSearch = b.plate.toLowerCase().includes(search.toLowerCase()) ||
      b.driverName.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    All: buses.length,
    Active: buses.filter(b => b.status === "Active").length,
    Maintenance: buses.filter(b => b.status === "Maintenance").length,
    Idle: buses.filter(b => b.status === "Idle").length,
    "Out of Service": buses.filter(b => b.status === "Out of Service").length,
  };

  const handleSaveEdit = () => {
    if (editBus) { updateBus(editBus.id, editBus); setEditBus(null); }
  };

  const handleAddBus = () => {
    if (!newBus.plate || !newBus.model) return;
    addBus(newBus);
    setNewBus(EMPTY_BUS);
    setAdding(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={`text-3xl font-black tracking-tight uppercase flex items-center gap-3 ${isDark ? "text-white" : "text-slate-800"}`}>
              Bus <span style={{ color: theme.primary }}>Fleet</span>
              <span className={`text-[10px] px-2.5 py-1 rounded-lg tracking-[0.2em] border font-black ${isDark ? "bg-zinc-800 text-zinc-400 border-zinc-700" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {buses.length} UNITS
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              Fleet Registry · Manage Anbessa Bus Assets
            </p>
          </motion.div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAdding(true)}
              className="px-5 py-2.5 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
              style={{ backgroundColor: theme.primary }}
            >
              <Plus className="w-4 h-4" /> Register Bus
            </button>
          </div>
        </header>

        {/* Status Filter Tabs */}
        <div className={`flex flex-wrap gap-2 p-2 rounded-2xl border ${isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-100"}`}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterStatus === status
                  ? "text-white shadow-md"
                  : isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-700"
              }`}
              style={{ backgroundColor: filterStatus === status ? theme.primary : "transparent" }}
            >
              {status !== "All" && <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[status]?.dot}`} />}
              {status} <span className="opacity-60">({count})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by plate, driver, model..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`h-12 pl-12 rounded-2xl border-0 shadow-md font-bold ${isDark ? "bg-zinc-900 text-white placeholder:text-zinc-600" : "bg-white placeholder:text-slate-400"}`}
          />
        </div>

        {/* Fleet Table */}
        <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-[9px] font-black uppercase tracking-[0.2em] border-b ${isDark ? "border-zinc-800 text-zinc-500" : "border-slate-50 text-slate-400"}`}>
                    <th className="px-6 py-5">Bus Unit</th>
                    <th className="px-6 py-5">Model / Year</th>
                    <th className="px-6 py-5">Driver</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5">Fuel</th>
                    <th className="px-6 py-5">Mileage</th>
                    <th className="px-6 py-5">Last Service</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-zinc-800" : "divide-slate-50"}`}>
                  <AnimatePresence>
                    {filtered.map((bus, idx) => (
                      <motion.tr
                        key={bus.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`group transition-all ${isDark ? "hover:bg-zinc-800/50" : "hover:bg-slate-50/80"}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-slate-50 border-slate-100"}`}>
                              <Bus className="w-5 h-5" style={{ color: theme.primary }} />
                            </div>
                            <div>
                              <p className={`text-xs font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{bus.plate}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Capacity: {bus.capacity}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-[10px] font-black uppercase ${isDark ? "text-zinc-300" : "text-slate-700"}`}>{bus.model}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{bus.year}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className={`text-[10px] font-black uppercase ${isDark ? "text-zinc-300" : "text-slate-700"}`}>{bus.driverName || "—"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${STATUS_STYLES[bus.status]?.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[bus.status]?.dot}`} />
                            {bus.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Fuel className="w-3.5 h-3.5 text-slate-400" />
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${bus.fuelLevel}%`,
                                  backgroundColor: bus.fuelLevel < 25 ? "#f43f5e" : bus.fuelLevel < 50 ? "#FFD600" : "#10b981"
                                }}
                              />
                            </div>
                            <span className="text-[9px] font-black text-slate-500">{bus.fuelLevel}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5 text-slate-400" />
                            <span className={`text-[10px] font-black ${isDark ? "text-zinc-400" : "text-slate-600"}`}>{bus.mileage.toLocaleString()} km</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{bus.lastService}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditBus({ ...bus })}
                              className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-zinc-700 text-zinc-400" : "hover:bg-slate-100 text-slate-500"}`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeBus(bus.id)}
                              className="p-2 rounded-lg hover:bg-rose-50 text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className={`p-4 rounded-full ${isDark ? "bg-zinc-800" : "bg-slate-50"}`}>
                            <Bus className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">No Buses Found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editBus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setEditBus(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-[2.5rem] border-0 shadow-2xl overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}
            >
              <div className="p-8 border-b" style={{ backgroundColor: theme.primary }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Edit Fleet Unit</p>
                    <h3 className="text-white text-xl font-black uppercase tracking-tight">{editBus.plate}</h3>
                  </div>
                  <button onClick={() => setEditBus(null)} className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-4">
                {[
                  { label: "Plate Number", key: "plate" as keyof BusData },
                  { label: "Model", key: "model" as keyof BusData },
                  { label: "Driver Name", key: "driverName" as keyof BusData },
                ].map(field => (
                  <div key={field.key} className="space-y-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{field.label}</label>
                    <Input
                      value={String(editBus[field.key] ?? "")}
                      onChange={e => setEditBus({ ...editBus, [field.key]: e.target.value })}
                      className={`h-11 rounded-xl font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`}
                    />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>Status</label>
                  <select
                    value={editBus.status}
                    onChange={e => setEditBus({ ...editBus, status: e.target.value as BusData["status"] })}
                    className={`w-full h-11 px-4 rounded-xl font-bold outline-none border ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`}
                  >
                    {["Active", "Maintenance", "Idle", "Out of Service"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>Fuel Level ({editBus.fuelLevel}%)</label>
                  <input
                    type="range" min={0} max={100}
                    value={editBus.fuelLevel}
                    onChange={e => setEditBus({ ...editBus, fuelLevel: +e.target.value })}
                    className="w-full accent-red-600"
                  />
                </div>
                <Button onClick={handleSaveEdit} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-white" style={{ backgroundColor: theme.primary }}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Bus Modal */}
      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setAdding(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl ${isDark ? "bg-zinc-900" : "bg-white"}`}
            >
              <div className="p-8 border-b" style={{ backgroundColor: theme.primary }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-[10px] font-black uppercase tracking-widest">Fleet Registration</p>
                    <h3 className="text-white text-xl font-black uppercase tracking-tight">Add New Bus</h3>
                  </div>
                  <button onClick={() => setAdding(false)} className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-4">
                {[
                  { label: "Plate Number *", key: "plate" },
                  { label: "Model *", key: "model" },
                  { label: "Driver Name", key: "driverName" },
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{f.label}</label>
                    <Input
                      value={String((newBus as any)[f.key] ?? "")}
                      onChange={e => setNewBus({ ...newBus, [f.key]: e.target.value })}
                      className={`h-11 rounded-xl font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`}
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>Year</label>
                    <Input type="number" value={newBus.year} onChange={e => setNewBus({ ...newBus, year: +e.target.value })} className={`h-11 rounded-xl font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>Capacity</label>
                    <Input type="number" value={newBus.capacity} onChange={e => setNewBus({ ...newBus, capacity: +e.target.value })} className={`h-11 rounded-xl font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`} />
                  </div>
                </div>
                <Button onClick={handleAddBus} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-white" style={{ backgroundColor: theme.primary }}>
                  <Plus className="w-4 h-4 mr-2" /> Register Bus
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
