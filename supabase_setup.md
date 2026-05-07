# ⚡ Supabase Setup Guide for GymPro

Follow these steps to connect your project to a Supabase PostgreSQL database.

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign in.
2. Click **"New Project"**.
3. Name it `gympro-db` and set a secure database password.
4. Choose a region close to you and click **Create Project**.

### 2. Run the SQL Schema
1. Once your project is ready, go to the **SQL Editor** in the left sidebar.
2. Click **"New Query"**.
3. Copy the entire content from your local `supabase_schema.sql` file.
4. Paste it into the editor and click **Run**.
5. You should see "Success. No rows returned." Your tables and seed data are now live!

### 3. Get your API Keys
1. Go to **Project Settings** (gear icon) -> **API**.
2. Copy your **Project URL**.
3. Copy your **anon public** key.

### 4. Configure Environment Variables
Create a file named `.env.local` in your root directory (if not already there) and add:

```env
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### 5. Install Dependencies
Run the following command in your terminal:
`npm install @supabase/supabase-js`

### 6. Verify Connection
The project is already configured to use the `utils/supabase.js` client. Once you add the keys to `.env.local`, the app will automatically switch from LocalStorage to the Supabase Cloud database!
