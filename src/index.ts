import http from 'http';
import express from 'express';
import compression from 'compression';
import { ApolloServer, ApolloError } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { graphqlEventStream } from './schema-observer';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ req }) {
    // throw new ApolloError('NOT_FOUND', '404');
    return { req };
  },
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
app.use(compression());
app.use((req, res, next) => {
    // console.log(req.headers);
    return next();
});
app.use(graphqlEventStream());
server.applyMiddleware({ app, path: '/graphql' });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
app.all('/test', (req, res) => {
    // console.log(req.headers);
    res.send('Hi');
});
const PORT = process.env.__PORT__ || 5400;
httpServer.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  // tslint:disable-next-line
  console.log(`Subscription running at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
