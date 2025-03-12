import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { config } from './config';
import { schema } from './graphql/schema';

async function startServer() {
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

  // Apply middleware
  app.use('/graphql', expressMiddleware(server));

  // Start Express server
  app.listen(config.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${config.PORT}/graphql`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
}); 