import { createClient } from '@supabase/supabase-js'

// Récupérer les informations de configuration depuis les variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLIC_KEY

// Initialisation du client Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

// Exporter une fonction d'accès au client Supabase
export function useSupabaseClient () {
  return supabase
}
