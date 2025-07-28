import express, { Request, Response } from "express";
import { UserStats } from "../models/UserStats";

const router = express.Router();

// GET /api/user-stats/:userId
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const stats = await UserStats.findOne({ userId: req.params.userId });
    if (!stats) return res.status(404).json({ error: "Stats not found" });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/user-stats/:userId (create or update)
router.post("/:userId", async (req: Request, res: Response) => {
  const { streak, coins, rank } = req.body;
  const { userId } = req.params;

  try {
    const updatedStats = await UserStats.findOneAndUpdate(
      { userId },
      { streak, coins, rank },
      { new: true, upsert: true }
    );
    res.json({ message: "Stats saved", stats: updatedStats });
  } catch (err) {
    res.status(500).json({ error: "Failed to update stats" });
  }
});

export default router;
