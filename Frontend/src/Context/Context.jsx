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

  // ==================== Helpers ====================
  const setUser = (userData) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Khi app load lại → kiểm tra token trong localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUserState(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (err) {
        console.error("❌ Lỗi khi parse user từ localStorage:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
    setIsLoading(false);
  }, []);

  // ==================== Login / Logout ====================
  const login = (accessToken, userData) => {
    setIsLoggedIn(true);
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // để xóa refreshToken cookie
      });
    } catch (err) {
      console.error("❌ Logout error:", err);
    }

    // Xóa toàn bộ thông tin local
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  // ==================== Refresh Token ====================
  const refreshToken = async () => {
    try {
      console.log("🔄 Đang gọi refresh token...");

      const res = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: "POST",
        credentials: "include", // gửi cookie refreshToken
      });

      if (!res.ok) {
        console.error("❌ Refresh token thất bại:", res.status);
        await logout();
        return null;
      }

      const data = await res.json();
      const newAccessToken =
        data.access_token || data.token || data.data?.accessToken;

      if (!newAccessToken) throw new Error("Không có accessToken trong response");

      // Cập nhật token mới
      setToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);

      console.log("✅ Refresh token thành công!");
      return newAccessToken;
    } catch (err) {
      console.error("❌ Refresh token error:", err);
      await logout();
      return null;
    }
  };

  // ==================== API Call Wrapper ====================
  const callApiWithToken = async (url, options = {}, isMultipart = false) => {
    let currentToken = token;
  
    const fetchOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${currentToken}`,
      },
      credentials: "include",
    };
  
    // Nếu không phải multipart → thêm Content-Type JSON
    if (!isMultipart) {
      fetchOptions.headers["Content-Type"] = "application/json";
    }
  
    try {
      let res = await fetch(url, fetchOptions);
  
      // Nếu token hết hạn → refresh
      if (res.status === 401) {
        console.warn("⚠️ Access token hết hạn, thử refresh...");
  
        currentToken = await refreshToken();
        if (!currentToken) throw new Error("Token hết hạn và refresh thất bại");
  
        res = await fetch(url, {
          ...fetchOptions,
          headers: { ...fetchOptions.headers, Authorization: `Bearer ${currentToken}` },
        });
      }
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi gọi API");
  
      return data?.data || data;
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
        callApiWithToken,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
