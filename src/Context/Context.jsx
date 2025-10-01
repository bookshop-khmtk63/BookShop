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

  // Khi app load, đọc token + user từ localStorage
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

  // login
  const login = (accessToken, userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
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

  // refresh token
  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.data) {
        const newToken = data.data.accessToken;
        const userData = {
          fullName: data.data.fullName,
          email: data.data.email,
          phone: data.data.phone,
          address: data.data.address,
          role: data.data.role,
        };
        login(newToken, userData);
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
