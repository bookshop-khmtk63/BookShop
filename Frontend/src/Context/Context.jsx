import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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
      Cookies.set("user", JSON.stringify(userData), { expires: 7 });
    } else {
      localStorage.removeItem("user");
      Cookies.remove("user");
    }
  };

  useEffect(() => {
    const storedToken = Cookies.get("token") || localStorage.getItem("accessToken");
    const storedUser = Cookies.get("user") || localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUserState(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (err) {
        console.error("❌ Lỗi khi parse user:", err);
        localStorage.removeItem("user");
        Cookies.remove("user");
        localStorage.removeItem("accessToken");
        Cookies.remove("token");
      }
    }

    setIsLoading(false);
  }, []);

  // ==================== Login / Logout ====================
  const login = (accessToken, userData) => {
    setIsLoggedIn(true);
    setToken(accessToken);
    setUser(userData);

    // ✅ Lưu vào localStorage
    localStorage.setItem("accessToken", accessToken);

    // ✅ Lưu token vào cookie
    Cookies.set("token", accessToken, { expires: 7, secure: true, sameSite: "Strict" });

    console.log("🍪 Token đã lưu vào cookie:", Cookies.get("token"));
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("❌ Logout error:", err);
    }

    setIsLoggedIn(false);
    setToken(null);
    setUser(null);

    // ✅ Xóa toàn bộ dữ liệu xác thực
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");

    console.log("👋 Đã đăng xuất & xóa toàn bộ token + cookie.");
  };

  // ==================== Axios Instance ====================
  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  // ✅ Gắn token vào mọi request
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = Cookies.get("token") || localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ==================== Refresh Token Interceptor ====================
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      // Nếu 401 và chưa retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url.includes("/auth/refresh-token")) {
          console.warn("🚫 Refresh token bị 401 — logout.");
          await logout();
          return Promise.reject(error);
        }
  
        originalRequest._retry = true;
        console.log("🔄 401 detected → Trying to refresh token...");
  
        try {
          const refreshResponse = await axios.post(
            `${API_URL}/api/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
  
          const newAccessToken =
            refreshResponse.data.access_token ||
            refreshResponse.data.token ||
            refreshResponse.data.data?.accessToken;
  
          if (!newAccessToken) throw new Error("Không có access token mới!");
  
          // ✅ Lưu token mới vào cookie + localStorage
          Cookies.set("token", newAccessToken, { expires: 7, secure: true, sameSite: "Strict" });
          localStorage.setItem("accessToken", newAccessToken);
          setToken(newAccessToken);
  
          // ✅ Cập nhật token vào axios instance (rất quan trọng)
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
  
          console.log("✅ Token mới đã được refresh và lưu lại cookie + localStorage.");
  
          // ✅ Gọi lại request cũ bằng axiosInstance
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("❌ Refresh thất bại:", refreshError);
          await logout();
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  

  // ==================== API Call Wrapper ====================
  const callApiWithToken = async (endpoint, options = {}) => {
    try {
      const response = await axiosInstance({
        url: endpoint,
        method: options.method || "GET",
        data: options.body || options.data || {},
        headers: options.headers || {},
      });
      return response.data?.data || response.data;
    } catch (err) {
      console.error("❌ API call error:", err);
      throw err;
    }
  };

  // ==================== Provider ====================
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        login,
        logout,
        callApiWithToken,
        setUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
