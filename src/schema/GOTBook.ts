import axios from 'axios';
import { gql } from 'apollo-server-express';

export const typeDef = gql`
  extend type Query {
    GOTBooks(
      name: String
    ): [GOTBook]
  }

  """
  A Game of Thrones Book

  ### Real books

  - First item
  - Second item
  - Third item
  - Fourth item
  """
  type GOTBook {
    id: Int!
    url: String
    name: String
    authors: [String]
    characters: [GOTCharacter]
    released: String
  }
`;

export const resolvers = {
  Query: {
    GOTBooks: (root: any, args: any) =>
      axios.get(`https://www.anapioficeandfire.com/api/books`, { params: args })
        .then(res => res.data)
  },
  GOTBook: {
    id(root: any) {
      return root.url.match(/\d+/g).pop();
    },
    characters(root: any) {
      if (root.characters && root.characters.length) {
        return Promise.all(
          root.characters
            // Limit to the first 5 characters. Don't overload the API!
            .filter((_: any, i: number) => i < 5)
            .map(axios.get)
        )
        .then((charactersRes) => {
          return charactersRes.map((characterRes: any) => characterRes.data);
        });
      }
      return null;
    },
  }
};
