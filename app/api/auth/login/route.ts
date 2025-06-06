import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '@/lib/auth';  // <-- updated auth helpers
import { isRateLimited, resetRateLimit } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
    try {
        // Get IP address from request
        //         // const forwardedFor = req.headers.get('x-forwarded-for');
        //         const res1 = await fetch('https://api.ipify.org?format=json');
        // const data = await res1.json();
        // console.log('Your Public IP:', data.ip);
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'Unknown';
        console.log(ip);

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
            if (ip === '::1' || ip === '127.0.0.1') {
                city = 'Localhost';
                country = 'N/A';
            } else {
                // run geolocation fetch
                const geoRes = await fetch(`https://ipwho.is/${ip}`);
                const geoData = await geoRes.json();
                console.log(geoData);

                city = geoData.city || 'Unknown';
                country = geoData.country || 'Unknown';
            }
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
