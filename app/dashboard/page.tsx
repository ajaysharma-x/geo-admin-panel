'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [loginHistory, setLoginHistory] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
    const [showUsers, setShowUsers] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await fetch('/api/user/profile', { credentials: 'include' });
            if (!res.ok) return router.push('/login');
            const data = await res.json();
            setUserData(data);

            if (data.role === 'user') {
                const histRes = await fetch('/api/user/login-history');
                const histData = await histRes.json();
                setLoginHistory(histData);
            }

            if (data.role === 'admin') {
                const usersRes = await fetch('/api/admin/users');
                const users = await usersRes.json();
                setAllUsers(users);
            }
        };
        fetchProfile();
    }, [router]);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const createNewUser = async () => {
        const res = await fetch('/api/admin/create-user', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
            const updated = await res.json();
            setAllUsers(prev => [...prev, updated.user]);
            setNewUser({ name: '', email: '', password: '', role: 'user' });
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login')
    };

    if (!userData) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 transition-colors duration-300">

            <header className="flex justify-between items-center mb-8">
                {userData.role === 'admin' && (<h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-10 mb-3 text-center">
  Admin Dashboard – Manage Users & Logs
</h1>)}
 {userData.role === 'user' && (<h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-10 mb-3 text-center">
  User Dashboard – Geo Admin Panel
</h1>)}


                <div className="flex space-x-3">
                    <button
                        onClick={toggleTheme}
                        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                        aria-label="Logout"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main>
                <h2 className="text-xl font-semibold mb-6">
                    Welcome, {userData.name} ({userData.role})
                </h2>

                {userData.role === 'user' && (
                    <>
                    
                        <h3 className="text-lg font-semibold mb-4">Your Login History</h3>
                        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-64 overflow-y-auto pr-2">
                            {loginHistory.map((entry, i) => (
                                <li
                                    key={i}
                                    className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        <span className="font-semibold">Location:</span>{' '}
                                        {entry.city}, {entry.country}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        <span className="font-semibold">Time:</span>{' '}
                                        {new Date(entry.loggedInAt).toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}


                {userData.role === 'admin' && (
                    <>
                        <button
                            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            onClick={() => setShowUsers(prev => !prev)}
                        >
                            {showUsers ? 'Hide Users' : 'Show Users'}
                        </button>

                        {showUsers && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-3">All Users</h3>
                                <ul className="space-y-2 max-h-64 overflow-auto">
                                    <table className="min-w-full text-left border border-gray-300 dark:border-gray-700">
                                        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                            <tr>
                                                <th className="px-4 py-2 border-r dark:border-gray-600">Name</th>
                                                <th className="px-4 py-2 border-r dark:border-gray-600">Email</th>
                                                <th className="px-4 py-2">Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.map((u) => (
                                                <tr key={u._id} className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                                                    <td className="px-4 py-2 border-r dark:border-gray-700">{u.name}</td>
                                                    <td className="px-4 py-2 border-r dark:border-gray-700">{u.email}</td>
                                                    <td className="px-4 py-2">{u.role}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </ul>
                            </div>
                        )}

                        <section className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">Create New User</h3>
                            <div className="space-y-3 max-w-md">
                                <input
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    placeholder="Name"
                                    className="w-full p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600 transition-colors"
                                />
                                <input
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="Email"
                                    className="w-full p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600 transition-colors"
                                />
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="Password"
                                    className="w-full p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600 transition-colors"
                                />
                                <select
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600 transition-colors"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button
                                    onClick={createNewUser}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                >
                                    Create User
                                </button>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}
