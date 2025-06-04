import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/authMiddleware';

export const GET = requireRole(['admin'], async () => {
  await dbConnect();

  const users = await User.find({}, '-password'); // Exclude password from response
  return NextResponse.json(users);
});
