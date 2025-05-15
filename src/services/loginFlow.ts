
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
    
    // Determine redirect based on user role
    const role = userData.user.user_metadata?.role;
    console.log("User role for redirect:", role);
    
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
