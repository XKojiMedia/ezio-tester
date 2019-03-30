import { gql } from 'apollo-server-express';

const fileRepository = [];

const fakePath = (filename = '') => `x/y/z/${filename}`;

const processUpload = async (file: any) => {
  const { createReadStream, filename, mimetype, encoding } = await file;

  const stream = createReadStream();
  const fileMetadata = {
    filename,
    mimetype,
    encoding,
    filepath: fakePath(filename)
  };

  fileRepository.push(fileMetadata);
  return fileMetadata;
};

export const typeDef = gql`
  extend type Query {
    files: [File]
  }

  extend type Mutation {
    singleUpload(file: Upload!): File
    multipleUploads(files: [Upload!]!): [File]
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    filepath: String!
  }
`;

export const resolvers = {
  Mutation: {
    async singleUpload(root: any, { file }: { file: any }) {
      return processUpload(file);
    },
    async multipleUploads(root: any, { files }: { files: any[] }) {
      return await Promise.all(files.map(processUpload));
    }
  }
};
