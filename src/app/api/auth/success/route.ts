import { faker } from '@faker-js/faker';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';
import colors from 'tailwindcss/colors';
import routes, { BASE_URL } from '~/config/routes';
import { prisma } from '~/lib/prisma/client';

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new Error('User not found' + user);
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.username ?? user.given_name ?? faker.internet.userName(),
        email: user.email ?? faker.internet.email(),
        color: faker.helpers.arrayElement([
          colors.emerald['500'],
          colors.fuchsia['500'],
          colors.indigo['500'],
          colors.lime['500'],
          colors.orange['500'],
          colors.pink['500'],
          colors.green['500'],
          colors.purple['500'],
          colors.red['500'],
          colors.teal['500'],
          colors.yellow['500'],
        ]),
      },
    });
  }

  return NextResponse.redirect(`${BASE_URL}${routes.dashboard}`);
}
