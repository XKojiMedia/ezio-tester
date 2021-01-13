import http from 'http';
import express, { RequestHandler } from 'express';
import { ApolloServer, ApolloError } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
const compression = require('compression');
const cors = require('cors');

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
app.use(cors());
app.use((req, res, next) => {
    // console.log(req.headers);
    return next();
});
// app.use(graphqlEventStream());

server.applyMiddleware({ app, path: '/graphql' });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
app.all('/test', (req, res) => {
    // console.log(req.headers);
    res.send('');
});
const PORT = process.env.__PORT__ || 5400;
httpServer.listen(PORT, () => {
  // tslint:disable-next-line
  console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  // tslint:disable-next-line
  console.log(`Subscription running at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
