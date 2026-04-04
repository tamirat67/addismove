import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const router = express.Router();

// ISSUE TICKET (Purchase)
router.post("/issue", async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, routeId, tenantId, plateNumber, driverName, price } = req.body;

    // Check Wallet Balance
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < price) {
        return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    // Generate security codes
    const qrCode = `ANB-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
    const securityCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Transactional Update: Deduct balance & Create ticket
    const result = await prisma.$transaction(async (tx: any) => {
        await tx.wallet.update({
            where: { userId: userId as string },
            data: { balance: { decrement: price as number } }
        });

        await tx.transaction.create({
            data: { 
                userId: userId as string, 
                walletId: wallet.id, 
                type: "TICKET_PURCHASE", 
                amount: price,
                status: "SUCCESS"
            }
        });

        const ticket = await tx.ticket.create({
            data: {
                userId,
                routeId,
                tenantId,
                qrCode,
                securityCode,
                price,
                plateNumber,
                driverName,
                expiresAt,
                status: "ACTIVE"
            },
            include: { user: true, route: true }
        });

        return ticket;
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Ticket issuance failed" });
  }
});

// VALIDATE TICKET (Conductor Terminal)
router.post("/validate", async (req: Request, res: Response): Promise<any> => {
    try {
        const { ticketId, tripId, conductorId, method } = req.body;

        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });

        if (ticket.status !== "ACTIVE") {
            return res.status(400).json({ error: "Ticket already used or expired", status: ticket.status });
        }

        // Check expiry
        if (new Date() > new Date(ticket.expiresAt)) {
            await prisma.ticket.update({ where: { id: ticketId }, data: { status: "EXPIRED" } });
            return res.status(400).json({ error: "Ticket has expired", status: "EXPIRED" });
        }

        // Atomic update and log
        const updatedTicket = await prisma.$transaction(async (tx: any) => {
            const t = await tx.ticket.update({
                where: { id: ticketId as string },
                data: { status: "USED" }
            });

            await tx.ticketValidation.create({
                data: {
                    ticketId,
                    tripId,
                    conductorId,
                    method,
                    passed: true
                }
            });

            // If trip provided, increment passenger count
            if (tripId) {
                await tx.trip.update({
                    where: { id: tripId },
                    data: { 
                        passengersCarried: { increment: 1 },
                        revenue: { increment: t.price }
                    }
                });
            }

            return t;
        });

        res.json({ success: true, ticket: updatedTicket });
    } catch (error: any) {
        res.status(400).json({ error: "Validation failed" });
    }
});

export default router;
