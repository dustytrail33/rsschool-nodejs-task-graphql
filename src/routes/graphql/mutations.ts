import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from './schemas.js';
import { postType, userType } from './types/queriesTypes.js';
import {
  changePostType,
  changeUserType,
  createPostType,
  createUserType,
  PostData,
  UserData,
} from './types/mutationTypes.js';
import { UUIDType } from './types/uuid.js';

export const mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        dto: {
          type: new GraphQLNonNull(createUserType),
        },
      },
      resolve: (_source, { data }: { data: UserData }, { prismaClient }: Context) =>
        prismaClient.user.create({
          data,
        }),
    },
    changeUser: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(changeUserType),
        },
      },
      resolve: (
        _source,
        { id, data }: { id: string; data: UserData },
        { prismaClient }: Context,
      ) =>
        prismaClient.user.update({
          where: { id },
          data,
        }),
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id }: { id: string }, { prismaClient }: Context) =>
        !!(await prismaClient.user.delete({
          where: {
            id,
          },
        })),
    },
    createPost: {
      type: postType,
      args: {
        dto: {
          type: new GraphQLNonNull(createPostType),
        },
      },
      resolve: (_source, { data }: { data: PostData }, { prismaClient }: Context) =>
        prismaClient.post.create({
          data,
        }),
    },
    changePost: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(changePostType),
        },
      },
      resolve: (
        _source,
        { id, data }: { id: string; data: PostData },
        { prismaClient }: Context,
      ) =>
        prismaClient.post.update({
          where: { id },
          data,
        }),
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id }: { id: string }, { prismaClient }: Context) =>
        !!(await prismaClient.post.delete({
          where: {
            id,
          },
        })),
    },
  }),
});
