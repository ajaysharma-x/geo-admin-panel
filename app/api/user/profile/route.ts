import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/authMiddleware';

export const GET = requireRole(['user', 'admin'], async (req, { userId, role }) => {
  await dbConnect();
  const user = await User.findById(userId, '-password');
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json(user);
});
