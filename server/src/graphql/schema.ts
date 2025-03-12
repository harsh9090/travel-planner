import { makeExecutableSchema } from '@graphql-tools/schema';
import { travelTypes } from './types/travel.types';
import { travelResolvers } from './resolvers/travel.resolvers';

// Combine all type definitions
const typeDefs = [
  travelTypes,
  // Add other type definitions here
];

// Combine all resolvers
const resolvers = {
  Query: {
    ...travelResolvers.Query,
    // Add other query resolvers here
  },
  // Add other resolver types here
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
}); 