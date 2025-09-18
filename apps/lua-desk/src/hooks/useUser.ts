'use server';

import { auth } from 'apps/lua-desk/auth';
import { redirect } from 'next/navigation';

export const useUser = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return session?.user;
};
