import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  SKYSCANNER_API_KEY: string;
  OPENWEATHER_API_KEY: string;
  RAPID_API_KEY: string;
}

export const config: Config = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-planner',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  SKYSCANNER_API_KEY: process.env.SKYSCANNER_API_KEY || '',
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
  RAPID_API_KEY: process.env.RAPID_API_KEY || ''
}; 