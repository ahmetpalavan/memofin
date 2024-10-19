import { Prisma } from '@prisma/client';

export const pollDetails = Prisma.validator<Prisma.PollDefaultArgs>()({
  include: {
    event: {
      select: {
        id: true,
        slug: true,
        ownerId: true,
      },
    },
    options: {
      select: {
        id: true,
        index: true,
        body: true,
        votes: true,
      },
    },
  },
});

export type PollDetails = Prisma.PollGetPayload<typeof pollDetails>;
