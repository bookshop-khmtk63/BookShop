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

  // ==================== Login / Logout ====================
  const login = (accessToken, userData) => {
    setIsLoggedIn(true);
    setToken(accessToken);
    setUser(userData);

    localStorage.setItem("accessToken", accessToken);
    Cookies.set("token", accessToken, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

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
    Cookies.remove("refresh_token");
    Cookies.remove("user");
    console.log("👋 Đã đăng xuất & xóa token.");
  };

  // ==================== Axios Instance ====================
  const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // BẮT BUỘC: để gửi cookie refresh_token
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

  // ==================== Refresh Token (chuẩn theo ảnh) ====================
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Nếu token hết hạn → gọi refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url.includes("/auth/refresh-token")) {
          console.warn("🚫 Refresh token 401 — logout.");
          await logout();
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        console.log("🔄 401 detected → Refreshing token (qua cookie)...");

        try {
          // ✅ Trình duyệt sẽ tự gửi cookie refresh_token
          const refreshResponse = await axios.post(
            `${API_URL}/api/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          // ✅ Backend trả về access_token mới
          const newAccessToken =
            refreshResponse.data.access_token ||
            refreshResponse.data.token ||
            refreshResponse.data.data?.accessToken;

          if (!newAccessToken) throw new Error("Không có access token mới!");

          // ✅ Cập nhật token
          Cookies.set("token", newAccessToken, {
            expires: 7,
            secure: true,
            sameSite: "Strict",
          });
          localStorage.setItem("accessToken", newAccessToken);
          setToken(newAccessToken);

          // ✅ Cập nhật lại headers
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          console.log("✅ Token mới đã được refresh thành công.");

          // 🔁 Thử lại request ban đầu
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
   // ✅ Lấy tổng số lượng sản phẩm trong giỏ hàng (chuẩn backend)
const updateCartCount = async () => {
  if (!token) {
    setCartCount(0);
    return;
  }

  try {
    const res = await callApiWithToken(`${API_URL}/api/customer/get-cart`);

    // Backend trả { data: { totalQuantity, items: [...] } }
    const cartData = res?.data || res; // đề phòng backend thay đổi format

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