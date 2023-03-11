import http from "http";
import express, { Request, RequestHandler } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createHandler } from "graphql-sse";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { typeDefs, resolvers } from "./schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
import bodyParser from "body-parser";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface MyServerContext {
  req: Request;
}

const main = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app = express();
  app.use(compression());
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(async (req, res, next) => {
    console.log(req.headers);
    console.log(req.cookies);
    res.set("x-auth", "text/plain");
    // await delay(5000);
    return next();
  });
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  const wsServerCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer<MyServerContext>({
    schema,
    plugins: [
      // Proper shutdown for HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for websocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await wsServerCleanup.dispose();
            },
          };
        },
      },
    ],

    formatError(error) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        // logging the errors can help in development
        // tslint:disable-next-line
        console.log(error);
      }
      return error;
    },
    // tracing: true,
  });
  await server.start();

  app.all(
    "/graphql",
    expressMiddleware(server, {
      async context({ req }) {
        // throw new ApolloError('NOT_FOUND', '404');
        return { req };
      },
    })
  );
  app.all("/test", (req, res) => {
    // console.log(req.headers);
    res.send("");
  });
  const sseHandler = createHandler({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
  });
  app.all("/graphql/sse", sseHandler);
  const PORT = process.env.__PORT__ || 5400;
  httpServer.listen(PORT, () => {
    // tslint:disable-next-line
    console.log(`Server running at http://localhost:${PORT}/graphql`);
    // tslint:disable-next-line
    console.log(`Subscription running at ws://localhost:${PORT}/graphql`);
  });
};
main();
