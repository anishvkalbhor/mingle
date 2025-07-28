import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  streak: { type: Number, required: true },
  coins: { type: Number, required: true },
  rank: { type: Number, required: true },
}, {
  timestamps: true,
});

export const UserStats = mongoose.model("UserStats", userStatsSchema);
