import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      const savedToken = localStorage.getItem("rentflow_token");
      const savedUser = localStorage.getItem("rentflow_user");

      if (savedToken) {
        try {
          setToken(savedToken);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
          const freshUser = await profileService.getProfile();
          setUser(freshUser);
          localStorage.setItem("rentflow_user", JSON.stringify(freshUser));
        } catch {
          localStorage.removeItem("rentflow_token");
          localStorage.removeItem("rentflow_user");
          localStorage.removeItem("rentflow_refresh_token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    restoreSession();
  }, []);


  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem("rentflow_token", result.token);
    localStorage.setItem("rentflow_user", JSON.stringify(result.user));
    return result;
  }, []);

  const register = useCallback(async (data) => {
    const result = await authService.register(data);
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem("rentflow_token", result.token);
    localStorage.setItem("rentflow_user", JSON.stringify(result.user));
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Logout even if API fails
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("rentflow_token");
    localStorage.removeItem("rentflow_user");
  }, []);

  const updateProfile = useCallback(async (data) => {
    const updatedUser = await profileService.updateProfile(data);
    setUser(updatedUser);
    localStorage.setItem("rentflow_user", JSON.stringify(updatedUser));
    return updatedUser;
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
