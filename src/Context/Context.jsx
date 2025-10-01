import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = (accessToken, userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const newToken = data.data.accessToken;
        login(newToken, { email: data.data.email, role: data.data.role });
        return newToken;
      } else {
        logout();
        return null;
      }
    } catch (err) {
      console.error("Refresh token error:", err);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        login,
        logout,
        refreshToken,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
