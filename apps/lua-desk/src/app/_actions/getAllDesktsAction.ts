'use server';

import { db } from 'apps/lua-desk/db';

export default async function getAllDesksAction() {
  const users = await db.desk.findMany();
  return users;
}
