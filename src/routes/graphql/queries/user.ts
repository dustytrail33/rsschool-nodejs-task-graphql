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

const userInterface: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'UserInterface',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
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
  }),
});

export const userQueries = {
  users: {
    type: new GraphQLList(user),
    resolve: async (
      _source,
      args,
      { prisma, loaders }: Context,
      info: GraphQLResolveInfo,
    ) => {
      const requestedFields = info.fieldNodes
        .filter((fieldNode) => !!fieldNode.selectionSet)
        .map((fieldNode) => {
          return fieldNode
            .selectionSet!.selections.map((selection) =>
              selection.kind === Kind.FIELD ? selection.name.value : null,
            )
            .filter((selection) => selection !== null);
        });

      const subscribedToUser = requestedFields[0].includes('subscribedToUser');
      const userSubscribedTo = requestedFields[0].includes('userSubscribedTo');

      const users = await prisma.user.findMany({
        include: { subscribedToUser, userSubscribedTo },
      });

      return users;
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
