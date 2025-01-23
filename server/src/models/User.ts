import { User as UserType } from '@prisma/client';
import { db } from '../db/db';

async function findByEmail(email: string): Promise<UserType | null> {
  return await db.user.findUnique({ where: { email } });
}

async function checkExists({
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

export const User = { findByEmail, checkExists };
