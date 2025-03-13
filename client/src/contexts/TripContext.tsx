import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Trip, CreateTripData, UpdateTripData, TipData, tripService } from '../services/tripService';

interface TripContextType {
  trips: Trip[];
  upcomingTrips: Trip[];
  pastTrips: Trip[];
  loading: boolean;
  error: string | null;
  createTrip: (data: CreateTripData) => Promise<Trip>;
  updateTrip: (tripId: string, data: UpdateTripData) => Promise<Trip>;
  deleteTrip: (tripId: string) => Promise<void>;
  addTip: (tripId: string, data: TipData) => Promise<Trip>;
  fetchTrips: (filters?: { status?: string; startDate?: string; endDate?: string; destination?: string }) => Promise<void>;
  fetchUpcomingTrips: () => Promise<void>;
  fetchPastTrips: () => Promise<void>;
  getTripById: (tripId: string) => Promise<Trip>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrip = useCallback(async (data: CreateTripData) => {
    setLoading(true);
    setError(null);
    try {
      const newTrip = await tripService.createTrip(data);
      setTrips(prev => [...prev, newTrip]);
      return newTrip;
    } catch (err) {
      setError('Failed to create trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTrip = useCallback(async (tripId: string, data: UpdateTripData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTrip = await tripService.updateTrip(tripId, data);
      setTrips(prev => prev.map(trip => trip._id === tripId ? updatedTrip : trip));
      return updatedTrip;
    } catch (err) {
      setError('Failed to update trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTrip = useCallback(async (tripId: string) => {
    setLoading(true);
    setError(null);
    try {
      await tripService.deleteTrip(tripId);
      setTrips(prev => prev.filter(trip => trip._id !== tripId));
    } catch (err) {
      setError('Failed to delete trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTip = useCallback(async (tripId: string, data: TipData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTrip = await tripService.addTip(tripId, data);
      setTrips(prev => prev.map(trip => trip._id === tripId ? updatedTrip : trip));
      return updatedTrip;
    } catch (err) {
      setError('Failed to add tip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTrips = useCallback(async (filters?: { status?: string; startDate?: string; endDate?: string; destination?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTrips = await tripService.getTrips(filters);
      setTrips(fetchedTrips);
    } catch (err) {
      setError('Failed to fetch trips');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUpcomingTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTrips = await tripService.getUpcomingTrips();
      setUpcomingTrips(fetchedTrips);
    } catch (err) {
      setError('Failed to fetch upcoming trips');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPastTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTrips = await tripService.getPastTrips();
      setPastTrips(fetchedTrips);
    } catch (err) {
      setError('Failed to fetch past trips');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTripById = useCallback(async (tripId: string) => {
    setLoading(true);
    setError(null);
    try {
      const trip = await tripService.getTripById(tripId);
      return trip;
    } catch (err) {
      setError('Failed to fetch trip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    trips,
    upcomingTrips,
    pastTrips,
    loading,
    error,
    createTrip,
    updateTrip,
    deleteTrip,
    addTip,
    fetchTrips,
    fetchUpcomingTrips,
    fetchPastTrips,
    getTripById
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}; 