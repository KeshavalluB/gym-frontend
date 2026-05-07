import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase credentials missing. Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
}

// This client will be used for all database operations
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { from: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }), eq: () => ({ eq: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }), select: () => ({ data: [], error: { message: 'Supabase not configured' } }) }) }) }


/**
 * DATABASE HELPERS
 * These mirror the LocalStorage structure for an easy transition.
 */
export const SupabaseDB = {
  admins: {
    table: 'admins',
    getAll: async () => {
      const { data, error } = await supabase.from('admins').select('*')
      if (error) throw error
      return data
    }
  },
  trainers: {
    table: 'trainers',
    getAll: async () => {
      const { data, error } = await supabase.from('trainers').select('*')
      if (error) throw error
      return data
    }
  },
  members: {
    table: 'members',
    getAll: async () => {
      const { data, error } = await supabase.from('members').select('*')
      if (error) throw error
      return data
    }
  },
  payments: {
    table: 'payments',
    getAll: async () => {
      const { data, error } = await supabase.from('payments').select('*')
      if (error) throw error
      return data
    }
  },
  plans: {
    table: 'membership_plans',
    getAll: async () => {
      const { data, error } = await supabase.from('membership_plans').select('*')
      if (error) throw error
      return data
    }
  }
}
