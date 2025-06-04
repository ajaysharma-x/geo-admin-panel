import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/authMiddleware';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const GET = requireRole(['user'], async (_req, { userId }) => {
  await dbConnect();

  const user = await User.findById(userId).select('loginHistory');
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user.loginHistory);
});
