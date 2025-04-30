import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for user data
  app.get('/api/user', (req, res) => {
    // Return current user data (from storage in a real app)
    res.json({
      name: 'Sarah Johnson',
      joinDate: '15 Jan 2023',
      points: 245,
      cardsStudied: 78,
      accuracy: '72%'
    });
  });

  // API endpoint to update user points
  app.post('/api/user/points', (req, res) => {
    const { points } = req.body;
    if (typeof points !== 'number') {
      return res.status(400).json({ message: 'Points must be a number' });
    }
    
    // In a real app, this would update the user's points in storage
    res.json({ success: true });
  });

  // API endpoint to update studied cards count
  app.post('/api/user/cards', (req, res) => {
    // In a real app, this would update the user's studied cards count
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
