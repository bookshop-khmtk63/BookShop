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
        localStorage.clear();
        Cookies.remove("token");
        Cookies.remove("user");
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
    Cookies.set("token", accessToken, { expires: 7, secure: true, sameSite: "Strict" });

    console.log("🍪 Token đã lưu:", accessToken);
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn("⚠️ Logout error:", err);
    }

    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    localStorage.clear();
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    console.log("👋 Đã đăng xuất & xóa token.");
  };

  // ==================== Axios Instance ====================
  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const currentToken = Cookies.get("token") || localStorage.getItem("accessToken");
      if (currentToken) {
        config.headers["Authorization"] = `Bearer ${currentToken}`;
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

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url.includes("/auth/refresh-token")) {
          console.warn("🚫 Refresh token bị 401 — logout.");
          await logout();
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        console.log("🔄 401 detected → Refreshing token...");

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

          // ✅ Lưu token mới
          Cookies.set("token", newAccessToken, { expires: 7, secure: true, sameSite: "Strict" });
          localStorage.setItem("accessToken", newAccessToken);
          setToken(newAccessToken);

          // ✅ Cập nhật headers
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          console.log("✅ Token mới đã được refresh thành công.");

          // 🔁 Gọi lại request cũ
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
  // ==================== API Call Wrapper ====================
const callApiWithToken = async (endpoint, options = {}) => {
  try {
    const currentToken = Cookies.get("token") || localStorage.getItem("accessToken");
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || "GET",
      data: options.body || options.data || {},
      headers: {
        "Authorization": `Bearer ${currentToken}`,
        ...(options.headers || {}),
      },
    });

    // ✅ Chuẩn hóa dữ liệu trả về để tương thích với mọi API
    const resData = response.data;
    if (resData?.data) return resData.data;
    if (resData?.result) return resData.result;
    return resData; // fallback nếu API trả trực tiếp object
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
