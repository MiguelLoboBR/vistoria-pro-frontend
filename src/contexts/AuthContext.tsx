import React, { createContext, useContext, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { Company, UserProfile } from "./types";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import { useAuthMethods } from "@/hooks/useAuth";
import { useInRouterContext } from "react-router-dom";

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
  registerInspector: (
    email: string,
    password: string,
    fullName: string,
    companyId: string
  ) => Promise<UserProfile | null>;
}

// Cria o contexto com valor inicial undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const inRouter = useInRouterContext();

  // Garante que o Router esteja disponível antes de usar hooks que dependem dele
  if (!inRouter) return null; // ou um fallback visual, como <Loading />

  const {
    user,
    company,
    isAuthenticated,
    isLoading,
    session,
    refreshUserProfile: handleRefreshUserProfile,
    registerInspector,
  } = useAuthProvider();

  const authMethods = useAuthMethods();

  const refreshUserProfile = async () => {
    await handleRefreshUserProfile();
  };

  const value: AuthContextType = {
    user,
    company,
    isAuthenticated,
    isLoading,
    session,
    signIn: authMethods.signIn,
    signUp: authMethods.signUp,
    signOut: authMethods.signOut,
    refreshUserProfile,
    registerInspector,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
