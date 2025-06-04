# 🌐 Geo-Enabled User Admin Panel

A secure and modern admin dashboard built with **Next.js App Router**, **TypeScript**, **MongoDB**, and **JWT Authentication**. It includes role-based access control (admin/user), IP-based geolocation tracking on login, and a full user management interface.

---

## 🚀 Features

- ✅ **User Registration & Login** (with hashed passwords)
- 🔐 **JWT Authentication** (Access + Refresh tokens via HTTP-only cookies)
- 👥 **Role-Based Authorization** (admin & user roles)
- 🌍 **IP-based Geolocation Logging** (City & Country using `ipapi.co`)
- 📋 **Admin Dashboard**: View and manage users
- 🕵️‍♂️ **User Dashboard**: View personal login history
- 🎨 **TailwindCSS UI**: Clean and responsive interface

---

## 🛠️ Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **MongoDB & Mongoose**
- **JWT (Access + Refresh Tokens)**
- **TailwindCSS**
- **ipapi.co** (for IP-based location)

---

## 📦 Setup Instructions


### 1. Clone the Repository

```bash
git clone https://github.com/your-username/geo-admin-panel.git
cd geo-admin-panel
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy .env.example to .env.local:

```bash
cp .env.example .env.local
```

Then fill in your secrets in .env.local file:

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=some_secret_value

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret


### 4. ▶️ Run the App

```bash
npm run dev
```
### 5. Visit: http://localhost:3000

---------------------------------------------

### 🧪 How to Test:

➕ Register a New User

Go to /register
Example(http://localhost:3000/register)

Fill in Name, Email, Password

Submit

#### 🔐 Login
Go to /login

Enter valid credentials

On success:

User gets redirected to their dashboard

Admin gets redirected to admin panel

Login history (with IP, city, country) is recorded

---

## Bonus Points (Optional but Impressive) 
 
● Rate limiting login attempts  ->  ✅ Done

● Refresh token implementation  ->  ✅ Done

● Pagination for user list      ->  Still in progress...

● Dark/Light theme switcher     ->  ✅ Done

---

## ✅ Submission Checklist

● Auth working correctly

● Role-based access control

● IP geolocation logging

● UI polished with TailwindCSS

● Readme with setup & test instructions

 ---

## 🔐 API Routes Overview:
### Endpoint	            Method	    Description	Auth Required
    /api/auth/register    POST	    Register new user            ❌
    /api/auth/login       POST	    Login & get JWT tokens       ❌
    /api/user/profile     GET	      Get current user's profile   ✅ (user/admin)
    /api/admin/users      GET	      Admin fetch all users        ✅ (admin only)


## Postman Testing:
Register/Create user through below sample data in POST request:

{
  "name": "Ajay Sharma",
  "email": "ajay@example.com",
  "password": "secure123",
  "role": "admin"
}

{
  "name": "Ajay Sharma",
  "email": "ajay@example.com",
  "password": "secure123",
  "role": "user"
}

Login user through below data in POST request:

{
  "email": "ajay@example.com",
  "password": "secure123"
}#
