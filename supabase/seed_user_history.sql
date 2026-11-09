BEGIN;

DO $$
DECLARE
    v_user_id UUID := '0a988e91-7bbc-4e37-af75-1a62497f1066';
BEGIN

    -- 1. Clear previous records for clean re-seed
    DELETE FROM public.transactions WHERE user_id = v_user_id;
    DELETE FROM public.fdr_deposits WHERE user_id = v_user_id;

    -- 2. Update Available Checking Balance
    UPDATE public.profiles
    SET
        balance = 263981.63,
        updated_at = NOW()
    WHERE id = v_user_id;

    -- 3. Fixed Deposit (Total: $400,000)
    INSERT INTO public.fdr_deposits
    (
        user_id,
        plan_name,
        deposit_amount,
        profit_rate,
        profit_amount,
        duration_months,
        mature_date,
        status,
        created_at
    )
    VALUES
    (
        v_user_id,
        'Premium Fixed Deposit',
        100000.00,
        10.00,
        10000.00,
        12,
        '2027-01-15',
        'running',
        '2026-01-15 14:20:18+01'
    ),
    (
        v_user_id,
        'Premium Fixed Deposit',
        85000.00,
        10.00,
        8500.00,
        12,
        '2027-05-10',
        'running',
        '2026-05-10 11:16:42+01'
    ),
    (
        v_user_id,
        'Premium Fixed Deposit',
        75000.00,
        10.00,
        7500.00,
        12,
        '2027-07-22',
        'running',
        '2026-07-22 09:48:27+01'
    ),
    (
        v_user_id,
        'Premium Fixed Deposit',
        140000.00,
        10.00,
        14000.00,
        12,
        '2027-09-18',
        'running',
        '2026-09-18 15:37:51+01'
    );

    -- 4. Transactions Ledger (Historical Failures + The Two 8,500 Failed Wires at the Top)
    INSERT INTO public.transactions
    (
        user_id,
        trx_id,
        type,
        title,
        amount,
        charge,
        status,
        method,
        details,
        created_at
    )
    VALUES

    -- Account Opening
    (
        v_user_id,
        'TRX-BONUS-001',
        'bonus',
        'Signup Bonus',
        8.00,
        0.00,
        'success',
        'System',
        'Welcome bonus for opening digital account',
        '2026-01-01 09:00:00+01'
    ),

    /* =========================
       JANUARY
       ========================= */
    (
        v_user_id,
        'TRX-JAN-001',
        'deposit',
        'Account Funding',
        100000.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-01-05 09:14:23+01'
    ),
    (
        v_user_id,
        'TRX-FDR-100K',
        'fdr',
        'Fixed Deposit',
        100000.00,
        0.00,
        'success',
        'Fixed Deposit',
        '100,000.00 placed into fixed deposit',
        '2026-01-15 14:20:18+01'
    ),
    (
        v_user_id,
        'TRX-JAN-002',
        'deposit',
        'Cash Deposit',
        90000.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-01-16 13:42:18+01'
    ),
    (
        v_user_id,
        'TRX-JAN-003',
        'withdraw',
        'Cash Withdrawal',
        8500.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-01-21 16:08:44+01'
    ),
    (
        v_user_id,
        'TRX-JAN-004',
        'deposit',
        'Account Funding',
        80000.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-01-28 11:27:51+01'
    ),

    /* =========================
       FEBRUARY
       ========================= */
    (
        v_user_id,
        'TRX-FEB-001',
        'deposit',
        'Account Funding',
        42000.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-02-06 10:18:37+01'
    ),
    (
        v_user_id,
        'TRX-FEB-002',
        'withdraw',
        'Cash Withdrawal',
        12400.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-02-12 15:46:19+01'
    ),
    (
        v_user_id,
        'TRX-FEB-003',
        'deposit',
        'Cash Deposit',
        27500.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-02-19 09:32:48+01'
    ),
    (
        v_user_id,
        'TRX-FEB-004',
        'bill',
        'Bill Payment Failed',
        6800.00,
        0.00,
        'failed',
        'Bill Payment',
        'Payment failed. No funds were deducted.',
        '2026-02-24 18:21:06+01'
    ),

    /* =========================
       MARCH
       ========================= */
    (
        v_user_id,
        'TRX-MAR-001',
        'deposit',
        'Account Funding',
        31850.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-03-04 12:06:27+01'
    ),
    (
        v_user_id,
        'TRX-MAR-002',
        'withdraw',
        'Cash Withdrawal',
        7200.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-03-11 14:39:12+01'
    ),
    (
        v_user_id,
        'TRX-MAR-003',
        'deposit',
        'Cash Deposit',
        46500.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-03-18 10:51:33+01'
    ),
    (
        v_user_id,
        'TRX-MAR-004',
        'transfer',
        'Bank Transfer Failed',
        15300.00,
        0.00,
        'failed',
        'Bank Transfer',
        'Transfer failed during processing. No funds were deducted.',
        '2026-03-26 17:14:52+01'
    ),

    /* =========================
       APRIL
       ========================= */
    (
        v_user_id,
        'TRX-APR-001',
        'deposit',
        'Account Funding',
        38200.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-04-03 08:47:26+01'
    ),
    (
        v_user_id,
        'TRX-APR-002',
        'withdraw',
        'Cash Withdrawal',
        15300.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-04-09 16:22:41+01'
    ),
    (
        v_user_id,
        'TRX-APR-003',
        'deposit',
        'Cash Deposit',
        29500.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-04-17 11:35:09+01'
    ),
    (
        v_user_id,
        'TRX-APR-004',
        'withdraw',
        'Cash Withdrawal Failed',
        22000.00,
        0.00,
        'failed',
        'ATM',
        'ATM withdrawal declined. No funds were deducted.',
        '2026-04-23 19:08:17+01'
    ),

    /* =========================
       MAY
       ========================= */
    (
        v_user_id,
        'TRX-MAY-001',
        'deposit',
        'Account Funding',
        41750.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-05-02 10:16:44+01'
    ),
    (
        v_user_id,
        'TRX-MAY-002',
        'withdraw',
        'Cash Withdrawal',
        9600.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-05-08 13:51:28+01'
    ),
    (
        v_user_id,
        'TRX-FDR-085K',
        'fdr',
        'Fixed Deposit',
        85000.00,
        0.00,
        'success',
        'Fixed Deposit',
        '85,000.00 added to fixed deposit',
        '2026-05-10 11:16:42+01'
    ),
    (
        v_user_id,
        'TRX-MAY-003',
        'deposit',
        'Cash Deposit',
        26300.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-05-16 09:43:15+01'
    ),
    (
        v_user_id,
        'TRX-MAY-004',
        'transfer',
        'Transfer Failed',
        12750.00,
        0.00,
        'failed',
        'Bank Transfer',
        'Recipient bank rejected the transfer. No funds were deducted.',
        '2026-05-25 16:37:49+01'
    ),

    /* =========================
       JUNE
       ========================= */
    (
        v_user_id,
        'TRX-JUN-001',
        'deposit',
        'Account Funding',
        35400.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-06-04 11:28:36+01'
    ),
    (
        v_user_id,
        'TRX-JUN-002',
        'withdraw',
        'Cash Withdrawal',
        11800.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-06-10 14:07:52+01'
    ),
    (
        v_user_id,
        'TRX-JUN-003',
        'deposit',
        'Cash Deposit',
        22150.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-06-18 10:42:18+01'
    ),
    (
        v_user_id,
        'TRX-JUN-004',
        'bill',
        'Bill Payment Failed',
        9200.00,
        0.00,
        'failed',
        'Bill Payment',
        'Bill payment failed. No funds were deducted.',
        '2026-06-27 20:13:41+01'
    ),

    /* =========================
       JULY
       ========================= */
    (
        v_user_id,
        'TRX-JUL-001',
        'deposit',
        'Account Funding',
        48900.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-07-03 09:36:25+01'
    ),
    (
        v_user_id,
        'TRX-JUL-002',
        'withdraw',
        'Cash Withdrawal',
        6800.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-07-11 15:24:08+01'
    ),
    (
        v_user_id,
        'TRX-JUL-003',
        'deposit',
        'Cash Deposit',
        31750.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-07-19 12:17:46+01'
    ),
    (
        v_user_id,
        'TRX-FDR-075K',
        'fdr',
        'Fixed Deposit',
        75000.00,
        0.00,
        'success',
        'Fixed Deposit',
        '75,000.00 added to fixed deposit',
        '2026-07-22 09:48:27+01'
    ),
    (
        v_user_id,
        'TRX-JUL-004',
        'withdraw',
        'Cash Withdrawal',
        14200.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-07-28 17:43:29+01'
    ),

    /* =========================
       AUGUST
       ========================= */
    (
        v_user_id,
        'TRX-AUG-001',
        'deposit',
        'Account Funding',
        18500.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-08-05 10:28:17+01'
    ),
    (
        v_user_id,
        'TRX-AUG-002',
        'withdraw',
        'Cash Withdrawal',
        9100.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-08-13 13:46:53+01'
    ),
    (
        v_user_id,
        'TRX-AUG-003',
        'deposit',
        'Cash Deposit',
        36750.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-08-21 09:18:34+01'
    ),
    (
        v_user_id,
        'TRX-AUG-004',
        'transfer',
        'Bank Transfer Failed',
        14800.00,
        0.00,
        'failed',
        'Bank Transfer',
        'Transfer failed during processing. No funds were deducted.',
        '2026-08-29 18:04:22+01'
    ),

    /* =========================
       SEPTEMBER
       ========================= */
    (
        v_user_id,
        'TRX-SEP-001',
        'deposit',
        'Account Funding',
        41750.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-09-04 11:42:16+01'
    ),
    (
        v_user_id,
        'TRX-SEP-002',
        'withdraw',
        'Cash Withdrawal',
        12750.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-09-10 16:18:39+01'
    ),
    (
        v_user_id,
        'TRX-SEP-003',
        'deposit',
        'Cash Deposit',
        22500.00,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-09-18 10:29:47+01'
    ),
    (
        v_user_id,
        'TRX-FDR-140K',
        'fdr',
        'Fixed Deposit',
        140000.00,
        0.00,
        'success',
        'Fixed Deposit',
        '140,000.00 added to fixed deposit',
        '2026-09-18 15:37:51+01'
    ),
    (
        v_user_id,
        'TRX-SEP-004',
        'withdraw',
        'Cash Withdrawal',
        7400.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-09-26 14:55:12+01'
    ),

    /* =========================
       OCTOBER
       ========================= */
    (
        v_user_id,
        'TRX-OCT-001',
        'deposit',
        'Account Funding',
        39400.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-10-02 09:31:44+01'
    ),
    (
        v_user_id,
        'TRX-OCT-003',
        'withdraw',
        'Cash Withdrawal',
        11300.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-10-12 12:16:53+01'
    ),
    (
        v_user_id,
        'TRX-OCT-004',
        'deposit',
        'Cash Deposit',
        31681.63,
        0.00,
        'success',
        'Cash deposit',
        'Cash deposit credited to account',
        '2026-10-16 10:48:29+01'
    ),
    (
        v_user_id,
        'TRX-OCT-006',
        'bill',
        'Bill Payment Failed',
        7500.00,
        0.00,
        'failed',
        'Bill Payment',
        'Bill payment failed. No funds were deducted.',
        '2026-10-26 19:13:07+01'
    ),
    (
        v_user_id,
        'TRX-OCT-007',
        'withdraw',
        'Cash Withdrawal',
        8500.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-10-29 13:41:22+01'
    ),

    /* =========================
       NOVEMBER
       ========================= */
    (
        v_user_id,
        'TRX-NOV-001',
        'deposit',
        'Account Funding',
        27500.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-11-02 10:17:35+01'
    ),
    (
        v_user_id,
        'TRX-NOV-002',
        'withdraw',
        'Cash Withdrawal',
        6200.00,
        0.00,
        'success',
        'ATM',
        'ATM cash withdrawal',
        '2026-11-04 15:28:19+01'
    ),
    (
        v_user_id,
        'TRX-NOV-003',
        'transfer',
        'Bank Transfer Failed',
        13200.00,
        0.00,
        'failed',
        'Bank Transfer',
        'Transfer failed. No funds were deducted.',
        '2026-11-06 11:43:52+01'
    ),
    (
        v_user_id,
        'TRX-NOV-004',
        'deposit',
        'Account Funding',
        18950.00,
        0.00,
        'success',
        'Bank deposit',
        'Account funding received',
        '2026-11-08 09:26:14+01'
    ),

    /* =========================================================
       THE TWO $8,500 FAILED WIRE TRANSACTIONS (LAST TWO ON ACCOUNT)
       ========================================================= */
    (
        v_user_id,
        'TRX-WIRE-8500-A',
        'transfer',
        'Wire Transfer Failed',
        8500.00,
        0.00,
        'failed',
        'Wire',
        'Wire transfer failed - Compliance security protocol active. Funds were not debited.',
        '2026-11-09 16:30:00+01'
    ),
    (
        v_user_id,
        'TRX-WIRE-8500-B',
        'transfer',
        'Wire Transfer Failed',
        8500.00,
        0.00,
        'failed',
        'Wire',
        'Wire transfer failed - Outgoing wire facility locked. In-branch verification required.',
        '2026-11-09 17:50:00+01'
    );

END $$;

COMMIT;
