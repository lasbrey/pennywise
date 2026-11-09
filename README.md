# PennyWiseTrust Bank 🏦

A modern, full-stack digital private banking platform built with **Next.js 16 (App Router & Turbopack)**, **Tailwind CSS v4**, and **Supabase (Auth, PostgreSQL DB, Row Level Security, Realtime Sync)**.

---

## ✨ Features

- **Luxury Brand Architecture**: Bespoke espresso brown, copper, and warm gold luxury aesthetic with fluid micro-interactions and responsive layouts.
- **Supabase Authentication & Security**:
  - Auto-confirmed signups with PostgreSQL trigger (`on_auth_user_created`).
  - Automatic `$8.00 USD` welcome bonus credited to checking account.
  - Automatic generation of 11-digit account number (`1957xxxxxxx`) and referral code.
  - Strict authentication route guard protecting all `/dashboard/*` endpoints.
- **Deposit Architecture**:
  - Exclusively **Bitcoin (BTC)** and **Cash Counter Deposit**.
  - 1.5% fee calculation, conversion rate (`1 USD = 0.000016 BTC`), wallet address copy (`bc1qed0jznt99dsc8d6qdffdr4janr634nem8n580x`), and proof receipt upload.
- **Withdrawals & Funds Security**:
  - Minimum withdrawable threshold enforced at `$500.00 USD`.
  - Outgoing fund transfers locked by default with in-person branch verification advisory.
- **Virtual Cards**:
  - Masked/starred card numbers (`•••• •••• •••• ••••`) and CVV (`•••`).
  - Requires card issuance fee unlock ($50) before revealing card numbers and 3D flip.
- **24/7 Live Support Concierge**:
  - Native Supabase-connected chat system saving messages to PostgreSQL `chat_messages` table with real-time channel sync.
- **Support Tickets**:
  - Ticket management with precedence tags and inline/modal ticket creation form.
- **Banking Modules**:
  - Pension Scheme (DPS), Fixed Deposit Receipts (FDR), Loan Facilities with EMI schedule, Bill Payments, and Referral Tracking.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- Supabase Project (URL & API Keys)

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and set your credentials:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
NEXT_PUBLIC_BTC_DEPOSIT_ADDRESS=bc1qed0jznt99dsc8d6qdffdr4janr634nem8n580x
```

### 3. Database Migration
Execute `supabase/schema.sql` in your Supabase SQL Editor, or run:

```bash
node scripts/migrate.js
```

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3001](http://localhost:3001)) to view the platform.

### 5. Production Build

```bash
npm run build
npm run start
```

---

## 🔒 Security
- All sensitive keys (`.env.local`) are strictly excluded via `.gitignore`.
- Row Level Security (RLS) is enabled across all 9 public tables.
- Route protection ensures no unauthenticated visitor can view dashboard balances, ledgers, or cards.

---

## 📄 License
Private & Confidential — PennyWiseTrust Bank.
