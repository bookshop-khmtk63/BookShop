import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/Context";
import AddToCartPopup from "../AddToCartPopup/AddToCartPopup";
import "./Cart.css";

export default function Cart() {
  const { callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // 🧩 Lấy dữ liệu giỏ hàng từ API
  const fetchCart = async () => {
    try {
      const data = await callApiWithToken(`${API_URL}/api/customer/get-cart`);

      // 🔹 Gọi thêm API lấy tồn kho từng sách (song song)
      const itemsWithStock = await Promise.all(
        data.items.map(async (item) => {
          try {
            const bookData = await callApiWithToken(`${API_URL}/api/book/${item.idBook}`);
            return { ...item, stock: bookData.number }; // gắn tồn kho
          } catch {
            return { ...item, stock: null };
          }
        })
      );

      setCart({ ...data, items: itemsWithStock });
    } catch (err) {
      console.error("❌ Lỗi khi lấy giỏ hàng:", err);
      setError("Không thể tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [API_URL]);

  // 🧾 Cập nhật số lượng
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingItemId(cartItemId);
      await callApiWithToken(`${API_URL}/api/customer/update-Cart-item/${cartItemId}`, {
        method: "POST",
        data: { quantity: newQuantity },
      });
      setPopup({ message: "✅ Cập nhật số lượng thành công!", type: "success" });
      await fetchCart();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật số lượng:", err);
      setPopup({
        message: "❌ Không thể cập nhật số lượng sản phẩm!",
        type: "error",
      });
    } finally {
      setUpdatingItemId(null);
      setTimeout(() => setPopup(null), 1500);
    }
  };

  // 🗑️ Xóa sản phẩm
  const deleteItem = async (cartItemId) => {
    try {
      await callApiWithToken(`${API_URL}/api/customer/cart-item`, {
        method: "DELETE",
        data: { cartItemIds: [cartItemId] },
      });

      setPopup({ message: "🗑️ Đã xóa sản phẩm khỏi giỏ hàng!", type: "success" });
      await fetchCart();
    } catch (err) {
      console.error("❌ Lỗi khi xóa sản phẩm:", err);
      setPopup({
        message: "❌ Không thể xóa sản phẩm khỏi giỏ hàng!",
        type: "error",
      });
    } finally {
      setTimeout(() => setPopup(null), 1500);
    }
  };

  // 🧾 Thanh toán giỏ hàng
  const handlePayOrder = async () => {
    try {
      await callApiWithToken(`${API_URL}/api/customer/pay-order`, { method: "POST" });
      setPopup({
        message: "✅ Thanh toán thành công! Đơn hàng đang được xử lý.",
        type: "success",
      });
      setTimeout(() => {
        setPopup(null);
        fetchCart();
      }, 2000);
    } catch (err) {
      console.error("❌ Lỗi thanh toán:", err);
      setPopup({
        message: "❌ Thanh toán thất bại. Vui lòng thử lại sau!",
        type: "error",
      });
    }
  };

  // 🧮 Trạng thái loading / lỗi
  if (loading) return <div className="cart-loading">Đang tải giỏ hàng...</div>;
  if (error) return <div className="cart-error">{error}</div>;
  if (!cart || !cart.items || cart.items.length === 0)
    return <div className="empty-cart">Giỏ hàng của bạn đang trống.</div>;

  const subtotal = cart.totalPrice || 0;

  return (
    <>
      {popup && (
        <AddToCartPopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
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

              <div className="cart-price">
                {item.price.toLocaleString("vi-VN")} ₫
              </div>

              <div className="cart-quantity">
                <button
                  disabled={item.quantity <= 1 || updatingItemId === item.idCartItem}
                  onClick={() => updateQuantity(item.idCartItem, item.quantity - 1)}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  disabled={
                    updatingItemId === item.idCartItem ||
                    (item.stock && item.quantity >= item.stock)
                  }
                  onClick={() => updateQuantity(item.idCartItem, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="cart-total">
                {(item.totalPrice || item.price * item.quantity).toLocaleString("vi-VN")} ₫
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
            <span>{cart.totalQuantity}</span>
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
