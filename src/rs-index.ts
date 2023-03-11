// import http from 'http';
// import { EventEmitter } from 'events';
// import express, { RequestHandler, Express } from 'express';
// import { ApolloServer } from '@apollo/server';
// import { graphqlEventStream } from './schema-observer';
// import { execute } from 'graphql';
// import { makeExecutableSchema } from '@graphql-tools/schema';
// import { createWatcher } from './watcher';

// const compression = require('compression');
// const cors = require('cors');

// const getSchema = () => {
//   // First clear require cache for the module
//   delete require.cache[require.resolve('./schema/rs-schema')];
//   const { typeDefs, resolvers } = require('./schema/rs-schema');
//   return makeExecutableSchema({
//     typeDefs,
//     resolvers,
//   })
// };

// const setupServer = async() => {
//   const watcher = createWatcher();
//   const emitter = new EventEmitter();

//   const server = new ApolloServer({
//     subscriptions: false,
//     gateway: {
//       load: async() => {
//         const schema = getSchema();
//         return {
//           schema,
//           executor: args => {
//             return execute({
//               ...args,
//               schema,
//             })
//           }
//         }
//       },
//       executor: execute,
//       onSchemaChange: cb => {
//         watcher.on('all', () => {
//           console.log('updating schema..');
//           const schema = getSchema();
//           cb(schema);
//           emitter.emit('schema:updated', schema);
//         });

//         return () => watcher.close();
//       },
//     },
//     context({ req }) {
//       // throw new ApolloError('NOT_FOUND', '404');
//       return { req };
//     },
//     formatError(error) {
//       if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
//         // logging the errors can help in development
//         // tslint:disable-next-line
//         console.log(error);
//       }
//       return error;
//     }
//   });
//   const app = express();

//   // Compression doesn't work well with server side events
//   // app.use(compression());
//   app.use(cors());
//   app.use((req, res, next) => {
//       // console.log(req.headers);
//       return next();
//   });
//   graphqlEventStream({
//     app,
//     emitter,
//     streamPath: '/stream',
//   });
//   server.applyMiddleware({ app, path: '/graphql' });
//   const httpServer = http.createServer(app);
//   // subscriptions are not supported in apollo gateway
//   // server.installSubscriptionHandlers(httpServer);

//   app.all('/test', (req, res) => {
//       // console.log(req.headers);
//       res.send('');
//   });
//   const PORT = process.env.__PORT__ || 5400;
//   httpServer.listen(PORT, () => {
//     // tslint:disable-next-line
//     console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
//     // tslint:disable-next-line
//     // console.log(`Subscription running at ws://localhost:${PORT}${server.subscriptionsPath}`);
//   });
// };

// setupServer();
