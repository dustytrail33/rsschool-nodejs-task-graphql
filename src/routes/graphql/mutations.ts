import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from './schemas.js';
import { postType, profileType, userType } from './types/queriesTypes.js';
import {
  changePostType,
  changeProfileType,
  changeUserType,
  createPostType,
  createProfileType,
  createUserType,
  PostData,
  ProfileData,
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
      resolve: (_source, { dto }: { dto: UserData }, { prismaClient }: Context) =>
        prismaClient.user.create({
          data: dto,
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
        { id, dto }: { id: string; dto: UserData },
        { prismaClient }: Context,
      ) =>
        prismaClient.user.update({
          where: { id },
          data: dto,
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
      resolve: (_source, { dto }: { dto: PostData }, { prismaClient }: Context) =>
        prismaClient.post.create({
          data: dto,
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
        { id, dto }: { id: string; dto: PostData },
        { prismaClient }: Context,
      ) =>
        prismaClient.post.update({
          where: { id },
          data: dto,
        }),
    },
    createProfile: {
      type: profileType,
      args: {
        dto: {
          type: new GraphQLNonNull(createProfileType),
        },
      },
      resolve: (_source, { dto }: { dto: ProfileData }, { prismaClient }: Context) =>
        prismaClient.profile.create({
          data: dto,
        }),
    },
    changeProfile: {
      type: profileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(changeProfileType),
        },
      },
      resolve: (
        _source,
        { id, dto }: { id: string; dto: ProfileData },
        { prismaClient }: Context,
      ) =>
        prismaClient.profile.update({
          where: { id },
          data: dto,
        }),
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_source, { id }: { id: string }, { prismaClient }: Context) =>
        !!(await prismaClient.profile.delete({
          where: {
            id,
          },
        })),
    },
    subscribeTo: {
      type: GraphQLBoolean,
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        { userId, authorId }: { userId: string; authorId: string },
        { prismaClient }: Context,
      ) =>
        !!(await prismaClient.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        })),
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (
        _source,
        { userId, authorId }: { userId: string; authorId: string },
        { prismaClient }: Context,
      ) =>
        !!(await prismaClient.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        })),
    },
  }),
});
