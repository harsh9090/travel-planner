import { Router } from 'express';
import { TripController } from '../controllers/TripController';
import { auth } from '../middleware/auth';

const router = Router();

// Create a new trip
router.post('/', auth, TripController.createTrip);

// Get all trips (with optional filters)
router.get('/', auth, TripController.getTrips);

// Get upcoming trips
router.get('/upcoming', auth, TripController.getUpcomingTrips);

// Get past trips
router.get('/past', auth, TripController.getPastTrips);

// Get a specific trip
router.get('/:tripId', auth, TripController.getTripById);

// Update a trip
router.put('/:tripId', auth, TripController.updateTrip);

// Delete a trip
router.delete('/:tripId', auth, TripController.deleteTrip);

// Add a tip to a trip
router.post('/:tripId/tips', auth, TripController.addTip);

export default router; 