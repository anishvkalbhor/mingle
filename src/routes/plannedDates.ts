import { Router, Request, Response } from "express";
import PlannedDate from "../models/PlannedDate";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

const router = Router();

// Apply authentication middleware to all routes
router.use(ClerkExpressRequireAuth());

// CREATE - Save a planned date
router.post("/", async (req: Request, res: Response) => {
  try {
    const { 
      date, 
      time, 
      state, 
      city, 
      venueType, 
      venueName, 
      venueAddress, 
      venueRating, 
      venueCategory, 
      venueMapsUrl 
    } = req.body;

    // Get user ID from Clerk authentication
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - User not authenticated" });
    }

    console.log("Creating planned date for user:", userId);

    // Validate required fields
    if (!date || !time || !state || !city || !venueType || !venueName || !venueAddress) {
      return res.status(400).json({ 
        error: "Missing required fields: date, time, state, city, venueType, venueName, venueAddress" 
      });
    }

    // Create new planned date
    const plannedDate = new PlannedDate({
      userId,
      date: new Date(date),
      time,
      state,
      city,
      venueType,
      venueName,
      venueAddress,
      venueRating,
      venueCategory,
      venueMapsUrl,
      status: 'planned'
    });

    const savedDate = await plannedDate.save();
    console.log("Planned date saved successfully:", savedDate._id);

    return res.status(201).json({
      success: true,
      message: "Date planned successfully!",
      data: savedDate
    });

  } catch (error) {
    console.error("Error saving planned date:", error);
    return res.status(500).json({ 
      error: "Failed to save planned date",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// READ - Get all planned dates for a user
router.get("/", async (req: Request, res: Response) => {
  try {
    // Get user ID from Clerk authentication
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - User not authenticated" });
    }

    const { status, limit = 20, page = 1 } = req.query;

    // Build query
    const query: any = { userId };
    if (status && typeof status === 'string') {
      query.status = status;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    const plannedDates = await PlannedDate.find(query)
      .sort({ date: 1, time: 1 }) // Sort by date and time ascending
      .limit(Number(limit))
      .skip(skip);

    const total = await PlannedDate.countDocuments(query);

    return res.json({
      success: true,
      data: plannedDates,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        count: plannedDates.length,
        totalCount: total
      }
    });

  } catch (error) {
    console.error("Error fetching planned dates:", error);
    return res.status(500).json({ 
      error: "Failed to fetch planned dates",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// UPDATE - Update a planned date status
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    // Get user ID from Clerk authentication
    const userId = req.auth.userId;
    const { id } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - User not authenticated" });
    }

    if (!status || !['planned', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status. Must be 'planned', 'completed', or 'cancelled'" 
      });
    }

    const updatedDate = await PlannedDate.findOneAndUpdate(
      { _id: id, userId }, // Ensure user can only update their own dates
      { status },
      { new: true }
    );

    if (!updatedDate) {
      return res.status(404).json({ error: "Planned date not found" });
    }

    return res.json({
      success: true,
      message: "Date status updated successfully",
      data: updatedDate
    });

  } catch (error) {
    console.error("Error updating planned date:", error);
    return res.status(500).json({ 
      error: "Failed to update planned date",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// DELETE - Delete a planned date
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    // Get user ID from Clerk authentication
    const userId = req.auth.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - User not authenticated" });
    }

    const deletedDate = await PlannedDate.findOneAndDelete({
      _id: id,
      userId // Ensure user can only delete their own dates
    });

    if (!deletedDate) {
      return res.status(404).json({ error: "Planned date not found" });
    }

    return res.json({
      success: true,
      message: "Planned date deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting planned date:", error);
    return res.status(500).json({ 
      error: "Failed to delete planned date",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

export default router;
