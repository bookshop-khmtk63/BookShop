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

  // Load trạng thái đăng nhập từ localStorage khi app khởi động
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  // login với accessToken và thông tin user
  const login = (accessToken, userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // logout, xóa token và user khỏi localStorage
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // refresh token nếu API cung cấp refresh-token
  const refreshToken = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.data?.accessToken) {
        login(data.data.accessToken, {
          email: data.data.email,
          role: data.data.role,
        });
        return data.data.accessToken;
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
