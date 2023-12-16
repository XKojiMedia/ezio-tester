import { merge } from "lodash";
// @ts-ignore
import GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import * as GOTCharacter from "./GOTCharacter";
import * as GOTBook from "./GOTBook";
import * as GOTHouse from "./GOTHouse";
import * as HNUser from "./HNUser";
import * as Message from "./Message";
import * as File from "./File";

const rootTypeDef = `#graphql
  scalar Upload
  enum Episode {
    NEWHOPE
    EMPIRE
    JEDI @deprecated(reason: "We do not talk about this one")
  }
  type Query {
    hello: String
    bye: Boolean @deprecated(reason: "We do not say bye")
    randomEpisode: Episode
  }
  type Mutation
  type Subscription {
    greetingsSSE: String
  }
`;

const rootResolvers = {
  Upload: GraphQLUpload,
  Query: {
    hello: () => "Hello world",
    bye: () => true,
    randomEpisode: () => {
      const episodes = ["NEWHOPE", "EMPIRE", "JEDI"];
      return episodes[Math.floor(Math.random() * episodes.length)];
    },
  },
  Subscription: {
    greetingsSSE: {
      subscribe: async function* () {
        for (const hi of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
          yield { greetings: hi };
        }
      },
    },
  },
};

export const typeDefs = [
  rootTypeDef,
  GOTCharacter.typeDef,
  GOTBook.typeDef,
  GOTHouse.typeDef,
  HNUser.typeDef,
  Message.typeDef,
  File.typeDef,
];

export const resolvers = merge(
  rootResolvers,
  GOTCharacter.resolvers,
  GOTBook.resolvers,
  GOTHouse.resolvers,
  HNUser.resolvers,
  Message.resolvers,
  File.resolvers
);
