"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MockUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: MockUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: MockUser = {
  id: "mock-user-123",
  email: "demo@lumiin.app",
  name: "Demo User",
};

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(MOCK_USER);
  const [isLoaded] = useState(true);

  const signIn = () => setUser(MOCK_USER);
  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isSignedIn: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within MockAuthProvider");
  }
  return context;
}
