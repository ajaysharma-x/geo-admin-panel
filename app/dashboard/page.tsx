'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type LoginEntry = {
  city: string;
  country: string;
  loggedInAt: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginEntry[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [showUsers, setShowUsers] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/user/profile', { credentials: 'include' });
      if (!res.ok) return router.push('/register');

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
    document.documentElement.classList.toggle('dark', theme === 'dark');
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
    router.push('/login');
  };

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 transition-colors duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mt-10 mb-3 text-center w-full">
          {userData.role === 'admin'
            ? 'Admin Dashboard – Manage Users & Logs'
            : 'User Dashboard – Geo Admin Panel'}
        </h1>
        <div className="absolute top-6 right-6 space-x-3">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
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
                  className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="text-sm">
                    <span className="font-semibold">Location:</span> {entry.city}, {entry.country}
                  </div>
                  <div className="text-sm mt-1">
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
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowUsers(prev => !prev)}
            >
              {showUsers ? 'Hide Users' : 'Show Users'}
            </button>

            {showUsers && (
              <div className="mb-8 overflow-auto">
                <h3 className="text-lg font-semibold mb-3">All Users</h3>
                <table className="min-w-full text-left border border-gray-300 dark:border-gray-700">
                  <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 border-r">Name</th>
                      <th className="px-4 py-2 border-r">Email</th>
                      <th className="px-4 py-2">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map(u => (
                      <tr key={u._id} className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                        <td className="px-4 py-2 border-r">{u.name}</td>
                        <td className="px-4 py-2 border-r">{u.email}</td>
                        <td className="px-4 py-2">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <section className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Create New User</h3>
              <div className="space-y-3 max-w-md">
                <input
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Name"
                  className="w-full p-2 rounded border dark:bg-gray-700"
                />
                <input
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Email"
                  className="w-full p-2 rounded border dark:bg-gray-700"
                />
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Password"
                  className="w-full p-2 rounded border dark:bg-gray-700"
                />
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-2 rounded border dark:bg-gray-700"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={createNewUser}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
