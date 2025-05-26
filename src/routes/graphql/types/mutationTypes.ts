import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from 'graphql';

export const createUserType = new GraphQLInputObjectType({
  name: 'CreateUserType',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const changeUserType = new GraphQLInputObjectType({
  name: 'ChangeUserType',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export type UserData = {
  name: string;
  balance: number;
};



export const createPostType = new GraphQLInputObjectType({
  name: 'CreatePostType',
  fields: () => ({
      title: { type: GraphQLString },
  content: { type: GraphQLString },
  authorId: { type: GraphQLString },
  }),
});

export const changePostType = new GraphQLInputObjectType({
  name: 'ChangePostType',
  fields: () => ({
      title: { type: GraphQLString },
  content: { type: GraphQLString },
  authorId: { type: GraphQLString },
  }),
});

export type PostData = {
  title: string;
  content: string;
  authorId: string;
};