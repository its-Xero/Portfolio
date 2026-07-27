import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl || 'https://awmplipznasyncnmrnjn.supabase.co', supabaseAnonKey || 'sb_publishable_KfhlQAxYozHIBE0X9Qc-TQ_epH5-k3z')
