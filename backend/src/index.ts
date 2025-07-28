import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import venuesRouter from "./routes/venues";
import verifyPhotoRoute from "./routes/photo-verification";
import premiumRoutes from "./routes/premium";
import quizRoutes from "./routes/quiz";
import userStatsRoutes from "./routes/userStats";


const app = express();
const PORT = process.env.PORT || 5000;

import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mingle", {
    
    }).then(() => {
    console.log("Connected to MongoDB");
    }).catch(err => {
    console.error("MongoDB connection error:", err);
});

app.use(cors());
app.use(express.json());

app.use("/api/venues", venuesRouter);
app.use("/api/user", verifyPhotoRoute);
app.use("/api/premium", premiumRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/user-stats", userStatsRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
