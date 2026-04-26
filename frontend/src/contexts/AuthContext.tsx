import React, { createContext, useState, useCallback } from "react";
import API from "../services/api";
import {
  type User,
  type AuthContextType,
  type LoginRequest,
  type RegisterRequest,
  type AuthResponse,
} from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialUser = (): User | null => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const lastActivity = localStorage.getItem("lastActivity");

  if (token && userData) {
    if (lastActivity) {
      const lastActivityTime = parseInt(lastActivity);
      const now = Date.now();
      const timeoutMs = 30 * 60 * 1000;

      if (now - lastActivityTime > timeoutMs) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastActivity");
        return null;
      }
    }

    try {
      return JSON.parse(userData) as User;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lastActivity");
      return null;
    }
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [loading, setLoading] = useState(false);

  const updateLastActivity = useCallback(() => {
    localStorage.setItem("lastActivity", Date.now().toString());
  }, []);

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, ...userData };
        localStorage.setItem("user", JSON.stringify(updated));
        updateLastActivity();
        return updated;
      });
    },
    [updateLastActivity]
  );

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const request: LoginRequest = { email, password };
      const response = await API.post<AuthResponse>("/users/login", request);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      updateLastActivity();
      setUser(response.data);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    name?: string
  ) => {
    setLoading(true);
    try {
      const request: RegisterRequest = { email, password, username, name };
      const response = await API.post<AuthResponse>("/users/register", request);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      updateLastActivity();
      setUser(response.data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
