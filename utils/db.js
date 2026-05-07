import { supabase } from './supabase'

/**
 * GYM DATABASE SERVICE (SUPABASE VERSION)
 * This utility now connects to your Supabase PostgreSQL backend.
 */

export const GymDB = {
  supabase, // Exporting for direct access if needed
  
  // ADAMS: Admin Database
  admins: {
    getAll: async () => {
      const { data, error } = await supabase.from('admins').select('*')
      if (error) {
        console.error("Supabase Error:", error)
        return []
      }
      return data
    },
    add: async (admin) => {
      const { data, error } = await supabase.from('admins').insert([admin]).select()
      if (error) throw error
      return data
    },
    validate: async (email, password) => {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()
      
      if (error) return null
      return data
    }
  },

  // TRAINERS: Professional Database
  trainers: {
    getAll: async () => {
      const { data, error } = await supabase.from('trainers').select('*')
      if (error) {
        console.error("Supabase Error:", error)
        return []
      }
      return data
    },
    add: async (trainer) => {
      const { data, error } = await supabase.from('trainers').insert([trainer]).select()
      if (error) throw error
      return data
    },
    validate: async (email, password) => {
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()
      
      if (error) return null
      return data
    }
  },


  // MEMBERS: Client Database
  members: {
    getAll: async () => {
      const { data, error } = await supabase.from('members').select('*')
      if (error) {
        console.error("Supabase Error:", error)
        return []
      }
      return data
    },
    add: async (member) => {
      const { data, error } = await supabase
        .from('members')
        .insert([{ 
          ...member, 
          member_id_alt: `ID-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
        }])
        .select()
      
      if (error) throw error
      return data
    },
    validate: async (email, password) => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()
      
      if (error) return null
      return data
    }
  },

  // PAYMENTS: Financial Database
  payments: {
    getAll: async () => {
      const { data, error } = await supabase.from('payments').select('*')
      if (error) return []
      return data
    },
    add: async (payment) => {
      const { data, error } = await supabase
        .from('payments')
        .insert([{ ...payment, transaction_ref: `TXN-${Date.now()}` }])
        .select()
      
      if (error) throw error
      return data
    }
  }
};


