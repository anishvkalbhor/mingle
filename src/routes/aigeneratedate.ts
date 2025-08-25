import express, { Request, Response } from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();

router.post("/generate-date-ideas", async (req: Request, res: Response) => {
  const { location, interests, budget, personality, type } = req.body;

  if (!location || !interests || !budget || !personality || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `
    Suggest 3 fun and creative ${type} date ideas for a couple in ${location}.
    They enjoy ${interests}, have a ${budget} budget, and are ${personality}s.
    Be unique, personal, short in 2-3 lines, and try to keep it location-relevant.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    type OpenAIResponse = {
      choices?: { message?: { content?: string } }[];
    };
    const data = await response.json() as OpenAIResponse;

    if (!response.ok || !data.choices?.[0]?.message?.content) {
      return res.status(500).json({ error: "Invalid OpenAI response" });
    }

    return res.json({ ideas: data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: "Failed to generate ideas" });
  }
});

export default router;