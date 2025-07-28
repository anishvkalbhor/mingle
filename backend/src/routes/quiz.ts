// routes/quiz.ts

import express, { Request, Response } from "express";

const router = express.Router();

// Example in-memory storage (replace with DB like MongoDB/Postgres)
const quizResults: {
  userId: string;
  score: number;
  answers: { question: string; answerId: string }[];
}[] = [];

router.post("/submit", (req: Request, res: Response) => {
  const { userId, score, answers } = req.body;

  if (!userId || !score || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Invalid data provided." });
  }

  // Save quiz result
  quizResults.push({ userId, score, answers });

  return res.status(200).json({ message: "Quiz submitted successfully!" });
});

router.get("/results/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  const results = quizResults.filter((r) => r.userId === userId);
  res.json({ results });
});

export default router;
