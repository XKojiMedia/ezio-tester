import axios from 'axios';
import { gql } from 'apollo-server-express';

export const typeDef = gql`
  extend type Query {
    HNUser(username: String): HNUser
  }
  type HNUser {
    id: String
    karma: Int
    bio: String
  }
`;

export const resolvers = {
  Query: {
    HNUser: (root: any, { username = 'imolorhe' }) =>
      axios.get(`https://hacker-news.firebaseio.com/v0/user/${username}.json?print=pretty`)
      .then(res => res.data)
      .then(data => {
        data.bio = data.about;
        return data;
      }),
  }
};
