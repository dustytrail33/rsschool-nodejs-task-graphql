import { Type } from '@fastify/type-provider-typebox';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { userQueries } from './queries/user.js';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { profileQueries } from './queries/profile.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export type Context = {
  prisma: PrismaClient;
  loaders: {
    userById: DataLoader<string, unknown>;
    profileByUserId: DataLoader<string, unknown>;
    profileById: DataLoader<string, unknown>;
  };
};

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...userQueries,
    ...profileQueries,
  }),
});

export const gqlSchema = new GraphQLSchema({
  query,
});
