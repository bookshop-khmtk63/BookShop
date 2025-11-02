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
  const [cartCount, setCartCount] = useState(0);

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
    const storedToken =
      Cookies.get("token") || localStorage.getItem("accessToken");
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

  // ==================== Login ====================
  const login = (accessToken, userData, refreshToken) => {
    setIsLoggedIn(true);
    setToken(accessToken);
    setUser(userData);

    // ✅ Lưu cả access token và refresh token
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refresh_token", refreshToken);

    Cookies.set("token", accessToken, {
      expires: 0.5, // 12 giờ
      secure: true,
      sameSite: "None",
    });

    console.log("🍪 Token đã lưu:", accessToken);
  };

  // ==================== Logout ====================
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
    Cookies.remove("refresh_token");
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
      const currentToken =
        Cookies.get("token") || localStorage.getItem("accessToken");
      if (currentToken) {
        config.headers["Authorization"] = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ==================== Refresh Token ====================
  const refreshAccessToken = async () => {
    try {
      const storedRefresh = localStorage.getItem("refresh_token");
      if (!storedRefresh) throw new Error("Không tìm thấy refresh token!");

      const refreshResponse = await axios.post(
        `${API_URL}/api/auth/refresh-token`,
        { refresh_token: storedRefresh }, // 👈 gửi trong body
        { withCredentials: true }
      );

      const newAccessToken = refreshResponse.data.access_token;
      if (!newAccessToken) throw new Error("Không có access token mới!");

      Cookies.set("token", newAccessToken, {
        expires: 0.5,
        secure: true,
        sameSite: "None",
      });
      localStorage.setItem("accessToken", newAccessToken);
      setToken(newAccessToken);

      console.log("✅ Token mới đã được refresh thành công.");
      return newAccessToken;
    } catch (error) {
      console.error("❌ Refresh thất bại:", error);
      await logout();
      throw error;
    }
  };

  // ==================== Axios Response Interceptor ====================
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url.includes("/auth/refresh-token")) {
          console.warn("🚫 Refresh token 401 — logout.");
          await logout();
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        console.log("🔄 401 detected → Refreshing token...");

        try {
          const newAccessToken = await refreshAccessToken();
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
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
      const currentToken =
        Cookies.get("token") || localStorage.getItem("accessToken");
      const response = await axiosInstance({
        url: endpoint,
        method: options.method || "GET",
        data: options.body || options.data || {},
        headers: {
          Authorization: `Bearer ${currentToken}`,
          ...(options.headers || {}),
        },
      });

      const resData = response.data;
      if (resData?.data) return resData.data;
      if (resData?.result) return resData.result;
      return resData;
    } catch (err) {
      console.error("❌ API call error:", err);
      throw err;
    }
  };

  // ==================== Lấy tổng sản phẩm giỏ hàng ====================
  const updateCartCount = async () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await callApiWithToken(`${API_URL}/api/customer/get-cart`);
      const cartData = res?.data || res;

      if (cartData?.items !== undefined) {
        setCartCount(cartData.items.length);
      } else if (Array.isArray(cartData?.items)) {
        const total = cartData.items.reduce((sum, i) => sum + (i.quantity || 1), 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("❌ Không thể lấy giỏ hàng:", error);
      setCartCount(0);
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
        cartCount,
        setCartCount,
        updateCartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
