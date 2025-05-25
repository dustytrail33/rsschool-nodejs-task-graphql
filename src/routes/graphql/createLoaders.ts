import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export function createLoaders(prisma: PrismaClient) {
  const userById = new DataLoader(async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: {
        id: { in: [...ids] },
      },
    });
    console.log( '222222',  ids, users)
    const sortedInOriginalOrder = ids.map((id) => users.find((user) => user.id === id));
    return sortedInOriginalOrder;
  });

  return {
    userById,
  };
}
