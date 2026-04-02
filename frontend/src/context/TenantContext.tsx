"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type TenantType = "anbessa" | "lrt";

interface TenantTheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

const themes: Record<TenantType, TenantTheme> = {
  anbessa: {
    primary: "#E21D1D", // Red from bus livery
    secondary: "#FFC300", // Yellow from bus livery
    accent: "#FDE68A", // Light Yellow
    text: "#B91C1C", // Dark Red
  },
  lrt: {
    primary: "#008751", // ERC/LRT Green
    secondary: "#FFFFFF", // White
    accent: "#FFD700", // Gold/Yellow often in logos
    text: "#064E3B", // Dark Green
  },
};

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  provider?: string;
  status: "Success" | "Pending" | "Failed";
  date: string;
}

export interface TicketData {
  id: string;
  route: string;
  type: string; // Bus, Train, Combined
  price: number;
  expiry: string;
  qrCode: string;
  status: "Active" | "Expiring" | "Used";
}

interface TenantContextProps {
  tenant: TenantType;
  theme: TenantTheme;
  setTenant: (tenant: TenantType) => void;
  balance: number;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;
  tickets: TicketData[];
  addTicket: (ticket: Omit<TicketData, "id" | "qrCode" | "status">) => void;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantType>("anbessa");
  const [balance, setBalance] = useState(120.00);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "Ticket Booking",
      amount: -12.00,
      status: "Success",
      date: "02 Apr, 14:15",
    },
    {
      id: "2",
      type: "CBE Birr Top Up",
      amount: 200.00,
      status: "Success",
      date: "01 Apr, 10:00",
    },
  ]);
  const [tickets, setTickets] = useState<TicketData[]>([
    {
      id: "T1",
      route: "Megenagna → Piassa",
      type: "Combined",
      price: 12.00,
      expiry: "Today, 4:30 PM",
      qrCode: "MOCK-QR-CODE-123",
      status: "Active"
    }
  ]);

  const addBalance = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  const deductBalance = (amount: number): boolean => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);
    return true;
  };

  const addTransaction = (tx: Omit<Transaction, "id" | "date">) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      }),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const addTicket = (ticket: Omit<TicketData, "id" | "qrCode" | "status">) => {
    const newTicket: TicketData = {
      ...ticket,
      id: `TKT-${Math.floor(Math.random() * 1000000)}`,
      qrCode: `QR-${Math.random().toString(36).toUpperCase().substr(2, 8)}`,
      status: "Active"
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <TenantContext.Provider 
      value={{ 
        tenant, theme: themes[tenant], setTenant, 
        balance, addBalance, deductBalance, 
        transactions, addTransaction,
        tickets, addTicket
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
