"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type TenantType = "anbessa";

interface TenantTheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

const themes: Record<TenantType, TenantTheme> = {
  anbessa: {
    primary: "#CC1F1F", // Anbessa Red
    secondary: "#FFD600", // Anbessa Golden Yellow
    accent: "#FFAB00", // Amber Accent
    text: "#212121", // Onyx
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
  type: string; // Bus, Express, AllDay
  price: number;
  expiry: string;
  qrCode: string;
  nfcId: string; // NFC Token ID
  securityCode: string; // 6-digit Manual OTP
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
  addTicket: (ticket: Omit<TicketData, "id" | "qrCode" | "nfcId" | "securityCode" | "status">) => void;
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
      id: "ANB-24-XJ-9L-03",
      route: "Megenagna → Piassa",
      type: "Combined",
      price: 12.00,
      expiry: "Today, 4:30 PM",
      qrCode: "QR-882109-XJ",
      nfcId: "NF-8B2-C91",
      securityCode: "882 109",
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

  const addTicket = (ticket: Omit<TicketData, "id" | "qrCode" | "nfcId" | "securityCode" | "status">) => {
    const randomHex = () => Math.random().toString(16).toUpperCase().substr(2, 4);
    const newTicket: TicketData = {
      ...ticket,
      id: `ANB-24-${randomHex()}-${randomHex()}`,
      qrCode: `QR-${Math.random().toString(36).toUpperCase().substr(2, 8)}`,
      nfcId: `NF-${randomHex()}-${randomHex()}`,
      securityCode: Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, "$1 $2"),
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
