
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/services/types";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    );

    // Then check for an existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsAuthenticated(!!session);

        // Fetch the user profile if we have a session
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      // Try to fetch the user's profile from the database
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, company_id, avatar_url, cpf, phone")
        .eq("id", authUser.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      // If we got profile data, use it
      if (data) {
        setUser(data as UserProfile);
        return;
      }

      // If no profile data was found but we have user metadata,
      // create a temporary profile from the auth metadata
      if (authUser.user_metadata) {
        const metadata = authUser.user_metadata;
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          full_name: metadata.full_name,
          role: metadata.role || "inspector",
          company_id: metadata.company_id,
          avatar_url: metadata.avatar_url,
          cpf: metadata.cpf,
          phone: metadata.phone
        });
      }
    } catch (err) {
      console.error("Error in fetchUserProfile:", err);
    }
  };

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    fetchUserProfile
  };
};
