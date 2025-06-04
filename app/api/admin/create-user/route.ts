import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/authMiddleware';

export const POST = requireRole(['admin'], async (req: NextRequest) => {
    try {

        await dbConnect();
        const { name, email, password, role = 'user' } = await req.json();

        const existing = await User.findOne({ email });
        if (existing) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role });


        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
    } catch (err) {
        console.error('User register error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
