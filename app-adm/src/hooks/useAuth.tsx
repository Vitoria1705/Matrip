import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminUser {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  login: (user: AdminUser) => void;
  logout: () => void;
}

const STORAGE_KEY = "matrip_admin_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AdminUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(readStoredUser());

  const login = (newUser: AdminUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return ctx;
}
