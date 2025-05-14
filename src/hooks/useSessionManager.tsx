
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useProfileFetcher } from "./useProfileFetcher";
import { UserProfile, Company } from "@/contexts/types";

export function useSessionManager() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { fetchUserProfile } = useProfileFetcher();
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event);
      
      // Simple synchronous state updates only in the callback
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
      
      // Use setTimeout to defer any complex operations that might cause locks
      if (currentSession) {
        setTimeout(() => {
          handleProfileFetch(currentSession.user.id);
        }, 0);
      } else {
        setUser(null);
        setCompany(null);
        setIsLoading(false);
      }
    });
    
    // THEN check for existing session
    const fetchSession = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          setSession(existingSession);
          setIsAuthenticated(true);
          handleProfileFetch(existingSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setIsLoading(false);
      }
    };
    
    fetchSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleProfileFetch = async (userId: string) => {
    try {
      const { profile, company: fetchedCompany } = await fetchUserProfile(userId, session);
      if (profile) {
        setUser(profile);
        setCompany(fetchedCompany);
      }
    } catch (error) {
      console.error("Error handling profile fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    setUser,
    company,
    setCompany,
    isAuthenticated,
    isLoading,
    setIsLoading,
    session
  };
}
