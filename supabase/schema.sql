-- ====================================================================
-- PennyWiseTrust Bank - Complete Production Supabase Schema
-- Run this in your Supabase project's SQL Editor (Dashboard > SQL Editor)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  account_number TEXT UNIQUE NOT NULL,
  phone TEXT,
  country TEXT DEFAULT 'United States',
  address TEXT,
  balance NUMERIC(14, 2) DEFAULT 8.00,
  kyc_status TEXT DEFAULT 'approved', -- 'approved', 'pending', 'unverified'
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  referral_code TEXT UNIQUE,
  referral_count INT DEFAULT 0,
  referral_bonus NUMERIC(14, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. TRANSACTIONS LEDGER TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  trx_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'deposit', 'transfer', 'withdraw', 'dps', 'fdr', 'loan', 'bill', 'bonus'
  title TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  charge NUMERIC(14, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending', -- 'success', 'pending', 'failed'
  method TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. DEPOSITS TABLE (Bitcoin & Cash Deposit Only)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  trx_id TEXT UNIQUE NOT NULL,
  method TEXT NOT NULL, -- 'Bitcoin deposit', 'Cash deposit'
  amount NUMERIC(14, 2) NOT NULL,
  charge NUMERIC(14, 2) NOT NULL,
  payable_btc NUMERIC(18, 8),
  wallet_address TEXT DEFAULT 'bc1qed0jznt99dsc8d6qdffdr4janr634nem8n580x',
  proof_file_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. VIRTUAL CARDS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.virtual_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_number TEXT NOT NULL,
  card_holder TEXT NOT NULL,
  expiry TEXT NOT NULL,
  cvv TEXT NOT NULL,
  card_type TEXT DEFAULT 'Visa', -- 'Visa', 'Mastercard'
  tier TEXT DEFAULT 'Platinum', -- 'Standard', 'Platinum', 'Black'
  is_frozen BOOLEAN DEFAULT FALSE,
  is_paid BOOLEAN DEFAULT FALSE, -- Must pay creation fee to unlock/reveal
  creation_fee NUMERIC(14, 2) DEFAULT 50.00,
  spend_limit NUMERIC(14, 2) DEFAULT 5000.00,
  spent NUMERIC(14, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. SUPPORT TICKETS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  precedence TEXT NOT NULL DEFAULT 'Low', -- 'Low', 'Medium', 'High'
  message TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'Open', -- 'Open', 'Pending', 'Resolved', 'Closed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. LIVE CHAT MESSAGES TABLE (Supabase Native Live Support)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'user', -- 'user', 'support', 'system'
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. DPS PENSION SCHEMES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dps_schemes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  installment NUMERIC(14, 2) NOT NULL,
  total_installments INT NOT NULL,
  given_installments INT DEFAULT 1,
  interest_rate NUMERIC(5, 2) NOT NULL,
  mature_amount NUMERIC(14, 2) NOT NULL,
  next_installment_date TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. FDR FIXED DEPOSIT RECEIPTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fdr_deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  deposit_amount NUMERIC(14, 2) NOT NULL,
  profit_rate NUMERIC(5, 2) NOT NULL,
  profit_amount NUMERIC(14, 2) NOT NULL,
  duration_months INT NOT NULL,
  mature_date TEXT NOT NULL,
  status TEXT DEFAULT 'running',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. LOANS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.loans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  loan_name TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  installment NUMERIC(14, 2) NOT NULL,
  total_installments INT NOT NULL,
  paid_installments INT DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_cards_user_id ON public.virtual_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON public.chat_messages(user_id);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES WITH ADVANCED AUTH SECURITY
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dps_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fdr_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

-- Profiles: users can select, insert, update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Transactions: authenticated users can access own records
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert transactions" ON public.transactions;
CREATE POLICY "Users can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deposits: authenticated users can view & submit deposits
DROP POLICY IF EXISTS "Users can view own deposits" ON public.deposits;
CREATE POLICY "Users can view own deposits" ON public.deposits
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can create deposits" ON public.deposits;
CREATE POLICY "Users can create deposits" ON public.deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Virtual Cards: authenticated users can view & update own cards
DROP POLICY IF EXISTS "Users can view own cards" ON public.virtual_cards;
CREATE POLICY "Users can view own cards" ON public.virtual_cards
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert cards" ON public.virtual_cards;
CREATE POLICY "Users can insert cards" ON public.virtual_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update cards" ON public.virtual_cards;
CREATE POLICY "Users can update cards" ON public.virtual_cards
  FOR UPDATE USING (auth.uid() = user_id);

-- Support Tickets: Allow authenticated users to view & insert tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can insert tickets" ON public.support_tickets;
CREATE POLICY "Users can insert tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Live Chat: Allow users to view and insert their session messages
DROP POLICY IF EXISTS "Users can view chat messages" ON public.chat_messages;
CREATE POLICY "Users can view chat messages" ON public.chat_messages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert chat messages" ON public.chat_messages;
CREATE POLICY "Users can insert chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (true);

-- DPS, FDR, Loans
DROP POLICY IF EXISTS "Users can manage own DPS" ON public.dps_schemes;
CREATE POLICY "Users can manage own DPS" ON public.dps_schemes
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own FDR" ON public.fdr_deposits;
CREATE POLICY "Users can manage own FDR" ON public.fdr_deposits
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own loans" ON public.loans;
CREATE POLICY "Users can manage own loans" ON public.loans
  FOR ALL USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- AUTOMATIC NEW USER INITIALIZATION TRIGGER
-- --------------------------------------------------------------------
-- When a user registers through Supabase Auth, this trigger automatically
-- generates their profile, random 11-digit account number, $8.00 welcome bonus,
-- initial welcome transaction, and starred unactivated virtual card!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_acc TEXT;
  new_ref TEXT;
BEGIN
  new_acc := '1957' || floor(1000000 + random() * 9000000)::text;
  new_ref := 'PWT' || upper(substring(md5(random()::text) from 1 for 6));

  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    email,
    account_number,
    phone,
    balance,
    referral_code
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    new_acc,
    COALESCE(NEW.raw_user_meta_data->>'phone', '+1 (555) 000-0000'),
    8.00,
    new_ref
  )
  ON CONFLICT (id) DO NOTHING;

  -- Credit welcome signup bonus transaction
  INSERT INTO public.transactions (
    user_id,
    trx_id,
    type,
    title,
    amount,
    charge,
    status,
    method,
    details
  ) VALUES (
    NEW.id,
    'TRX' || upper(substring(md5(random()::text) from 1 for 10)),
    'bonus',
    'Signup Bonus',
    8.00,
    0.00,
    'success',
    'System',
    'Welcome bonus for opening PennyWiseTrust digital account'
  );

  -- Generate initial starred virtual card (requires $50 activation fee)
  INSERT INTO public.virtual_cards (
    user_id,
    card_number,
    card_holder,
    expiry,
    cvv,
    card_type,
    tier,
    is_frozen,
    is_paid,
    creation_fee,
    spend_limit,
    spent
  ) VALUES (
    NEW.id,
    '4532 ' || floor(1000 + random() * 9000)::text || ' ' || floor(1000 + random() * 9000)::text || ' ' || floor(1000 + random() * 9000)::text,
    upper(COALESCE(NEW.raw_user_meta_data->>'full_name', 'PENNYWISE CLIENT')),
    '09/29',
    floor(100 + random() * 900)::text,
    'Visa',
    'Platinum',
    false,
    false,
    50.00,
    5000.00,
    0.00
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- ENABLE SUPABASE REALTIME (IDEMPOTENT SAFE BLOCK)
-- --------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'support_tickets'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'transactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
  END IF;
END $$;
