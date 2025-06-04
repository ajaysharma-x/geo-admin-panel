import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'user'], default: 'user' },
        loginHistory: [
            {
                ip: String,
                city: String,
                country: String,
                loggedInAt: { type: Date, default: Date.now },
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
