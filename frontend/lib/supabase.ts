import { createClient } from '@supabase/supabase-js'

// Hardcoded to bypass Vercel build error
const supabaseUrl = "https://mrsffropwpcijfhlahfi.supabase.co" 
const supabaseKey = "sb_publishable_CUuiwJnP3pXFM5Bmz1eP_g_PhxW4TTV"

export const supabase = createClient(supabaseUrl, supabaseKey)