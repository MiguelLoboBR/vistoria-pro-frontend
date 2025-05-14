
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the user's identity from auth.users
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return new Response(JSON.stringify({
        error: 'User not authenticated'
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Get the user's role from the profiles table using a direct query
    // This avoids the RLS policy recursion issues
    const { data: profileData, error: profileError } = await supabaseClient.rpc(
      'get_user_role_safely'
    )

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return new Response(JSON.stringify({
        error: 'Error fetching profile',
        details: profileError
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({
      role: profileData || 'inspector',
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({
      error: 'Unexpected error',
      details: error.message
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
