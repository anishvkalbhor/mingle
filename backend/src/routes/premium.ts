// routes/premium.ts

import express, { Request, Response } from "express";

const router = express.Router();

// Mock database (replace with MongoDB/PostgreSQL/etc.)
const userSubscriptions: Record<string, string> = {};

router.post("/select-plan", async (req: Request, res: Response) => {
  const { userId, plan } = req.body;

  const validPlans = ["Gold", "Silver", "Basic"];

  if (!userId || !plan || !validPlans.includes(plan)) {
    return res.status(400).json({ error: "Invalid data provided" });
  }

  try {
    // Store selected plan in DB or in-memory (mock)
    userSubscriptions[userId] = plan;

    // For paid plans: integrate Razorpay/Stripe here
    if (plan !== "Basic") {
      // TODO: generate payment link
      return res.status(200).json({
        message: `Plan ${plan} selected. Proceed to payment.`,
        paymentUrl: "https://your-payment-gateway.com/link", // mock
      });
    }

    return res.status(200).json({
      message: `Free plan '${plan}' selected successfully.`,
    });
  } catch (err) {
    console.error("Error saving subscription:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
