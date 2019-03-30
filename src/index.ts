import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError(error) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      // logging the errors can help in development
      // tslint:disable-next-line
      console.log(error);
    }
    return error;
  }
});
const app = express();
server.applyMiddleware({ app });

const PORT = process.env.__PORT__ || 5400;
app.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
});
