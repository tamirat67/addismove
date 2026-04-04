import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const router = express.Router();

// GET WALLET & TRANSACTIONS
router.get("/:userId", async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const wallet = await prisma.wallet.findUnique({
      where: { userId: userId as string },
      include: { 
        transactions: { 
          orderBy: { createdAt: "desc" },
          take: 10 
        } 
      },
    });
    
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallet info" });
  }
});

// TOP UP WALLET
router.post("/topup", async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, amount, provider, reference } = req.body;

    const result = await prisma.$transaction(async (tx: any) => {
      // Find wallet
      const wallet = await tx.wallet.findUnique({ where: { userId: userId as string } });
      if (!wallet) throw new Error("Wallet not found");

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: userId as string,
          walletId: wallet.id,
          type: "TOP_UP",
          amount,
          provider,
          reference,
          status: "SUCCESS"
        }
      });

      // Update balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } }
      });

      return { wallet: updatedWallet, transaction };
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Top-up failed" });
  }
});

export default router;
