import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '../../db';
import { accounts, sessions, users, verificationTokens } from './schema';

export const DRIZZLE_ADAPTER = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});
