import { travelApiService } from '../../services/travelApi.service';

export const travelResolvers = {
  Query: {
    searchFlights: async (_: any, { input }: { input: any }) => {
      try {
        const flights = await travelApiService.searchFlights(input);
        return flights;
      } catch (error) {
        console.error('Error in searchFlights resolver:', error);
        throw new Error('Failed to search flights');
      }
    },

    searchHotels: async (_: any, { input }: { input: any }) => {
      try {
        const hotels = await travelApiService.searchHotels(input);
        return hotels;
      } catch (error) {
        console.error('Error in searchHotels resolver:', error);
        throw new Error('Failed to search hotels');
      }
    },

    getWeatherForecast: async (_: any, { input }: { input: any }) => {
      try {
        const forecast = await travelApiService.getWeatherForecast(input);
        return forecast;
      } catch (error) {
        console.error('Error in getWeatherForecast resolver:', error);
        throw new Error('Failed to get weather forecast');
      }
    },
  },
}; 