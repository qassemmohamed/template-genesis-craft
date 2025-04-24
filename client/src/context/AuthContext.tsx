/* eslint-disable react-refresh/only-export-components */
"use client";

import { api } from "@/utils/api";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";

// Define types for the user and authentication context
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
  fullName?: string;
  enabledFeatures?: string[];
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  hasFeature: (featureCode: string) => boolean;
}

interface LoginCredentials {
  username: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null,
  );

  // Helper function to handle avatar persistence
  const updateUserWithAvatar = (userData: User, avatarUrl?: string): User => {
    // Get stored avatar from localStorage
    const storedAvatar = localStorage.getItem("userAvatar");

    // Determine which avatar URL to use
    const finalAvatarUrl =
      avatarUrl || userData.avatarUrl || storedAvatar || undefined;

    // If we have a valid avatar URL, store it in localStorage
    if (finalAvatarUrl) {
      localStorage.setItem("userAvatar", finalAvatarUrl);
      console.log("Avatar URL stored in localStorage:", finalAvatarUrl);
    }

    // Return updated user data with the avatar URL
    return {
      ...userData,
      avatarUrl: finalAvatarUrl,
    };
  };

  // Feature access check
  const hasFeature = (featureCode: string): boolean => {
    if (!user || !user.enabledFeatures) return false;

    // Admin and owner roles have access to all features
    if (user.role === "admin" || user.role === "owner") return true;

    return user.enabledFeatures.includes(featureCode);
  };

  const refreshUserData = async (): Promise<void> => {
    if (!token) return;

    try {
      const response = await api.get("/auth/me");
      let userData = response.data;

      // Fetch profile to get avatar
      try {
        const profileResponse = await api.get("/profile/me");
        if (profileResponse.data.profile) {
          const avatarUrl = profileResponse.data.profile.avatarUrl;
          const fullName = profileResponse.data.profile.fullName;

          // Update user data with profile information
          userData = {
            ...userData,
            fullName,
          };

          // Apply avatar persistence logic
          userData = updateUserWithAvatar(userData, avatarUrl);
        } else {
          // If no profile data, still apply avatar persistence
          userData = updateUserWithAvatar(userData);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Even if profile fetch fails, apply avatar persistence
        userData = updateUserWithAvatar(userData);
      }

      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user data:", error);
      logout();
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get("/auth/me");
          let userData = response.data;
          setIsAuthenticated(true);

          // Fetch profile to get avatar
          try {
            const profileResponse = await api.get("/profile/me");
            if (profileResponse.data.profile) {
              const avatarUrl = profileResponse.data.profile.avatarUrl;
              const fullName = profileResponse.data.profile.fullName;

              // Update user data with profile information
              userData = {
                ...userData,
                fullName,
              };

              // Apply avatar persistence logic
              userData = updateUserWithAvatar(userData, avatarUrl);
            } else {
              // If no profile data, still apply avatar persistence
              userData = updateUserWithAvatar(userData);
            }
          } catch (err) {
            console.error("Error fetching profile:", err);
            // Even if profile fetch fails, apply avatar persistence
            userData = updateUserWithAvatar(userData);
          }

          setUser(userData);
        } catch (error) {
          console.error("Authentication error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", credentials);
      const { token, ...userData } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      // Apply avatar persistence logic
      const updatedUserData = updateUserWithAvatar(userData);
      setUser(updatedUserData);
      setIsAuthenticated(true);

      // After login, fetch profile to get the latest avatar
      try {
        const profileResponse = await api.get("/profile/me");
        if (profileResponse.data.profile) {
          const avatarUrl = profileResponse.data.profile.avatarUrl;
          const fullName = profileResponse.data.profile.fullName;

          // Update user with profile data
          const userWithProfile = {
            ...updatedUserData,
            avatarUrl,
            fullName,
          };

          // Apply avatar persistence logic again
          const finalUserData = updateUserWithAvatar(
            userWithProfile,
            avatarUrl,
          );
          setUser(finalUserData);
        }
      } catch (err) {
        console.error("Error fetching profile after login:", err);
      }

      toast.success("Login successful");

      // Navigate based on role
      if (userData.role === "admin" || userData.role === "owner") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/client";
      }

      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    // Don't remove userAvatar on logout to persist it across sessions
    // localStorage.removeItem("userAvatar");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");

    // Redirect to home page
    window.location.href = "/";
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshUserData,
    hasFeature,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
