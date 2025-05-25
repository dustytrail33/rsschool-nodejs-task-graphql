import {
  GraphQLFloat,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
  Kind,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Context } from '../schemas.js';
import { profile } from './profile.js';

const userInterface: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'UserInterface',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profile,
    },
  }),
  resolveType: () => user.name,
});

export const user = new GraphQLObjectType({
  name: 'User',
  interfaces: [userInterface],
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profile,
      resolve: (_source: { id: string }, args, { loaders }: Context) =>
        loaders.profileByUserId.load(_source.id),
    },
  }),
});

export const userQueries = {
  users: {
    type: new GraphQLList(user),
    resolve: async (_source, _args, { prisma }: Context) => {
      return prisma.user.findMany({
        include: {
          subscribedToUser: true,
          userSubscribedTo: true,
        },
      });
    },
  },
  user: {
    type: user,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
      loaders.userById.load(id),
  },
};
