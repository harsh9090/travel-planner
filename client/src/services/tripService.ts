import { axiosInstance } from './axiosInstance';

export interface Trip {
  _id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description?: string;
  activities?: Array<{
    name: string;
    date: Date;
    cost: number;
    notes?: string;
  }>;
  expenses?: Array<{
    category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'other';
    amount: number;
    date: Date;
    description?: string;
  }>;
  tips?: Array<{
    content: string;
    category: 'accommodation' | 'transport' | 'food' | 'activities' | 'safety' | 'general';
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripData {
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  description?: string;
}

export interface UpdateTripData extends Partial<CreateTripData> {}

export interface TipData {
  content: string;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'safety' | 'general';
}

class TripService {
  async createTrip(tripData: CreateTripData): Promise<Trip> {
    const response = await axiosInstance.post<{ success: boolean; trip: Trip }>('/trips', tripData);
    return response.data.trip;
  }

  async getTrips(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    destination?: string;
  }): Promise<Trip[]> {
    const response = await axiosInstance.get<{ success: boolean; trips: Trip[] }>('/trips', {
      params: filters
    });
    return response.data.trips;
  }

  async getUpcomingTrips(): Promise<Trip[]> {
    const response = await axiosInstance.get<{ success: boolean; trips: Trip[] }>('/trips/upcoming');
    return response.data.trips;
  }

  async getPastTrips(): Promise<Trip[]> {
    const response = await axiosInstance.get<{ success: boolean; trips: Trip[] }>('/trips/past');
    return response.data.trips;
  }

  async getTripById(tripId: string): Promise<Trip> {
    const response = await axiosInstance.get<{ success: boolean; trip: Trip }>(`/trips/${tripId}`);
    return response.data.trip;
  }

  async updateTrip(tripId: string, updates: UpdateTripData): Promise<Trip> {
    const response = await axiosInstance.put<{ success: boolean; trip: Trip }>(
      `/trips/${tripId}`,
      updates
    );
    return response.data.trip;
  }

  async deleteTrip(tripId: string): Promise<void> {
    await axiosInstance.delete<{ success: boolean }>(`/trips/${tripId}`);
  }

  async addTip(tripId: string, tipData: TipData): Promise<Trip> {
    const response = await axiosInstance.post<{ success: boolean; trip: Trip }>(
      `/trips/${tripId}/tips`,
      tipData
    );
    return response.data.trip;
  }
}

export const tripService = new TripService(); 