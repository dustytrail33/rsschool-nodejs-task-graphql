import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Context } from '../schemas.js';
import { MemberTypeId } from '../../member-types/schemas.js';

export const userInterfaceType: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: 'UserInterface',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
    },
    userSubscribedTo: {
      type: new GraphQLList(userInterfaceType),
    },
    subscribedToUser: {
      type: new GraphQLList(userInterfaceType),
    },
    posts: {
      type: new GraphQLList(postType),
    },
  }),
  resolveType: () => userType.name,
});

export const userType = new GraphQLObjectType({
  name: 'User',
  interfaces: [userInterfaceType],
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      resolve: (_source: { id: string }, args, { resolvers }: Context) =>
        resolvers.profileByUserId.load(_source.id),
    },
    userSubscribedTo: {
      type: new GraphQLList(userInterfaceType),
      resolve: (_source: { id: string }, args, { resolvers }: Context) =>
        resolvers.userSubscribedTo.load(_source.id),
    },
    subscribedToUser: {
      type: new GraphQLList(userInterfaceType),
      resolve: (_source: { id: string }, args, { resolvers }: Context) =>
        resolvers.subscribedToUser.load(_source.id),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (_source: { id: string }, args, { resolvers }: Context) =>
        resolvers.postsByAuthorId.load(_source.id),
    },
  }),
});

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: memberType,
      resolve: (_source: { memberTypeId: MemberTypeId }, args, { resolvers }: Context) =>
        resolvers.memberTypeById.load(_source.memberTypeId),
    },
  }),
});

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: GraphQLString },
  }),
});

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {
      value: 'BASIC',
    },
    BUSINESS: {
      value: 'BUSINESS',
    },
  },
});

export const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: memberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});
