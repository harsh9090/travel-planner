import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config';
import { schema } from './graphql/schema';
import authRoutes from './routes/authRoutes';

async function startServer() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...', config.MONGODB_URI);
    await mongoose.connect(config.MONGODB_URI);
    console.log('📦 Connected to MongoDB successfully');
    console.log('🗄️  Database:', mongoose.connection.name);
    console.log('🔌 Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');

    const app = express();
    
    // Create Apollo Server
    const server = new ApolloServer({
      schema
    });

    // Start Apollo Server
    await server.start();

    // Enable CORS and JSON parsing
    app.use(cors());
    app.use(express.json());

    // Mount API routes
    app.use('/api/auth', authRoutes);

    // Apply GraphQL middleware
    app.use('/graphql', expressMiddleware(server));

    // Start Express server
    app.listen(config.PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${config.PORT}/graphql`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}

startServer(); 