"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export type TenantType = "anbessa";

interface TenantTheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

const themes: Record<TenantType, TenantTheme> = {
  anbessa: {
    primary: "#CC1F1F",
    secondary: "#FFD600",
    accent: "#FFAB00",
    text: "#212121",
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
  type: string;
  price: number;
  expiry: string;
  qrCode: string;
  nfcId: string;
  securityCode: string;
  status: "Active" | "Expiring" | "Used";
  plateNumber: string;
  driverName: string;
  createdAt: string;
}

export interface BusData {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  year: number;
  status: "Active" | "Maintenance" | "Idle" | "Out of Service";
  routeId: string;
  driverName: string;
  driverId: string;
  fuelLevel: number;
  mileage: number;
  lastService: string;
  gpsLat: number;
  gpsLng: number;
}

export interface DriverData {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  licenseExpiry: string;
  status: "On Duty" | "Off Duty" | "Leave";
  assignedBus: string;
  assignedRoute: string;
  totalTrips: number;
  rating: number;
  joinDate: string;
}

export interface TripData {
  id: string;
  busPlate: string;
  driverName: string;
  route: string;
  startTime: string;
  endTime: string | null;
  status: "Completed" | "In Progress" | "Cancelled";
  passengersCarried: number;
  revenue: number;
  startStop: string;
  endStop: string;
}

export interface FareConfig {
  routeId: string;
  routeName: string;
  baseFare: number;
  expressFare: number;
  studentFare: number;
  seniorFare: number;
}

export interface SystemSettings {
  orgName: string;
  contactEmail: string;
  contactPhone: string;
  defaultCurrency: string;
  ticketValidityHours: number;
  maxWalletBalance: number;
  enableNotifications: boolean;
  maintenanceMode: boolean;
  autoAssignDrivers: boolean;
  requireQRValidation: boolean;
}

export const FLEET_REGISTRY = {
  "Megenagna → Piassa": [
    { plate: "AB-3-A7721", driver: "Solomon G." },
    { plate: "AB-2-B1104", driver: "Abebe K." },
    { plate: "AB-1-X9920", driver: "Tadesse W." }
  ],
  "Bole → Mexico": [
    { plate: "AB-4-M0021", driver: "Kassa T." },
    { plate: "AB-5-M4412", driver: "Zewdu H." }
  ],
  "Ayat → Tor Hailoch": [
    { plate: "AB-2-Y8831", driver: "Mekonnen L." },
    { plate: "AB-1-Y4401", driver: "Henok R." }
  ]
};

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
  addTicket: (ticket: Omit<TicketData, "id" | "qrCode" | "nfcId" | "securityCode" | "status" | "plateNumber" | "driverName" | "createdAt" | "expiry">) => void;
  validateTicket: (id: string) => boolean;
  issueManualTicket: (route: string, type: string, price: number) => void;
  bulkIssueTickets: (route: string, type: string, price: number, plateNumber: string, driverName: string, count: number) => void;
  buses: BusData[];
  updateBus: (id: string, data: Partial<BusData>) => void;
  addBus: (bus: Omit<BusData, "id">) => void;
  removeBus: (id: string) => void;
  drivers: DriverData[];
  updateDriver: (id: string, data: Partial<DriverData>) => void;
  trips: TripData[];
  addTrip: (trip: Omit<TripData, "id">) => void;
  fareConfig: FareConfig[];
  updateFare: (routeId: string, data: Partial<FareConfig>) => void;
  systemSettings: SystemSettings;
  updateSettings: (data: Partial<SystemSettings>) => void;
  adminTheme: "light" | "zinc";
  setAdminTheme: (theme: "light" | "zinc") => void;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

const INITIAL_BUSES: BusData[] = [
  { id: "bus-1", plate: "AB-3-A7721", model: "Yutong ZK6122H9", capacity: 45, year: 2019, status: "Active", routeId: "R-01", driverName: "Solomon G.", driverId: "drv-1", fuelLevel: 78, mileage: 128450, lastService: "2026-02-15", gpsLat: 9.0192, gpsLng: 38.7525 },
  { id: "bus-2", plate: "AB-2-B1104", model: "King Long XMQ6127", capacity: 50, year: 2020, status: "Active", routeId: "R-01", driverName: "Abebe K.", driverId: "drv-2", fuelLevel: 45, mileage: 95230, lastService: "2026-03-01", gpsLat: 9.0298, gpsLng: 38.7612 },
  { id: "bus-3", plate: "AB-1-X9920", model: "Tata Starbus Ultra", capacity: 35, year: 2018, status: "Maintenance", routeId: "R-01", driverName: "Tadesse W.", driverId: "drv-3", fuelLevel: 20, mileage: 201880, lastService: "2026-01-08", gpsLat: 9.0105, gpsLng: 38.7680 },
  { id: "bus-4", plate: "AB-4-M0021", model: "Yutong ZK6122H9", capacity: 45, year: 2021, status: "Active", routeId: "R-04", driverName: "Kassa T.", driverId: "drv-4", fuelLevel: 92, mileage: 67800, lastService: "2026-03-20", gpsLat: 8.9956, gpsLng: 38.7892 },
  { id: "bus-5", plate: "AB-5-M4412", model: "Higer KLQ6109GE3", capacity: 40, year: 2022, status: "Active", routeId: "R-04", driverName: "Zewdu H.", driverId: "drv-5", fuelLevel: 60, mileage: 42100, lastService: "2026-03-28", gpsLat: 9.0080, gpsLng: 38.7760 },
  { id: "bus-6", plate: "AB-2-Y8831", model: "King Long XMQ6127", capacity: 50, year: 2020, status: "Active", routeId: "R-15", driverName: "Mekonnen L.", driverId: "drv-6", fuelLevel: 55, mileage: 88900, lastService: "2026-02-28", gpsLat: 9.0420, gpsLng: 38.8012 },
  { id: "bus-7", plate: "AB-1-Y4401", model: "Tata Starbus", capacity: 35, year: 2017, status: "Out of Service", routeId: "R-15", driverName: "Henok R.", driverId: "drv-7", fuelLevel: 10, mileage: 287400, lastService: "2025-12-01", gpsLat: 9.0350, gpsLng: 38.7980 },
  { id: "bus-8", plate: "AB-3-C5512", model: "Yutong ZK6125HGE", capacity: 55, year: 2023, status: "Idle", routeId: "R-22", driverName: "Alemu B.", driverId: "drv-8", fuelLevel: 88, mileage: 18200, lastService: "2026-03-30", gpsLat: 9.0015, gpsLng: 38.7390 },
];

const INITIAL_DRIVERS: DriverData[] = [
  { id: "drv-1", name: "Solomon Gebre", phone: "+251 911 234 567", licenseNo: "ETH-DL-A12345", licenseExpiry: "2027-06-15", status: "On Duty", assignedBus: "AB-3-A7721", assignedRoute: "Megenagna → Piassa", totalTrips: 1842, rating: 4.8, joinDate: "2019-03-10" },
  { id: "drv-2", name: "Abebe Kebede", phone: "+251 922 345 678", licenseNo: "ETH-DL-B23456", licenseExpiry: "2026-11-20", status: "On Duty", assignedBus: "AB-2-B1104", assignedRoute: "Megenagna → Piassa", totalTrips: 1204, rating: 4.6, joinDate: "2020-07-22" },
  { id: "drv-3", name: "Tadesse Worku", phone: "+251 933 456 789", licenseNo: "ETH-DL-C34567", licenseExpiry: "2026-08-30", status: "Off Duty", assignedBus: "AB-1-X9920", assignedRoute: "Megenagna → Piassa", totalTrips: 2301, rating: 4.5, joinDate: "2018-01-15" },
  { id: "drv-4", name: "Kassa Tadele", phone: "+251 944 567 890", licenseNo: "ETH-DL-D45678", licenseExpiry: "2028-03-12", status: "On Duty", assignedBus: "AB-4-M0021", assignedRoute: "Bole → Mexico", totalTrips: 890, rating: 4.9, joinDate: "2021-04-05" },
  { id: "drv-5", name: "Zewdu Haile", phone: "+251 955 678 901", licenseNo: "ETH-DL-E56789", licenseExpiry: "2027-09-30", status: "On Duty", assignedBus: "AB-5-M4412", assignedRoute: "Bole → Mexico", totalTrips: 644, rating: 4.7, joinDate: "2022-01-18" },
  { id: "drv-6", name: "Mekonnen Lemma", phone: "+251 966 789 012", licenseNo: "ETH-DL-F67890", licenseExpiry: "2026-12-01", status: "On Duty", assignedBus: "AB-2-Y8831", assignedRoute: "Ayat → Tor Hailoch", totalTrips: 1120, rating: 4.4, joinDate: "2020-09-12" },
  { id: "drv-7", name: "Henok Reta", phone: "+251 977 890 123", licenseNo: "ETH-DL-G78901", licenseExpiry: "2026-05-22", status: "Leave", assignedBus: "AB-1-Y4401", assignedRoute: "Ayat → Tor Hailoch", totalTrips: 3102, rating: 4.2, joinDate: "2017-06-01" },
  { id: "drv-8", name: "Alemu Bekele", phone: "+251 988 901 234", licenseNo: "ETH-DL-H89012", licenseExpiry: "2029-01-10", status: "Off Duty", assignedBus: "AB-3-C5512", assignedRoute: "Unassigned", totalTrips: 212, rating: 4.9, joinDate: "2023-05-01" },
];

const INITIAL_TRIPS: TripData[] = [
  { id: "trip-1", busPlate: "AB-3-A7721", driverName: "Solomon G.", route: "Megenagna → Piassa", startTime: new Date(Date.now() - 45 * 60000).toISOString(), endTime: null, status: "In Progress", passengersCarried: 38, revenue: 456.00, startStop: "Megenagna Terminal", endStop: "Piassa" },
  { id: "trip-2", busPlate: "AB-4-M0021", driverName: "Kassa T.", route: "Bole → Mexico", startTime: new Date(Date.now() - 30 * 60000).toISOString(), endTime: null, status: "In Progress", passengersCarried: 45, revenue: 540.00, startStop: "Bole Airport", endStop: "Mexico Square" },
  { id: "trip-3", busPlate: "AB-2-B1104", driverName: "Abebe K.", route: "Megenagna → Piassa", startTime: new Date(Date.now() - 120 * 60000).toISOString(), endTime: new Date(Date.now() - 75 * 60000).toISOString(), status: "Completed", passengersCarried: 42, revenue: 504.00, startStop: "Megenagna Terminal", endStop: "Piassa" },
  { id: "trip-4", busPlate: "AB-2-Y8831", driverName: "Mekonnen L.", route: "Ayat → Tor Hailoch", startTime: new Date(Date.now() - 60 * 60000).toISOString(), endTime: new Date(Date.now() - 5 * 60000).toISOString(), status: "Completed", passengersCarried: 50, revenue: 600.00, startStop: "Ayat", endStop: "Tor Hailoch" },
  { id: "trip-5", busPlate: "AB-5-M4412", driverName: "Zewdu H.", route: "Bole → Mexico", startTime: new Date(Date.now() - 3 * 3600000).toISOString(), endTime: new Date(Date.now() - 2.5 * 3600000).toISOString(), status: "Completed", passengersCarried: 35, revenue: 420.00, startStop: "Bole Airport", endStop: "Mexico Square" },
  { id: "trip-6", busPlate: "AB-3-A7721", driverName: "Solomon G.", route: "Megenagna → Piassa", startTime: new Date(Date.now() - 5 * 3600000).toISOString(), endTime: new Date(Date.now() - 4.5 * 3600000).toISOString(), status: "Completed", passengersCarried: 45, revenue: 540.00, startStop: "Megenagna Terminal", endStop: "Piassa" },
  { id: "trip-7", busPlate: "AB-1-X9920", driverName: "Tadesse W.", route: "Megenagna → Piassa", startTime: new Date(Date.now() - 24 * 3600000).toISOString(), endTime: null, status: "Cancelled", passengersCarried: 0, revenue: 0, startStop: "Megenagna Terminal", endStop: "Piassa" },
];

const INITIAL_FARES: FareConfig[] = [
  { routeId: "R-01", routeName: "Megenagna → Piassa", baseFare: 12.00, expressFare: 18.00, studentFare: 6.00, seniorFare: 6.00 },
  { routeId: "R-04", routeName: "Bole → Mexico", baseFare: 12.00, expressFare: 20.00, studentFare: 6.00, seniorFare: 6.00 },
  { routeId: "R-15", routeName: "Ayat → Tor Hailoch", baseFare: 15.00, expressFare: 22.00, studentFare: 7.50, seniorFare: 7.50 },
  { routeId: "R-22", routeName: "Sarbet → Merkato", baseFare: 10.00, expressFare: 15.00, studentFare: 5.00, seniorFare: 5.00 },
  { routeId: "R-31", routeName: "Akaki → Piassa", baseFare: 18.00, expressFare: 25.00, studentFare: 9.00, seniorFare: 9.00 },
];

const INITIAL_SETTINGS: SystemSettings = {
  orgName: "Anbessa City Bus Service",
  contactEmail: "ops@anbessabus.gov.et",
  contactPhone: "+251 11 557 0000",
  defaultCurrency: "ETB",
  ticketValidityHours: 24,
  maxWalletBalance: 5000,
  enableNotifications: true,
  maintenanceMode: false,
  autoAssignDrivers: true,
  requireQRValidation: true,
};

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantType>("anbessa");
  const [adminTheme, setAdminTheme] = useState<"light" | "zinc">("light");
  const [balance, setBalance] = useState(0.00);
  const [buses, setBuses] = useState<BusData[]>([]);
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [fareConfig, setFareConfig] = useState<FareConfig[]>(INITIAL_FARES);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [user, setUser] = useState<any>(null); // To store current logged in user

  // Initial Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Buses
        const busRes = await fetch(`${API_BASE}/fleet/buses`);
        if (busRes.ok) setBuses(await busRes.json());

        // Fetch Drivers
        const driverRes = await fetch(`${API_BASE}/fleet/drivers`);
        if (driverRes.ok) setDrivers(await driverRes.json());
        
        // Fetch active tickets for a default user (for demo)
        const ticketRes = await fetch(`${API_BASE}/tickets/issue`); // Simplified for demo
        // In reality, this would be specific to a logged-in user
      } catch (err) {
        console.error("Failed to connect to backend, falling back to mock", err);
        setBuses(INITIAL_BUSES);
        setDrivers(INITIAL_DRIVERS);
        setTrips(INITIAL_TRIPS);
      }
    };
    fetchData();
  }, []);

  const addBalance = (amount: number) => setBalance((prev) => prev + amount);

  const deductBalance = (amount: number): boolean => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);
    return true;
  };

  const addTransaction = (tx: Omit<Transaction, "id" | "date">) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const addTicket = (ticket: Omit<TicketData, "id" | "qrCode" | "nfcId" | "securityCode" | "status" | "plateNumber" | "driverName" | "createdAt" | "expiry">) => {
    const randomHex = () => Math.random().toString(16).toUpperCase().substr(2, 4);
    const availableBuses = (FLEET_REGISTRY as any)[ticket.route] || [{ plate: "AB-UNK-000", driver: "System assigned" }];
    const assignedBus = availableBuses[Math.floor(Math.random() * availableBuses.length)];
    const newTicket: TicketData = {
      ...ticket,
      id: `ANB-24-${randomHex()}-${randomHex()}`,
      qrCode: `QR-${Math.random().toString(36).toUpperCase().substr(2, 8)}`,
      nfcId: `NF-${randomHex()}-${randomHex()}`,
      securityCode: Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, "$1 $2"),
      status: "Active",
      expiry: "Valid 24h",
      plateNumber: assignedBus.plate,
      driverName: `Driver: ${assignedBus.driver}`,
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const validateTicket = (id: string): boolean => {
    const ticketIndex = tickets.findIndex(t => t.id === id || t.securityCode === id || t.nfcId === id);
    if (ticketIndex === -1) return false;
    if (tickets[ticketIndex].status === "Used") return false;
    const newTickets = [...tickets];
    newTickets[ticketIndex].status = "Used";
    setTickets(newTickets);
    return true;
  };

  const issueManualTicket = (route: string, type: string, price: number) => {
    addTicket({ route, type, price });
    addTransaction({ type: "Station Cash Sale", amount: price, status: "Success" });
  };

  const bulkIssueTickets = (route: string, type: string, price: number, plateNumber: string, driverName: string, count: number) => {
    const newTickets: TicketData[] = [];
    const randomHex = () => Math.random().toString(16).toUpperCase().substr(2, 4);
    for (let i = 0; i < count; i++) {
      newTickets.push({
        id: `ANB-24-${randomHex()}-${randomHex()}`,
        route, type, price,
        expiry: "Station Bulk Issue · 8h",
        qrCode: `QR-${Math.random().toString(36).toUpperCase().substr(2, 8)}`,
        nfcId: `NF-${randomHex()}-${randomHex()}`,
        securityCode: Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, "$1 $2"),
        status: "Active",
        plateNumber,
        driverName: `Driver: ${driverName}`,
        createdAt: new Date().toISOString()
      });
    }
    setTickets((prev) => [...newTickets, ...prev]);
    addTransaction({ type: `Bulk Issue (${count}x)`, amount: price * count, status: "Success" });
  };

  const updateBus = (id: string, data: Partial<BusData>) => {
    setBuses(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const addBus = (bus: Omit<BusData, "id">) => {
    setBuses(prev => [...prev, { ...bus, id: `bus-${Date.now()}` }]);
  };

  const removeBus = (id: string) => {
    setBuses(prev => prev.filter(b => b.id !== id));
  };

  const updateDriver = (id: string, data: Partial<DriverData>) => {
    // drivers are read-only for now, but we expose the updater
  };

  const addTrip = (trip: Omit<TripData, "id">) => {
    setTrips(prev => [{ ...trip, id: `trip-${Date.now()}` }, ...prev]);
  };

  const updateFare = (routeId: string, data: Partial<FareConfig>) => {
    setFareConfig(prev => prev.map(f => f.routeId === routeId ? { ...f, ...data } : f));
  };

  const updateSettings = (data: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...data }));
  };

  return (
    <TenantContext.Provider value={{
      tenant, theme: themes[tenant], setTenant,
      balance, addBalance, deductBalance,
      transactions, addTransaction,
      tickets, addTicket,
      validateTicket, issueManualTicket, bulkIssueTickets,
      buses, updateBus, addBus, removeBus,
      drivers, updateDriver,
      trips, addTrip,
      fareConfig, updateFare,
      systemSettings, updateSettings,
      adminTheme, setAdminTheme
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used within a TenantProvider");
  return context;
}
