import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from './useFirebase';

type Role = 'admin' | 'read' | null;

interface AuthContextType {
  role: Role;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const settings = useSettings();

  useEffect(() => {
    const savedRole = localStorage.getItem('app_role') as Role;
    if (savedRole) {
      setRole(savedRole);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string) => {
    const adminPass = settings?.adminPassword || 'Accessadmin';
    const readPass = settings?.readPassword || 'readaccess';

    if (password === adminPass) {
      setRole('admin');
      localStorage.setItem('app_role', 'admin');
      return true;
    } else if (password === readPass) {
      setRole('read');
      localStorage.setItem('app_role', 'read');
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('app_role');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
