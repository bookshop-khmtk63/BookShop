import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUserState] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // ==================== LocalStorage helpers ====================
  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Load token + user từ localStorage khi app khởi động
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUserState(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (err) {
        console.error("❌ User trong localStorage bị lỗi, xoá luôn.", err);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
    setIsLoading(false);
  }, []);

  // ==================== Auth Actions ====================
  const login = (accessToken, userData) => {
    setIsLoggedIn(true);
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
      }
    } catch (err) {
      console.error("❌ Logout error:", err);
    }

    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // ==================== Refresh Token ====================
  const refreshToken = async () => {
    try {
      console.log("🔄 Attempting to refresh token...");

      const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "POST",
        credentials: "include", // gửi cookie refreshToken
      });

      if (!res.ok) {
        console.error("❌ Refresh token failed:", res.status);
        logout();
        return null;
      }

      const data = await res.json();
      console.log("✅ Refresh token response:", data);

      const newAccessToken =
        data.access_token || data.token || data.data?.accessToken;

      if (!newAccessToken)
        throw new Error("No access token in refresh response");

      // Cập nhật state + localStorage
      setToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);

      return newAccessToken;
    } catch (err) {
      console.error("Refresh token error:", err);
      logout();
      return null;
    }
  };

  // ==================== API Call Wrapper ====================
  const callApiWithToken = async (url, options = {}) => {
    let currentToken = token;

    const fetchOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${currentToken}`,
      },
      credentials: "include", // để backend nhận cookie refreshToken
    };

    try {
      let res = await fetch(url, fetchOptions);

      // Nếu accessToken hết hạn → 401 → thử refresh
      if (res.status === 401) {
        console.warn("⚠️ Access token expired, refreshing...");

        currentToken = await refreshToken();

        if (!currentToken) {
          throw new Error("Token hết hạn và refresh không thành công.");
        }

        // Gọi lại API với token mới
        res = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${currentToken}`,
          },
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "API call failed");
      }

      return { res, data };
    } catch (err) {
      console.error("❌ API call error:", err);
      throw err;
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
        callApiWithToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
