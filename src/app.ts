import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import matchRoutes from './routes/match';
import { IApiResponse } from './types';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/matches', matchRoutes);

// Health check route
app.get('/', (_req: Request, res: Response<IApiResponse>) => {
  return res.status(200).json({ 
    status: 'success', 
    message: 'Server is running' 
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response<IApiResponse>, _next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ 
    status: 'error',
    message: 'Something went wrong!',
    data: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app; 