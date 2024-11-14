import { User } from '@prisma/client';

export type JsonApiResponse = {
  success: boolean;
  data?: [] | {} | string;
  error?: string;
};

export type AuthLocals = {
  user: User;
};
export type GuestLocals = {
  user: User | null;
};
