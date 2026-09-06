# Spendly 💸

A full-stack personal finance tracker that helps you manage your income, expenses, and monthly budgets with private, secure user accounts.

🚀 **Live Demo**: [https://spendly-nine-pi.vercel.app](https://spendly-nine-pi.vercel.app)  
> **Note on Free Hosting**: The backend is deployed on Render's free tier. If the app hasn't been visited recently, the server may take ~30–45 seconds to spin up on your first request.

Built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas.

---

## Features

- **Authentication & Email Verification**: Secure registration with 6-digit OTP verification codes sent via Nodemailer (Gmail SMTP), bcrypt password hashing, and JWT tokens.
- **Password Reset**: Self-service account recovery with timed 6-digit verification codes sent directly to your inbox.
- **Security & Rate Limiting**: Protected with Helmet security headers and strict Express rate limiting to prevent brute-force attacks and abuse.
- **Multi-Tenant Data Privacy**: Every user's transactions and summaries are strictly isolated to their own account.
- **Financial Dashboard**: Overview of total balance, income, expenses, and recent transaction history.
- **Income & Expense Tracking**: Filtered views for logging and categorizing incoming revenue and daily purchases.
- **Category Breakdown**: Automatically calculates spending distribution across categories like Food, Rent, Utilities, Entertainment, etc.
- **Full CRUD**: Create, read, and delete transactions with instant real-time balance recalculation.
- **Responsive UI**: Clean, modern interface built with Tailwind CSS and Lucide icons.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router 7, Lucide React
- **Backend**: Node.js, Express 5, MongoDB (native driver), jsonwebtoken, bcryptjs, nodemailer, helmet, express-rate-limit, cors, dotenv
- **Database**: MongoDB Atlas (Cloud)
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

## Project Structure

```text
Spendly/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection pool
│   ├── controllers/
│   │   ├── authController.js        # Signup, login, verification & reset logic
│   │   └── transactionController.js # Transaction CRUD & user-scoped queries
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification middleware
│   │   └── rateLimiter.js           # Rate limiting middleware for auth & API
│   ├── routes/
│   │   ├── authRoutes.js            # Auth & password reset endpoints
│   │   └── transactionRoutes.js     # /transactions endpoints
│   ├── services/
│   │   └── emailService.js          # Nodemailer SMTP client & email templates
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js                     # Express app entry & server startup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionList.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── IncomesPage.jsx
│   │   │   ├── ExpensesPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   ├── services/
│   │   │   └── api.js               # Centralized fetch API client with auth headers
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vercel.json                  # SPA routing configuration for Vercel
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- MongoDB Atlas account (or local MongoDB)
- Gmail account with an App Password (for email verification)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="your_jwt_secret_key"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-character-app-password"
```

Start the backend server:

```bash
npm run dev
```

The server will connect to MongoDB and start on `http://localhost:3000`.

---

### 2. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

### Auth (Rate Limited)
- `POST /auth/signup` - Register a new user & trigger 6-digit verification email
- `POST /auth/verify-email` - Verify account with 6-digit OTP code (`email`, `code`)
- `POST /auth/resend-code` - Resend a fresh 6-digit verification code (`email`)
- `POST /auth/login` - Authenticate verified user & receive JWT token
- `POST /auth/forgot-password` - Request a 6-digit password reset code (`email`)
- `POST /auth/reset-password` - Reset password with code & new credentials (`email`, `code`, `newPassword`)

### Transactions (Requires `Authorization: Bearer <token>`)
- `GET /transactions` - Get all transactions for current user (optional `?type=income|expense`)
- `GET /transactions/summary` - Get total income, expense, balance, and count
- `POST /transactions` - Create transaction (`type`, `amount`, `category`, `date`, `description`)
- `DELETE /transactions/:id` - Delete a transaction

---

## License

ISC
