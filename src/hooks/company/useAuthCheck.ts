
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthCheck = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        console.log("Checking authentication status...");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log("Session data:", data);
        
        if (!data.session) {
          console.log("No active session found.");
          // Redirect to login if no session
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          navigate("/login");
          return;
        }
        
        console.log("User authenticated:", data.session.user.id);
        setUserId(data.session.user.id);
        setAuthChecked(true);
        
        // Create or update profile with appropriate role
        const { data: userResult, error: userError } = await supabase
          .from("profiles")
          .upsert([
            {
              id: data.session.user.id,
              email: data.session.user.email,
              full_name: data.session.user.user_metadata?.full_name || "",
              role: "admin" // Ensure user is set as admin
            }
          ], { onConflict: 'id' });
          
        if (userError) {
          console.error("Error updating user profile:", userError);
        } else {
          console.log("User profile updated or created");
        }
      } catch (error: any) {
        console.error("Error fetching session:", error.message);
        toast.error("Erro ao verificar autenticação.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [navigate]);

  return {
    userId,
    loading,
    authChecked
  };
};
