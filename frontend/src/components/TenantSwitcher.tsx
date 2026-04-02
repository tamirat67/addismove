"use client";

import { useTenant, TenantType } from "@/context/TenantContext";
import { Button } from "@/components/ui/button";
import { Bus, Train } from "lucide-react";

export function TenantSwitcher() {
  const { tenant, setTenant } = useTenant();

  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
      <Button
        variant={tenant === "anbessa" ? "default" : "ghost"}
        onClick={() => setTenant("anbessa")}
        className={`flex-1 rounded-lg h-10 transition-all ${
          tenant === "anbessa" 
            ? "bg-[#E21D1D] hover:bg-[#B91C1C] text-white shadow-sm" 
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Bus className="w-4 h-4 mr-2" /> Anbessa
      </Button>
      <Button
        variant={tenant === "lrt" ? "default" : "ghost"}
        onClick={() => setTenant("lrt")}
        className={`flex-1 rounded-lg h-10 transition-all ${
          tenant === "lrt" 
            ? "bg-[#92c01f] hover:bg-[#7fa81a] text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Train className="w-4 h-4 mr-2" /> LRT
      </Button>
    </div>
  );
}
