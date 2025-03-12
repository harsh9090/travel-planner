import axios from 'axios';
import { config } from '../config';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  maxPrice?: number;
}

export interface HotelSearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  maxPrice?: number;
}

export interface WeatherParams {
  city: string;
  country: string;
}

class TravelApiService {
  private readonly skyscannerApiKey: string;
  private readonly openWeatherApiKey: string;
  private readonly rapidApiKey: string;

  constructor() {
    this.skyscannerApiKey = config.SKYSCANNER_API_KEY;
    this.openWeatherApiKey = config.OPENWEATHER_API_KEY;
    this.rapidApiKey = config.RAPID_API_KEY;
  }

  async searchFlights(params: FlightSearchParams) {
    try {
      const response = await axios.get('https://skyscanner-api.p.rapidapi.com/v3/flights/live/search', {
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'skyscanner-api.p.rapidapi.com'
        },
        params: {
          origin: params.origin,
          destination: params.destination,
          date: params.departureDate,
          adults: params.adults,
          currency: 'USD'
        }
      });

      return response.data.data.map((flight: any) => ({
        id: flight.id,
        airline: flight.airline.name,
        price: flight.price.amount,
        departure: {
          time: flight.departure.time,
          airport: flight.departure.airport.name
        },
        arrival: {
          time: flight.arrival.time,
          airport: flight.arrival.airport.name
        },
        duration: flight.duration,
        stops: flight.stops
      }));
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw new Error('Failed to fetch flight data');
    }
  }

  async searchHotels(params: HotelSearchParams) {
    try {
      const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/search', {
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        },
        params: {
          location: params.location,
          checkin: params.checkIn,
          checkout: params.checkOut,
          adults: params.guests,
          room_number: '1',
          currency: 'USD'
        }
      });

      return response.data.result.map((hotel: any) => ({
        id: hotel.hotel_id,
        name: hotel.hotel_name,
        rating: hotel.review_score,
        price: hotel.price_breakdown.gross_price,
        address: hotel.address,
        thumbnail: hotel.main_photo_url,
        amenities: hotel.facilities,
        latitude: hotel.latitude,
        longitude: hotel.longitude
      }));
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw new Error('Failed to fetch hotel data');
    }
  }

  async getWeatherForecast(params: WeatherParams) {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          q: `${params.city},${params.country}`,
          appid: this.openWeatherApiKey,
          units: 'metric'
        }
      });

      return response.data.list.map((forecast: any) => ({
        date: forecast.dt_txt,
        temperature: forecast.main.temp,
        feelsLike: forecast.main.feels_like,
        humidity: forecast.main.humidity,
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon
      }));
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}

export const travelApiService = new TravelApiService(); 