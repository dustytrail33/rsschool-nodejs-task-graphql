import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  Kind,
} from 'graphql';

import {
  memberType,
  memberTypeId,
  postType,
  profileType,
  userType,
} from './types/queriesTypes.js';
import { Context } from './schemas.js';
import { UUIDType } from './types/uuid.js';
import { MemberTypeId } from '../member-types/schemas.js';

export const queries = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      resolve: async (
        _source,
        _args,
        { prismaClient, resolvers }: Context,
        info: GraphQLResolveInfo,
      ) => {
        // return prismaClient.user.findMany();
        const selections = info.fieldNodes
          .filter((fieldNode) => !!fieldNode.selectionSet)
          .map((fieldNode) => {
            return fieldNode
              .selectionSet!.selections.map((selection) =>
                selection.kind === Kind.FIELD ? selection.name.value : null,
              )
              .filter((selection) => selection !== null);
          });

        const include = {
          subscribedToUser: selections[0].includes('subscribedToUser'),
          userSubscribedTo: selections[0].includes('userSubscribedTo'),
        };

        const users = await prismaClient.user.findMany({ include });

        const userMap = new Map(users.map((user) => [user.id, user]));

        users.forEach((user) => {
          if (include.subscribedToUser) {
            const subscribers = user.subscribedToUser.map((s) =>
              userMap.get(s.subscriberId),
            );
            resolvers.subscribedToUser.prime(user.id, subscribers);
          }

          if (include.userSubscribedTo) {
            const authors = user.userSubscribedTo.map((s) => userMap.get(s.authorId));
            resolvers.userSubscribedTo.prime(user.id, authors);
          }
        });

        return users;
      },
    },
    user: {
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id }: { id: string }, { resolvers }: Context) => {
        return resolvers.userById.load(id);
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: (_source, args, { prismaClient }: Context) =>
        prismaClient.profile.findMany(),
    },
    profile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id }: { id: string }, { resolvers }: Context) => {
        return resolvers.profileById.load(id);
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (_source, args, { prismaClient }: Context) => prismaClient.post.findMany(),
    },
    post: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id }: { id: string }, { resolvers }: Context) => {
        return resolvers.postById.load(id);
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: (_source, args, { prismaClient }: Context) =>
        prismaClient.memberType.findMany(),
    },
    memberType: {
      type: memberType,
      args: {
        id: {
          type: new GraphQLNonNull(memberTypeId),
        },
      },
      resolve: async (_source, { id }: { id: MemberTypeId }, { resolvers }: Context) => {
        return resolvers.memberTypeById.load(id);
      },
    },
  }),
});
