import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/Context";
import AddToCartPopup from "../AddToCartPopup/AddToCartPopup";
import "./Cart.css";

export default function Cart() {
  const { callApiWithToken, updateCartCount, user, isUserReady, isLoggedIn } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // 🧩 Lấy dữ liệu giỏ hàng ban đầu
  const fetchCart = async () => {
    try {
      const data = await callApiWithToken(`${API_URL}/api/customer/get-cart`);
      const itemsWithStock = data.items.map((item) => ({
        ...item,
        stock: item.quantityBook ?? 0,
      }));
      setCart({ ...data, items: itemsWithStock });

      const total =
        data.totalQuantity ?? data.items?.reduce((s, i) => s + i.quantity, 0);
      updateCartCount(total);
    } catch (err) {
      console.error("❌ Lỗi khi lấy giỏ hàng:", err);
      setError("Không thể tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserReady && isLoggedIn) {
      fetchCart();
    } else if (isUserReady && !isLoggedIn) {
      setLoading(false);
      setCart(null);
    }
  }, [API_URL, isUserReady, isLoggedIn]);

  // 🧾 Cập nhật số lượng nhanh
  const updateQuantity = async (cartItemId, newQuantity, stock) => {
    if (newQuantity < 0) return;
    try {
      setUpdatingItemId(cartItemId);

      // ⚠️ Nếu vượt kho
      if (stock && newQuantity > stock) {
        setPopup({ message: `⚠️ Chỉ còn ${stock} sản phẩm trong kho!`, type: "warn" });
        setTimeout(() => setPopup(null), 1500);
        return;
      }

      // 🗑️ Nếu = 0 thì xóa
      if (newQuantity === 0) {
        await callApiWithToken(`${API_URL}/api/customer/cart-item`, {
          method: "DELETE",
          data: { cartItemIds: [cartItemId] },
        });
        setCart((prev) => ({
          ...prev,
          items: prev.items.filter((i) => i.idCartItem !== cartItemId),
        }));
        updateCartCount((prev) => Math.max(prev - 1, 0));
        return;
      }

      // ✅ Cập nhật backend
      await callApiWithToken(`${API_URL}/api/customer/update-Cart-item/${cartItemId}`, {
        method: "POST",
        data: { quantity: newQuantity },
      });

      // ✅ Cập nhật UI
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((i) =>
          i.idCartItem === cartItemId ? { ...i, quantity: newQuantity } : i
        ),
      }));

      const total = cart.items.reduce(
        (sum, i) =>
          i.idCartItem === cartItemId ? sum + newQuantity : sum + i.quantity,
        0
      );
      updateCartCount(total);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật số lượng:", err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  // 🗑️ Xóa sản phẩm
  const deleteItem = async (cartItemId) => {
    try {
      await callApiWithToken(`${API_URL}/api/customer/cart-item`, {
        method: "DELETE",
        data: { cartItemIds: [cartItemId] },
      });
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.idCartItem !== cartItemId),
      }));
      updateCartCount((prev) => Math.max(prev - 1, 0));
      setPopup({ message: "🗑️ Đã xóa sản phẩm khỏi giỏ hàng!", type: "success" });
    } catch (err) {
      console.error("❌ Lỗi khi xóa sản phẩm:", err);
      setPopup({ message: "❌ Không thể xóa sản phẩm!", type: "error" });
    } finally {
      setTimeout(() => setPopup(null), 1500);
    }
  };

  // ⚙️ Kiểm tra thông tin người dùng trước thanh toán
  const validateUserInfo = () => {
    if (!user) {
      setPopup({
        message: "⚠️ Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi thanh toán.",
        type: "warn",
        action: {
          label: "Đăng nhập ngay",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return false;
    }

    const fullName = user.fullName || user.name;
    const phone = user.phone || user.phoneNumber;
    const address = user.address;
    const email = user.email;

    const missing = [];
    if (!fullName?.trim()) missing.push("Họ tên");
    if (!phone?.trim()) missing.push("Số điện thoại");
    if (!address?.trim()) missing.push("Địa chỉ");
    if (!email?.trim()) missing.push("Email");

    if (missing.length > 0) {
      setPopup({
        message: `⚠️ Vui lòng cập nhật thông tin cá nhân trước khi thanh toán (thiếu: ${missing.join(", ")})`,
        type: "warn",
        action: {
          label: "Cập nhật ngay",
          onClick: () => (window.location.href = "/profile"),
        },
      });
      return false;
    }

    return true;
  };

  // 💳 Thanh toán
  const handlePayOrder = async () => {
    if (!validateUserInfo()) return;

    try {
      await callApiWithToken(`${API_URL}/api/customer/pay-order`, { method: "POST" });
      setCart({ items: [] });
      updateCartCount(0);

      setPopup({
        message: "✅ Thanh toán thành công! Đơn hàng đang được xử lý.",
        type: "success",
      });
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", err);
      setPopup({
        message: "❌ Thanh toán thất bại. Vui lòng thử lại sau!",
        type: "error",
      });
    } finally {
      setTimeout(() => setPopup(null), 2000);
    }
  };

  // 🧮 Loading / Error
  if (!isUserReady) return <div className="cart-loading">Đang tải thông tin người dùng...</div>;
  if (loading) return <div className="cart-loading">Đang tải giỏ hàng...</div>;
  if (error) return <div className="cart-error">{error}</div>;

  if (!isLoggedIn)
    return <div className="empty-cart">⚠️ Vui lòng đăng nhập để xem giỏ hàng của bạn.</div>;

  if (!cart || !cart.items || cart.items.length === 0)
    return <div className="empty-cart">🛒 Giỏ hàng của bạn đang trống.</div>;

  // ✅ Tính tổng realtime
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {popup && (
        <AddToCartPopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
          action={popup.action}
        />
      )}

      <div className="cart-container">
        {/* --- Bảng giỏ hàng --- */}
        <div className="cart-table">
          <div className="cart-header">
            <span>Sản phẩm</span>
            <span>Giá</span>
            <span>Số lượng</span>
            <span>Tạm tính</span>
          </div>
          <hr />

          {cart.items.map((item) => (
            <div key={item.idCartItem} className="cart-row">
              <div className="cart-product">
                <img src={item.thumbnail} alt={item.nameBook || "Book"} />
                <div>
                  <span>{item.nameBook || "Sách không có tiêu đề"}</span>
                  {item.stock && item.quantity >= item.stock && (
                    <p className="out-of-stock-msg">⚠️ Đã đạt giới hạn tồn kho</p>
                  )}
                </div>
              </div>

              <div className="cart-price">{item.price.toLocaleString("vi-VN")} ₫</div>

              <div className="cart-quantity">
                <button
                  disabled={updatingItemId === item.idCartItem}
                  onClick={() =>
                    updateQuantity(item.idCartItem, item.quantity - 1, item.stock)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  disabled={
                    updatingItemId === item.idCartItem ||
                    (item.stock && item.quantity >= item.stock)
                  }
                  onClick={() =>
                    updateQuantity(item.idCartItem, item.quantity + 1, item.stock)
                  }
                >
                  +
                </button>
              </div>

              <div className="cart-total">
                {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
              </div>

              <button className="btn-remove" onClick={() => deleteItem(item.idCartItem)}>
                Xóa
              </button>
            </div>
          ))}
        </div>

        {/* --- Tổng kết --- */}
        <div className="cart-summary">
          <h3>Cộng giỏ hàng</h3>
          <hr />
          <div className="summary-row">
            <span>Tổng sản phẩm</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="summary-row">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
          </div>
          <div className="summary-row total">
            <strong>Tổng</strong>
            <strong>{subtotal.toLocaleString("vi-VN")} ₫</strong>
          </div>
          <button className="btn-checkout" onClick={handlePayOrder}>
            Thanh toán
          </button>
        </div>
      </div>
    </>
  );
}
