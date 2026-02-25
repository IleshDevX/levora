# Levora - Employee Leave Management System 🗓️

![Levora Icon](frontend/assets/levora-icon.svg)

Levora is a role-based leave management web application for organizations to manage leave requests, approvals, balances, and analytics.

It is designed to replace manual leave tracking (spreadsheets/chats/emails) with a centralized workflow where every action is auditable, role-aware, and easy to monitor.

## Why This Project

Many teams struggle with inconsistent leave processes, delayed approvals, and poor visibility into team availability. Levora addresses these problems by providing:

- A single source of truth for leave data
- Structured approval flow from employee to manager
- Admin controls for policy management
- Real-time summaries for operational decisions

## Core Workflow

1. Employee submits a leave request with date range, leave type, and reason.
2. System validates request against leave-type limits and existing yearly usage.
3. Manager reviews pending requests from direct reports.
4. Manager approves or rejects with optional/required comments (based on action).
5. Status updates are reflected immediately in employee history and dashboards.

## Role Responsibilities

| Role | Primary Responsibilities |
|---|---|
| Employee | Create leave requests, track status, monitor balance |
| Manager | Review team requests, approve/reject, monitor team history |
| Admin | Manage users, maintain leave types/limits, review organization-wide records |

## Leave Policy Logic Implemented

- Leave types support yearly limits (for example: CL, SL, PL)
- Leave duration is calculated inclusive of start and end date
- Requests are blocked if annual limit would be exceeded
- Only pending requests can be edited or deleted by employees
- Rejection requires manager comment for accountability

## Architecture Notes

- Monolithic Node.js + Express backend serving API and static frontend assets
- Session-backed authentication stored in MongoDB (`connect-mongo`)
- AngularJS SPA-style frontend with route-based views by role
- Mongoose models enforce domain structure for users, leave types, and requests

## Dashboard Insights Provided

- Leave counts by status (pending/approved/rejected)
- Monthly leave trend data
- Recent activity feed
- Role-specific cards (admin, manager, employee)

## Typical Use Cases

- HR/Admin onboarding new employees and assigning managers
- Employees planning personal/medical leave and checking remaining balance
- Managers ensuring team coverage before approving leave
- Leadership reviewing leave trends for workforce planning

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Credentials](#demo-credentials)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

## Features

### Employee
- Secure login/logout (session-based)
- Apply for leave
- View leave history and current request status
- Edit or delete pending leave requests
- Track leave balance

### Manager
- View pending requests from team members
- Approve or reject leave requests with comments
- View team leave history

### Admin
- Manage users (create, update, delete)
- Manage leave types and yearly limits
- View all leave records
- Access dashboard insights and charts

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, AngularJS (1.x), Bootstrap 5, Chart.js |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | express-session, connect-mongo |

## Project Structure

```text
AWP CIPAT/
├── backend/
│   ├── server.js
│   ├── seed.js
│   ├── middleware/
│   ├── models/
│   └── routes/
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   │   ├── controllers/
│   │   └── services/
│   ├── vendor/
│   └── views/
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm
- MongoDB (local or Atlas)

### Installation

```bash
cd backend
npm install
```

### Run the Application

```bash
npm start
```

Application URL:

```text
http://localhost:5000
```

### Seed Demo Data (Optional)

```bash
npm run seed
```

## Environment Variables

The backend supports the following variables:

- `PORT` (default: `5000`)
- `MONGO_URI` (default: `mongodb://127.0.0.1:27017/levora`)
- `CLIENT_URL` (default: `http://localhost:5000`)
- `NODE_ENV`

PowerShell example:

```powershell
$env:MONGO_URI="mongodb://127.0.0.1:27017/levora"
$env:PORT="5000"
$env:CLIENT_URL="http://localhost:5000"
```

## Demo Credentials

Available after running the seed script:

| Role | Email | Password |
|---|---|---|
| Admin | rajesh.kumar@levora.in | Admin@123 |
| Manager | priya.sharma@levora.in | Manager@123 |
| Manager | amit.patel@levora.in | Manager@123 |
| Employee | sneha.reddy@levora.in | Emp@123 |
| Employee | vikram.singh@levora.in | Emp@123 |
| Employee | ananya.desai@levora.in | Emp@123 |

## API Endpoints

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Employee
- `POST /api/leave/apply`
- `GET /api/leave/my`
- `GET /api/leave/balance`
- `PUT /api/leave/:id`
- `DELETE /api/leave/:id`

### Manager
- `GET /api/manager/pending-leaves`
- `GET /api/manager/team-history`
- `PUT /api/manager/leave/:id/approve`
- `PUT /api/manager/leave/:id/reject`

### Admin
- `GET /api/admin/users`
- `POST /api/admin/user`
- `PUT /api/admin/user/:id`
- `DELETE /api/admin/user/:id`
- `GET /api/admin/managers`
- `GET /api/admin/leave-types`
- `POST /api/admin/leave-type`
- `PUT /api/admin/leave-type/:id`
- `DELETE /api/admin/leave-type/:id`
- `GET /api/admin/leaves`

### Dashboard
- `GET /api/dashboard/counts`
- `GET /api/dashboard/leaves-by-month`
- `GET /api/dashboard/leave-status-distribution`
- `GET /api/dashboard/recent-activity`
- `GET /api/dashboard/leave-types`

## Deployment

For Render deployment:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Configure environment variables: `MONGO_URI`, `NODE_ENV`, `PORT`, `CLIENT_URL`

## Security Notes

- Never commit production credentials to the repository.
- Rotate any database credentials that may have been exposed.
- Use strong session secrets via environment variables in production.

## Contributing

Contributions are welcome. For major changes, please open an issue first to discuss what you want to change.

## Future Improvements

- Public holiday and weekend-aware leave calculation
- Email/in-app approval notifications
- Multi-level approval chains for large organizations
- Export reports (CSV/PDF)
- Automated tests and CI pipeline integration

## License

This project is currently intended for academic and learning purposes. Add a formal license before public distribution.
