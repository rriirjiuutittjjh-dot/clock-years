import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface LifeCalendar {
  id: string
  birth_date: string
  life_expectancy: number
  created_at: string
  updated_at: string
}

export interface WeekNote {
  id: string
  calendar_id: string
  week_index: number
  note: string | null
  color: string
  created_at: string
  updated_at: string
}
