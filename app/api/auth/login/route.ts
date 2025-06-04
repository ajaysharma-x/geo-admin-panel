import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '@/lib/auth';  // <-- updated auth helpers
import { isRateLimited, resetRateLimit } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
    try {
        // Get IP address from request
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip =
            req.headers.get('x-vercel-forwarded-for') ||
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') ||
            'Unknown';

        if (isRateLimited(ip)) {
            return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
        }

        const { email, password } = await req.json();
        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        resetRateLimit(ip);

        // Fetch location from ipapi.co
        let city = 'Unknown', country = 'Unknown';
        try {
            const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
            const geoData = await geoRes.json();
            city = geoData.city || 'Unknown';
            country = geoData.country_name || 'Unknown';
        } catch (geoErr) {
            console.error('Geolocation fetch error:', geoErr);
        }

        // Add login history
        user.loginHistory.push({
            ip,
            city,
            country,
            loggedInAt: new Date(),
        });
        await user.save();

        // Create Access and Refresh JWT tokens
        const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
        const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

        // Create response and set cookies
        const response = NextResponse.json({ message: 'Login successful' });

        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 15 * 60, // 15 minutes
            sameSite: 'lax',
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            sameSite: 'lax',
        });

        return response;
    } catch (err) {
        console.error('Login error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
