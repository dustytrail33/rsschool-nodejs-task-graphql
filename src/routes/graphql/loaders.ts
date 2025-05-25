import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export function loaders(prisma: PrismaClient) {
  const userById = new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: { in: [...ids] },
      },
    });
    const sortedInOriginalOrder = ids.map((id) => users.find((user) => user.id === id));
    return sortedInOriginalOrder;
  });

  const profileByUserId = new DataLoader(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: { in: [...userIds] },
      },
    });
    const sortedInOriginalOrder = userIds.map((userId) =>
      profiles.find((profile) => profile.userId === userId),
    );
    return sortedInOriginalOrder;
  });

  const profileById = new DataLoader(async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: {
        id: { in: [...ids] },
      },
    });
    const sortedInOriginalOrder = ids.map((id) =>
      profiles.find((profile) => profile.id === id),
    );
    return sortedInOriginalOrder;
  });

  return {
    userById,
    profileByUserId,
    profileById,
  };
}
