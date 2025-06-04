// /lib/middleware/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '../auth';

export function requireRole(
  allowedRoles: string[],
  handler: (req: NextRequest, payload: { userId: string; role: string }) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const token = req.cookies.get('accessToken')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
      }

      const payload = verifyAccessToken(token); // Throws error if invalid
      if (!allowedRoles.includes(payload.role)) {
        return NextResponse.json({ error: 'Forbidden: Invalid role' }, { status: 403 });
      }

      return await handler(req, { userId: payload.userId, role: payload.role });
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  };
}
