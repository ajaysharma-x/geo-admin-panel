import { cookies } from 'next/headers';
import { verifyAccessToken } from './auth';

export async function getUserFromToken() {
  const cookieStore = await cookies();  // await here
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    return verifyAccessToken(token) as { userId: string; role: string };
  } catch {
    return null;
  }
}
