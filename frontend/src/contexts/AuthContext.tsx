import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service.ts";
import { User, LoginCredentials, RegisterCredentials } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, isAdmin, setAuth, clearAuth, isLoading } = useAuthStore();
  const { toast } = useToast();

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      await authService.login(credentials);
      const user = await userService.getCurrentUser();

      if (user) {
        setAuth(user);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${user.name}`
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive"
      });
      throw error;
    }
  }, [setAuth, toast]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      await authService.register(credentials);
      const user = await userService.getCurrentUser();

      if (user) {
        setAuth(user);
        toast({
          title: "Account created!",
          description: `Welcome, ${user.name}!`
        });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive"
      });
      throw error;
    }
  }, [setAuth, toast]);

  const logout = useCallback(() => {
    clearAuth();
    toast({
      title: "Logged out",
      description: "See you next time!"
    });
  }, [clearAuth, toast]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
