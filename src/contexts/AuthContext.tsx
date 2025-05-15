
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
  registerInspector: (email: string, password: string, fullName: string, companyId: string) => Promise<UserProfile | null>;
}

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the useAuth hook that will be used in components to access the context
export const useAuth = () => {
  try {
    const context = useContext(AuthContext);
    if (context === undefined) {
      console.warn("useAuth must be used within an AuthProvider");
      return {
        user: null,
        company: null,
        isAuthenticated: false,
        isLoading: false,
        session: null,
        signIn: async () => ({ error: new Error("Auth context not available") }),
        signUp: async () => ({ error: new Error("Auth context not available") }),
        signOut: async () => { console.warn("Auth context not available"); },
        refreshUserProfile: async () => { console.warn("Auth context not available"); },
        registerInspector: async () => { console.warn("Auth context not available"); return null; }
      } as AuthContextType;
    }
    return context;
  } catch (error) {
    console.error("Error in useAuth:", error);
    return null;
  }
};

// The provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Only use hooks from other files inside a component
  const {
    user,
    company,
    isAuthenticated,
    isLoading,
    session,
    refreshUserProfile: handleRefreshUserProfile,
    registerInspector
  } = useAuthProvider();
  
  const {
    signIn,
    signUp,
    signOut,
  } = useAuthMethods();
  
  const refreshUserProfile = async () => {
    await handleRefreshUserProfile();
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
    refreshUserProfile,
    registerInspector
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
