"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Settings, DollarSign, Bell, Shield, Sliders, CheckCircle2,
  AlertTriangle, Globe, Phone, Mail, Clock, Wallet
} from "lucide-react";

function SettingToggle({ label, description, value, onChange, isDark }: {
  label: string; description: string; value: boolean;
  onChange: (v: boolean) => void; isDark: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-0.5">
        <p className={`text-sm font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>{label}</p>
        <p className={`text-[10px] font-bold ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${value ? "bg-emerald-500" : isDark ? "bg-zinc-700" : "bg-slate-200"}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${value ? "left-7" : "left-1"}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { systemSettings, updateSettings, fareConfig, updateFare, adminTheme, theme } = useTenant();
  const isDark = adminTheme === "zinc";
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  const sections = [
    { id: "general", label: "General", icon: Globe },
    { id: "fares", label: "Fare Config", icon: DollarSign },
    { id: "system", label: "System", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className={`text-3xl font-black tracking-tight uppercase flex items-center gap-3 ${isDark ? "text-white" : "text-slate-800"}`}>
              System <span style={{ color: theme.primary }}>Settings</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              Configuration & Administration Panel
            </p>
          </motion.div>
          <Button
            onClick={handleSave}
            className="px-6 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] text-white shadow-lg transition-all active:scale-95"
            style={{ backgroundColor: saved ? "#10b981" : theme.primary }}
          >
            {saved ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Saved!</> : "Save Changes"}
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left ${
                  activeSection === s.id
                    ? "text-white shadow-lg"
                    : isDark ? "text-zinc-400 hover:bg-zinc-800/50" : "text-slate-500 hover:bg-white"
                }`}
                style={{ backgroundColor: activeSection === s.id ? theme.primary : "transparent" }}
              >
                <s.icon className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-9 space-y-6">

            {/* GENERAL */}
            {activeSection === "general" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className={`border-0 shadow-xl rounded-[2.5rem] ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>
                      Organization Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 space-y-5">
                    {[
                      { label: "Organization Name", key: "orgName", icon: Globe },
                      { label: "Contact Email", key: "contactEmail", icon: Mail },
                      { label: "Contact Phone", key: "contactPhone", icon: Phone },
                    ].map(f => (
                      <div key={f.key} className="space-y-2">
                        <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{f.label}</label>
                        <div className="relative">
                          <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            value={(systemSettings as any)[f.key]}
                            onChange={e => updateSettings({ [f.key]: e.target.value })}
                            className={`h-12 pl-12 rounded-2xl font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>Currency</label>
                        <select
                          value={systemSettings.defaultCurrency}
                          onChange={e => updateSettings({ defaultCurrency: e.target.value })}
                          className={`w-full h-12 px-4 rounded-2xl font-bold outline-none border ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`}
                        >
                          {["ETB", "USD", "EUR"].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>Ticket Validity (hrs)</label>
                        <Input
                          type="number"
                          value={systemSettings.ticketValidityHours}
                          onChange={e => updateSettings({ ticketValidityHours: +e.target.value })}
                          className={`h-12 rounded-2xl font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* FARE CONFIG */}
            {activeSection === "fares" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className={`p-4 rounded-2xl border flex items-start gap-3 ${isDark ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50 border-amber-100"}`}>
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                    Fare changes take immediate effect. Use caution when updating live routes.
                  </p>
                </div>
                {fareConfig.map((fare, idx) => (
                  <motion.div key={fare.routeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
                    <Card className={`border-0 shadow-lg rounded-[2rem] ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                      <CardHeader className={`p-6 pb-3 border-b ${isDark ? "border-zinc-800" : "border-slate-50"}`}>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[#CC1F1F0F]">
                            <DollarSign className="w-4 h-4 text-[#CC1F1F]" />
                          </div>
                          <div>
                            <CardTitle className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>
                              {fare.routeName}
                            </CardTitle>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{fare.routeId}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { label: "Base Fare", key: "baseFare" },
                            { label: "Express", key: "expressFare" },
                            { label: "Student", key: "studentFare" },
                            { label: "Senior", key: "seniorFare" },
                          ].map(f => (
                            <div key={f.key} className="space-y-1.5">
                              <label className={`text-[8px] font-black uppercase tracking-widest ${isDark ? "text-zinc-600" : "text-slate-400"}`}>{f.label} (ETB)</label>
                              <div className="relative">
                                <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black ${isDark ? "text-zinc-500" : "text-slate-400"}`}>ETB</span>
                                <Input
                                  type="number"
                                  step="0.5"
                                  value={(fare as any)[f.key]}
                                  onChange={e => updateFare(fare.routeId, { [f.key]: +e.target.value })}
                                  className={`h-10 pl-12 rounded-xl font-bold text-sm ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* SYSTEM */}
            {activeSection === "system" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`border-0 shadow-xl rounded-[2.5rem] ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>
                      System Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 divide-y divide-slate-50 dark:divide-zinc-800">
                    <SettingToggle
                      label="Maintenance Mode"
                      description="Temporarily disable the public-facing app for maintenance"
                      value={systemSettings.maintenanceMode}
                      onChange={v => updateSettings({ maintenanceMode: v })}
                      isDark={isDark}
                    />
                    <SettingToggle
                      label="Auto-Assign Drivers"
                      description="Automatically assign available drivers to new trips"
                      value={systemSettings.autoAssignDrivers}
                      onChange={v => updateSettings({ autoAssignDrivers: v })}
                      isDark={isDark}
                    />
                    <SettingToggle
                      label="Require QR Validation"
                      description="Force QR code scan for all ticket boardings"
                      value={systemSettings.requireQRValidation}
                      onChange={v => updateSettings({ requireQRValidation: v })}
                      isDark={isDark}
                    />
                    <div className="pt-4 space-y-2">
                      <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-500" : "text-slate-400"}`}>Max Wallet Balance (ETB)</label>
                      <Input
                        type="number"
                        value={systemSettings.maxWalletBalance}
                        onChange={e => updateSettings({ maxWalletBalance: +e.target.value })}
                        className={`h-12 rounded-2xl font-bold ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-slate-50 border-slate-100"}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`border-0 shadow-xl rounded-[2.5rem] ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 divide-y divide-slate-50 dark:divide-zinc-800">
                    <SettingToggle
                      label="Push Notifications"
                      description="Send push alerts for bus arrivals and service updates"
                      value={systemSettings.enableNotifications}
                      onChange={v => updateSettings({ enableNotifications: v })}
                      isDark={isDark}
                    />
                    {[
                      { label: "Low Fuel Alerts", desc: "Alert when bus fuel drops below 20%" },
                      { label: "Trip Completion Alerts", desc: "Notify admin when trips are completed" },
                      { label: "Revenue Reports", desc: "Daily revenue summary to admin email" },
                    ].map(n => (
                      <SettingToggle
                        key={n.label}
                        label={n.label}
                        description={n.desc}
                        value={true}
                        onChange={() => {}}
                        isDark={isDark}
                      />
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* SECURITY */}
            {activeSection === "security" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className={`border-0 shadow-xl rounded-[2.5rem] ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>
                      Security & Access Control
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4 divide-y divide-slate-50 dark:divide-zinc-800">
                    {[
                      { label: "Two-Factor Authentication", desc: "Require 2FA for admin logins" },
                      { label: "Session Timeout", desc: "Automatically log out after 30 minutes of inactivity" },
                      { label: "Audit Logging", desc: "Log all admin actions to the audit trail" },
                      { label: "API Rate Limiting", desc: "Enforce per-IP rate limits on all API endpoints" },
                    ].map(s => (
                      <SettingToggle
                        key={s.label}
                        label={s.label}
                        description={s.desc}
                        value={true}
                        onChange={() => {}}
                        isDark={isDark}
                      />
                    ))}
                  </CardContent>
                </Card>
                <Card className={`border-0 shadow-xl rounded-[2.5rem] overflow-hidden ${isDark ? "bg-zinc-900" : "bg-white"}`}>
                  <div className={`p-6 border-b ${isDark ? "border-zinc-800" : "border-slate-50"}`}>
                    <h4 className={`text-sm font-black uppercase tracking-widest ${isDark ? "text-white" : "text-slate-800"}`}>Danger Zone</h4>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    {["Reset All Fare Configs", "Clear Ticket Ledger", "Revoke All Active Sessions"].map(action => (
                      <button
                        key={action}
                        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-rose-100 text-rose-600 hover:bg-rose-50 transition-all font-black text-[10px] uppercase tracking-widest"
                      >
                        {action}
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
