import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app initialization
    const storedToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
      // In a real app, you'd validate the token and fetch user data
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'admin'
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, remember: boolean = false) => {
    try {
      // Replace with your actual API call
      const response = await new Promise<{ accessToken: string; user: User }>((resolve) => {
        setTimeout(() => {
          resolve({
            accessToken: 'mock-jwt-token-' + Date.now(),
            user: {
              id: '1',
              email,
              name: 'John Doe',
              role: 'admin'
            }
          });
        }, 1000);
      });

      const { accessToken, user: userData } = response;
      
      setToken(accessToken);
      setUser(userData);

      // Store token based on remember preference
      if (remember) {
        localStorage.setItem('accessToken', accessToken);
      } else {
        sessionStorage.setItem('accessToken', accessToken);
      }
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      // Replace with your actual API call
      const response = await new Promise<{ accessToken: string; user: User }>((resolve) => {
        setTimeout(() => {
          resolve({
            accessToken: 'mock-jwt-token-' + Date.now(),
            user: {
              id: '1',
              email,
              name,
              role: 'admin'
            }
          });
        }, 1500);
      });

      const { accessToken, user: userData } = response;
      
      setToken(accessToken);
      setUser(userData);
      sessionStorage.setItem('accessToken', accessToken);
    } catch (error) {
      throw new Error('Sign up failed');
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Replace with your actual Google OAuth implementation
      // This would typically open a popup or redirect to Google OAuth
      const response = await new Promise<{ accessToken: string; user: User }>((resolve) => {
        setTimeout(() => {
          resolve({
            accessToken: 'mock-google-jwt-token-' + Date.now(),
            user: {
              id: '1',
              email: 'user@gmail.com',
              name: 'Google User',
              role: 'admin'
            }
          });
        }, 2000);
      });

      const { accessToken, user: userData } = response;
      
      setToken(accessToken);
      setUser(userData);
      sessionStorage.setItem('accessToken', accessToken);
    } catch (error) {
      throw new Error('Google sign in failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
  };

  const value = {
    user,
    token,
    login,
    signUp,
    loginWithGoogle,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}