import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { v4 as uuid } from 'uuid';
import { db } from './db';
import bcrypt from 'bcryptjs';
import { encode as defaultEncode } from 'next-auth/jwt';
import { DRIZZLE_ADAPTER } from './src/db/adapter';
import { eq } from 'drizzle-orm';
import { users } from './src/db';

const adapter = DRIZZLE_ADAPTER;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  jwt: {
    encode: async function (params) {
      console.log('jwt encode', params);
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error('No user ID found in token');
        }
        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
        if (!createdSession) {
          throw new Error('Failed to create session');
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'credentials') {
        token.credentials = true;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? 'super-secret-key',
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password' },
      },
      async authorize(credentials) {
        const password = credentials?.password ?? "";
        const email = credentials?.username ?? '';
        if (!email || !password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials?.username as string),
        });

        if (!user) {
          return null;
        }
        const userPassword = String(user.password);
        const credentialsPassword = String(credentials.password);
        const ok = await bcrypt.compare(credentialsPassword, userPassword);
        console.log("OKKKK ", ok);
        if (!ok) {
          return null;
        }
        return user;
      },
    }),
  ],
});
