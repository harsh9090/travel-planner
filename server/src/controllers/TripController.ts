import { Request, Response } from 'express';
import { Trip } from '../models/Trip';
import mongoose from 'mongoose';

// Extend the Request type to include the user property
interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export class TripController {
  // Create a new trip
  static async createTrip(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const tripData = { ...req.body, userId };
      
      const trip = new Trip(tripData);
      await trip.save();
      
      res.status(201).json({
        success: true,
        trip
      });
    } catch (error) {
      console.error('Create trip error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create trip'
      });
    }
  }

  // Get all trips for a user with optional filters
  static async getTrips(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const { status, startDate, endDate, destination } = req.query;
      
      const query: any = { userId };
      
      // Apply filters if provided
      if (status) query.status = status;
      if (destination) query.destination = new RegExp(destination as string, 'i');
      if (startDate || endDate) {
        query.startDate = {};
        if (startDate) query.startDate.$gte = new Date(startDate as string);
        if (endDate) query.startDate.$lte = new Date(endDate as string);
      }

      const trips = await Trip.find(query).sort({ startDate: 1 });
      
      res.json({
        success: true,
        trips
      });
    } catch (error) {
      console.error('Get trips error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trips'
      });
    }
  }

  // Get a single trip by ID
  static async getTripById(req: AuthRequest, res: Response) {
    try {
      const { tripId } = req.params;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid trip ID'
        });
      }

      const trip = await Trip.findOne({ _id: tripId, userId });
      
      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found'
        });
      }

      res.json({
        success: true,
        trip
      });
    } catch (error) {
      console.error('Get trip error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch trip'
      });
    }
  }

  // Update a trip
  static async updateTrip(req: AuthRequest, res: Response) {
    try {
      const { tripId } = req.params;
      const userId = req.user?.userId;
      const updates = req.body;

      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid trip ID'
        });
      }

      const trip = await Trip.findOneAndUpdate(
        { _id: tripId, userId },
        updates,
        { new: true, runValidators: true }
      );

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found'
        });
      }

      res.json({
        success: true,
        trip
      });
    } catch (error) {
      console.error('Update trip error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update trip'
      });
    }
  }

  // Delete a trip
  static async deleteTrip(req: AuthRequest, res: Response) {
    try {
      const { tripId } = req.params;
      const userId = req.user?.userId;

      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid trip ID'
        });
      }

      const trip = await Trip.findOneAndDelete({ _id: tripId, userId });

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found'
        });
      }

      res.json({
        success: true,
        message: 'Trip deleted successfully'
      });
    } catch (error) {
      console.error('Delete trip error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete trip'
      });
    }
  }

  // Add a tip to a trip
  static async addTip(req: AuthRequest, res: Response) {
    try {
      const { tripId } = req.params;
      const userId = req.user?.userId;
      const { content, category } = req.body;

      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid trip ID'
        });
      }

      const trip = await Trip.findOneAndUpdate(
        { _id: tripId, userId },
        {
          $push: {
            tips: { content, category, createdAt: new Date() }
          }
        },
        { new: true }
      );

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: 'Trip not found'
        });
      }

      res.json({
        success: true,
        trip
      });
    } catch (error) {
      console.error('Add tip error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add tip'
      });
    }
  }

  // Get upcoming trips
  static async getUpcomingTrips(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const trips = await Trip.find({
        userId,
        status: 'upcoming',
        startDate: { $gt: new Date() }
      }).sort({ startDate: 1 });

      res.json({
        success: true,
        trips
      });
    } catch (error) {
      console.error('Get upcoming trips error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch upcoming trips'
      });
    }
  }

  // Get past trips
  static async getPastTrips(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const trips = await Trip.find({
        userId,
        status: 'completed',
        endDate: { $lt: new Date() }
      }).sort({ endDate: -1 });

      res.json({
        success: true,
        trips
      });
    } catch (error) {
      console.error('Get past trips error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch past trips'
      });
    }
  }
} 