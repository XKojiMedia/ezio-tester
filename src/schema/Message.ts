import { gql } from 'apollo-server-express';
import { PubSub } from 'apollo-server-express';

const messageRepository = [];

export const typeDef = gql`
  extend type Mutation {
    addMessage(content: String): Message
  }
  extend type Subscription {
    messageAdded: Message
  }

  type Message {
    id: Int!
    content: String
    author: String
  }
`;

const pubsub = new PubSub();
export const resolvers = {
  Mutation: {
    addMessage(root: any, { content = '' }, { req }: { req: any }) {
      const message = {
        id: messageRepository.length + 1,
        content,
        author: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      };
      messageRepository.push(message);
      pubsub.publish('MESSAGE_ADDED', { messageAdded: message });

      return message;
    }
  },
  Subscription: {
    messageAdded: {
      subscribe() {
        return pubsub.asyncIterator('MESSAGE_ADDED');
      }
    }
  }
};
