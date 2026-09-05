# Spendly

A full-stack personal finance tracker that helps you manage your income, expenses, and monthly budgets with private user accounts.

Built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB Atlas.

---

## Features

- **Authentication & Email Verification**: Secure registration with 6-digit OTP codes sent via Resend, bcrypt password hashing, and JWT tokens.
- **Password Reset**: Self-service account recovery with timed 6-digit verification codes.
- **Multi-Tenant Data Privacy**: Every user's transactions and summaries are strictly isolated to their own account.
- **Financial Dashboard**: Overview of total balance, income, expenses, and recent transaction history.
- **Income & Expense Tracking**: Filtered views for logging and categorizing incoming revenue and daily purchases.
- **Category Breakdown**: Automatically calculates spending distribution across categories like Food, Rent, Utilities, etc.
- **Full CRUD**: Create, edit, and delete transactions with instant balance recalculation.
- **Responsive UI**: Clean interface built with Tailwind CSS and Lucide icons.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router 7, Lucide React
- **Backend**: Node.js, Express 5, MongoDB (native driver), jsonwebtoken, bcryptjs, resend, cors, dotenv
- **Database**: MongoDB Atlas

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
│   │   └── authMiddleware.js        # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js            # Auth & password reset endpoints
│   │   └── transactionRoutes.js     # /transactions endpoints
│   ├── services/
│   │   └── emailService.js          # Resend email client & templates
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js                     # Express app setup
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

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
RESEND_API_KEY="your_resend_api_key"
```

Start the backend server:

```bash
npm run dev
```

The server should be running on `http://localhost:3000`.

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

### Auth
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
- `PUT /transactions/:id` - Update existing transaction
- `DELETE /transactions/:id` - Delete a transaction

---

## License

ISC
