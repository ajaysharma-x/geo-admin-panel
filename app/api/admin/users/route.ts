import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/authMiddleware';

export const GET = requireRole(['admin'], async (req: NextRequest) => {
  await dbConnect();
  const users = await User.find({}, '-password'); // Exclude password
  return NextResponse.json(users);
});
