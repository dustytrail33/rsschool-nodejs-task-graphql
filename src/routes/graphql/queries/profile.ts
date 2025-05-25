import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
// import { MemberTypeId } from '../../member-types/schemas.js';
import { UUIDType } from '../types/uuid.js';
// import { memberType } from './memberTypeQueries.js';
import { Context } from '../schemas.js';

export const profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    // memberType: {
    //   type: memberType,
    //   resolve: (_source: { memberTypeId: MemberTypeId }, args, { loaders }: Context) =>
    //     loaders.memberTypeById.load(_source.memberTypeId),
    // },
  }),
});

export const profileQueries = {
  profiles: {
    type: new GraphQLList(profile),
    resolve: (_source, args, { prisma }: Context) => prisma.profile.findMany(),
  },
  profile: {
    type: profile,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: (_source, { id }: { id: string }, { loaders }: Context) =>
      loaders.profileById.load(id),
  },
};
