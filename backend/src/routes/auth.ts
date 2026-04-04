import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "anbessa-super-secret-key-12345";

// Validation Schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["PASSENGER", "ADMIN", "DRIVER", "CONDUCTOR"]).default("PASSENGER"),
  tenantId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// SIGNUP
router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = signupSchema.parse(req.body);
    const { email, password, name, role, tenantId } = validatedData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: role as any,
        tenantId,
        wallet: role === "PASSENGER" ? { create: { balance: 0 } } : undefined,
      },
      include: { wallet: true },
    });

    // Sign JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, wallet: user.wallet } });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { wallet: true, tenant: true },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Sign JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, wallet: user.wallet, tenant: user.tenant } });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Login failed" });
  }
});

// GET PROFILE (Token Verification Example)
router.get("/me", async (req: Request, res: Response): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { wallet: true, tenant: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, wallet: user.wallet, tenant: user.tenant } });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

export default router;
