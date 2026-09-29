import { createContext, useContext, useState, type ReactNode } from "react";

interface ParceiroUser {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

interface AuthContextValue {
  user: ParceiroUser | null;
  login: (user: ParceiroUser) => void;
  logout: () => void;
}

const STORAGE_KEY = "matrip_parceiro_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): ParceiroUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ParceiroUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ParceiroUser | null>(readStoredUser());

  const login = (newUser: ParceiroUser) => {
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
