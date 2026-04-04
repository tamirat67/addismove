import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const router = express.Router();

// GET ALL BUSES
router.get("/buses", async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    const buses = await prisma.bus.findMany({
      where: tenantId ? { tenantId: String(tenantId) } : {},
      include: { driver: true, tenant: true },
    });
    res.json(buses);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch buses" });
  }
});

// GET ALL DRIVERS
router.get("/drivers", async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    const drivers = await prisma.driver.findMany({
      where: tenantId ? { tenantId: String(tenantId) } : {},
      include: { bus: true },
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

// ADD NEW BUS
router.post("/buses", async (req: Request, res: Response): Promise<any> => {
  try {
    const { plate, model, capacity, year, tenantId, status } = req.body;
    const bus = await prisma.bus.create({
      data: { plate, model, capacity: Number(capacity), year: Number(year), tenantId, status },
    });
    res.status(201).json(bus);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE BUS STATUS/LOCATION (For Mock Simulation)
router.patch("/buses/:id/location", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { lat, lng, fuel, mileage } = req.body;
    const bus = await prisma.bus.update({
      where: { id: id as string },
      data: { gpsLat: lat, gpsLng: lng, fuelLevel: fuel, mileage: mileage },
    });
    res.json(bus);
  } catch (error: any) {
    res.status(400).json({ error: "Update failed" });
  }
});

export default router;
