import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';

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
      type: userType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
        loaders.userById.load(id),
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: (_source, args, { prisma }: Context) => prisma.profile.findMany(),
    },
    profile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
        loaders.profileById.load(id),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (_source, args, { prisma }: Context) => prisma.post.findMany(),
    },
    post: {
      type: postType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
        loaders.postById.load(id),
    },
    memberTypes: {
      type: new GraphQLList(memberType),
      resolve: (_source, args, { prisma }: Context) => prisma.memberType.findMany(),
    },
    memberType: {
      type: memberType,
      args: {
        id: {
          type: new GraphQLNonNull(memberTypeId),
        },
      },
      resolve: (_source, { id }: { id: MemberTypeId }, { loaders }: Context) =>
        loaders.memberTypeById.load(id),
    },
  }),
});
