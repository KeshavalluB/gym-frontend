-- GYMPRO ULTIMATE SUPABASE SCHEMA (POSTGRESQL)
-- 1. DROP EXISTING TABLES (Optional: Starts you with a clean slate)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS membership_plans CASCADE;

-- 2. CREATE TABLES
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    specialty TEXT DEFAULT 'General Fitness',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    trainer_id INTEGER REFERENCES trainers(id) ON DELETE SET NULL,
    member_id_alt TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE membership_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    plan_id INTEGER,
    amount DECIMAL(10,2) NOT NULL,
    transaction_ref TEXT UNIQUE,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'Completed'
);

-- 3. SETUP SECURITY POLICIES (Allows your app to work)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Access" ON admins FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON trainers FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON members FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON membership_plans FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON payments FOR ALL TO public USING (true) WITH CHECK (true);

-- 4. SEED DATA (Linked correctly)
-- Insert Admin
INSERT INTO admins (name, email, password) VALUES ('Main Admin', 'admin@gympro.com', 'admin123');

-- Insert Trainer (Arjun)
INSERT INTO trainers (id, name, email, password, specialty) 
VALUES (1, 'Arjun (Pro)', 'trainer@gympro.com', 'trainer123', 'Bodybuilding');

-- Insert Member and link to Arjun (trainer_id = 1)
INSERT INTO members (id, name, email, password, trainer_id, member_id_alt)
VALUES (1, 'John Member', 'member@gympro.com', 'member123', 1, 'ID-MEM-001');

-- Insert active payment for John
INSERT INTO payments (member_id, plan_id, amount, transaction_ref, start_date, end_date)
VALUES (1, 2, 2500, 'TXN-INITIAL-SYNC', NOW(), NOW() + INTERVAL '90 days');
