# Levora — Employee Leave Management System

> Elevating workforce leave management through intelligent automation.

## Tech Stack

| Layer          | Technology                      |
|----------------|----------------------------------|
| Frontend       | HTML + Bootstrap 5 + AngularJS  |
| Backend        | Node.js + Express.js            |
| Database       | MongoDB + Mongoose              |
| Authentication | Session + Cookies               |
| Charts         | Chart.js                        |

## Features

### Employee
- Login / Logout (Session-based)
- Apply Leave (CL / SL / PL with form validation)
- View leave status (Pending / Approved / Rejected)
- View own leave history
- Edit / Delete leave request (before approval only)
- Leave balance tracking

### Manager
- View pending leave requests
- Approve / Reject leave with comments
- View team leave history

### Admin / HR
- Add / Edit / Delete employees
- Create leave types (CL, SL, PL)
- Set leave limits per year
- View all leave records (sortable table)
- Dashboard with counts
- Bar chart: Total Leaves per Month

## Getting Started

### Prerequisites
- Node.js (LTS)
- MongoDB (running locally on port 27017)

### Environment Variables (Local)

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/levora
NODE_ENV=development
CLIENT_URL=http://localhost:5000
```

Or copy from the example:
```bash
cp backend/.env.example backend/.env
```

### Installation

```bash
cd backend
npm install
```

### Seed Demo Data

```bash
cd backend
node seed.js
```

### Start Server

```bash
cd backend
node server.js
```

Then open: **http://localhost:5000**

## Deployment Guide (Render + MongoDB Atlas)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/levora.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → **Web Service**
3. Connect your `levora` GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Free**
5. Click **"Environment"** → Add these variables:
   - `MONGO_URI`: `mongodb+srv://ileshpatel666_db_user:GJs2lcGelHXB9ee0@levora.nwwavtx.mongodb.net/levora?retryWrites=true&w=majority`
   - `NODE_ENV`: `production`
6. Deploy and wait 2-3 minutes

### Step 3: Seed Live Database

In Render dashboard → Service Shell tab:
```bash
node seed.js
```

Your live app will be at: **https://levora.onrender.com**

## Demo Credentials

| Role     | Email                       | Password     |
|----------|-----------------------------|--------------|
| Admin    | rajesh.kumar@levora.in      | Admin@123    |
| Manager  | priya.sharma@levora.in      | Manager@123  |
| Manager  | amit.patel@levora.in        | Manager@123  |
| Employee | sneha.reddy@levora.in       | Emp@123      |
| Employee | vikram.singh@levora.in      | Emp@123      |
| Employee | ananya.desai@levora.in      | Emp@123      |

## Project Structure

```
levora/
├── backend/
│   ├── server.js              # Express server entry point
│   ├── seed.js                # Database seeder
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── LeaveType.js       # Leave type schema
│   │   └── LeaveRequest.js    # Leave request schema
│   ├── routes/
│   │   ├── auth.js            # Login / Logout / Session
│   │   ├── employee.js        # Employee leave CRUD
│   │   ├── manager.js         # Manager approval workflow
│   │   ├── admin.js           # Admin user & leave type CRUD
│   │   └── dashboard.js       # Dashboard counts & chart data
│   └── middleware/
│       └── auth.js            # Auth & role middleware
├── frontend/
│   ├── index.html             # SPA entry point
│   ├── css/
│   │   └── levora.css         # SaaS design system
│   ├── js/
│   │   ├── app.js             # AngularJS module & routing
│   │   ├── services/          # API service layer
│   │   └── controllers/       # UI controllers
│   └── views/                 # HTML templates
│       ├── login.html
│       ├── employee/
│       ├── manager/
│       └── admin/
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET  /api/auth/me`

### Employee
- `POST   /api/leave/apply`
- `GET    /api/leave/my`
- `GET    /api/leave/balance`
- `PUT    /api/leave/:id`
- `DELETE /api/leave/:id`

### Manager
- `GET /api/manager/pending-leaves`
- `GET /api/manager/team-history`
- `PUT /api/manager/leave/:id/approve`
- `PUT /api/manager/leave/:id/reject`

### Admin
- `GET    /api/admin/users`
- `POST   /api/admin/user`
- `PUT    /api/admin/user/:id`
- `DELETE /api/admin/user/:id`
- `GET    /api/admin/managers`
- `GET    /api/admin/leave-types`
- `POST   /api/admin/leave-type`
- `PUT    /api/admin/leave-type/:id`
- `GET    /api/admin/leaves`

### Dashboard
- `GET /api/dashboard/counts`
- `GET /api/dashboard/leaves-by-month`
- `GET /api/dashboard/leave-status-distribution`
- `GET /api/dashboard/recent-activity`
- `GET /api/dashboard/leave-types`
- `GET /api/health`
