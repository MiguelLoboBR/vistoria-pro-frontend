
import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Modified to accept a navigation function instead of using hooks directly
export const loginAndRedirect = async (navigate: NavigateFunction | ((path: string, options?: any) => void)) => {
  try {
    // Check session and user data
    const { data } = await supabase.auth.getSession();
    const currentSession = data.session;
    
    if (!currentSession) {
      console.log("No active session found for redirect");
      navigate("/login", { replace: true });
      return;
    }
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      console.log("No user data found for redirect");
      navigate("/login", { replace: true });
      return;
    }
    
    // Try to get role first from user metadata
    let role = userData.user.user_metadata?.role;
    
    // If not in metadata, try to get from the safe RPC function
    if (!role) {
      try {
        const { data: roleData, error } = await supabase.rpc('get_current_user_role');
        if (!error && roleData) {
          role = roleData;
          console.log("Role obtained from RPC function:", role);
        }
      } catch (rpcError) {
        console.error("Error calling RPC function:", rpcError);
      }
    }
    
    console.log("User role for redirect:", role);
    
    // Determine redirect based on user role
    if (role === "admin_master") {
      navigate("/master/dashboard", { replace: true });
    } else if (role === "admin_tenant") {
      navigate("/admin/dashboard", { replace: true });
    } else {
      // Default to inspector role
      navigate("/inspector/dashboard", { replace: true });
    }
  } catch (error: any) {
    console.error("Error during login redirect:", error.message);
    throw error;
  }
};
