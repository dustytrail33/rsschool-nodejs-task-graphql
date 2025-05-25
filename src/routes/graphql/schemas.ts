import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { queries } from './queries.js';

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
    postById: DataLoader<string, unknown>;
    postsByAuthorId: DataLoader<string, unknown>;
    userSubscribedTo: DataLoader<string, unknown>;
    subscribedToUser: DataLoader<string, unknown>;
    memberTypeById: DataLoader<string, unknown>;
  };
};

export const gqlSchema = new GraphQLSchema({
  query: queries,
});
