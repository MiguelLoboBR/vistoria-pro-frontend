
import React, { createContext, useContext, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { Company, UserProfile } from "./types";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import { useAuthMethods } from "@/hooks/useAuth";

interface AuthContextType {
  user: UserProfile | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the useAuth hook that will be used in components to access the context
export const useAuth = () => {
  try {
    const context = useContext(AuthContext);
    if (context === undefined) {
      console.warn("useAuth must be used within an AuthProvider");
      return null;
    }
    return context;
  } catch (error) {
    console.error("Error in useAuth:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  try {
    const {
      user,
      company,
      isAuthenticated,
      isLoading,
      session,
      fetchUserProfile
    } = useAuthProvider();
    
    const {
      signIn,
      signUp,
      signOut,
      refreshUserProfile: refreshUserProfileHook
    } = useAuthMethods();
    
    const refreshUserProfile = async () => {
      await refreshUserProfileHook();
    };
    
    const value: AuthContextType = {
      user,
      company,
      isAuthenticated,
      isLoading,
      session,
      signIn,
      signUp,
      signOut,
      refreshUserProfile
    };
    
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  } catch (error) {
    console.error("Error rendering AuthProvider:", error);
    return <>{children}</>; // Fallback to render children without context
  }
};
