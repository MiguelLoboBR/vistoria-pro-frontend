
import React, { createContext, useContext, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { Company, UserProfile } from "./types";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import { useAuthActions } from "@/hooks/useAuthActions";

interface AuthContextType {
  user: UserProfile | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any } | undefined>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any } | undefined>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the useAuth hook that will be used in components to access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    company,
    isAuthenticated,
    isLoading,
    session,
    refreshUserProfile,
    fetchUserProfile
  } = useAuthProvider();
  
  const {
    login,
    logout,
    signUp,
    signIn,
    signOut
  } = useAuthActions(fetchUserProfile);
  
  const value: AuthContextType = {
    user,
    company,
    isAuthenticated,
    isLoading,
    session,
    login,
    logout,
    signUp,
    signIn,
    signOut,
    refreshUserProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
