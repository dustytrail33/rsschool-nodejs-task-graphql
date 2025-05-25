import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { resolvers } from './resolvers.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {
      const validationRules = [depthLimit(5)];
      const validationErrors = validate(
        gqlSchema,
        parse(req.body.query),
        validationRules,
      );

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }
      return graphql({
        schema: gqlSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma, resolvers: resolvers(prisma) },
      });
    },
  });
};

export default plugin;
