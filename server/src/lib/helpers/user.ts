import { User } from '@prisma/client';
import { db } from '../../db/db';

export async function findUserByEmail(email: string): Promise<User | null> {
  return await db.user.findUnique({ where: { email } });
}

export async function userExists({
  email,
  id,
  username,
}: {
  email?: string;
  id?: string;
  username?: string;
}): Promise<boolean> {
  if (email) {
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      return true;
    }
  }

  if (id) {
    const user = await db.user.findUnique({ where: { id } });

    if (user) {
      return true;
    }
  }

  if (username) {
    const user = await db.user.findUnique({
      where: { username: username.replace(/[^\w\s_\-]/g, '') },
    });

    if (user) {
      return true;
    }
  }

  return false;
}

export async function createUser({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}): Promise<User> {
  return await db.user.create({
    data: {
      email,
      username,
      password,
      isVerified: false,
    },
  });
}
