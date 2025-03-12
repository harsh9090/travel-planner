import { gql } from 'apollo-server-express';

export const travelTypes = gql`
  type Flight {
    id: ID!
    airline: String!
    price: Float!
    departure: FlightTime!
    arrival: FlightTime!
    duration: String!
    stops: Int!
  }

  type FlightTime {
    time: String!
    airport: String!
  }

  type Hotel {
    id: ID!
    name: String!
    rating: Float
    price: Float!
    address: String!
    thumbnail: String
    amenities: [String!]
    latitude: Float!
    longitude: Float!
  }

  type WeatherForecast {
    date: String!
    temperature: Float!
    feelsLike: Float!
    humidity: Int!
    description: String!
    icon: String!
  }

  input FlightSearchInput {
    origin: String!
    destination: String!
    departureDate: String!
    returnDate: String
    adults: Int!
    maxPrice: Float
  }

  input HotelSearchInput {
    location: String!
    checkIn: String!
    checkOut: String!
    guests: Int!
    maxPrice: Float
  }

  input WeatherInput {
    city: String!
    country: String!
  }

  type Query {
    searchFlights(input: FlightSearchInput!): [Flight!]!
    searchHotels(input: HotelSearchInput!): [Hotel!]!
    getWeatherForecast(input: WeatherInput!): [WeatherForecast!]!
  }
`; 