import { gql } from 'apollo-server-express';
import { merge } from 'lodash';

import * as GOTCharacter from './GOTCharacter';
import * as GOTBook from './GOTBook';
import * as GOTHouse from './GOTHouse';
import * as HNUser from './HNUser';
import * as Message from './Message';
import * as File from './File';

const rootTypeDef = gql`
  type Query {
    hello: String
  }
  type Mutation
  type Subscription
`;
const rootResolvers = {
  Query: {
    hello: () => 'Hello world',
  }
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
  File.resolvers,
);
