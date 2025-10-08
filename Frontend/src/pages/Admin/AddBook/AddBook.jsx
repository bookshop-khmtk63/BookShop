import React, { useState } from "react";
import { useAuth } from "../../../Context/Context";
import "./AddBook.css";

export default function AddBook() {
  const { callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL; // ✅ Lấy từ .env

  const [formData, setFormData] = useState({
    nameBook: "",
    price: "",
    quantity: 1,
    description: "",
    idAuthor: "",
    idsCategory: [],
    imageFile: null,
    imagePreview: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  // ==================== Quantity ====================
  const handleDecrease = () => {
    setFormData((prev) => ({
      ...prev,
      quantity: prev.quantity > 1 ? prev.quantity - 1 : 1,
    }));
  };

  const handleIncrease = () => {
    setFormData((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0)
      setFormData((prev) => ({ ...prev, quantity: value }));
    else if (e.target.value === "")
      setFormData((prev) => ({ ...prev, quantity: "" }));
  };

  const handleQuantityBlur = () => {
    if (!formData.quantity || formData.quantity <= 0)
      setFormData((prev) => ({ ...prev, quantity: 1 }));
  };

  // ==================== Input ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==================== File ====================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  // ==================== Submit ====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nameBook ||
      !formData.price ||
      !formData.idAuthor ||
      !formData.idsCategory.length
    ) {
      setMessageType("error");
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin bắt buộc!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    try {
      const url = `${API_URL}/admin/create-book`;
      const form = new FormData();

      const payload = {
        nameBook: formData.nameBook,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        description: formData.description || "",
        idAuthor: Number(formData.idAuthor),
        idsCategory: formData.idsCategory.map(Number),
      };
      form.append(
        "createBookRequest",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      if (formData.imageFile) form.append("thumbnail", formData.imageFile);

      await callApiWithToken(url, { method: "POST", body: form }, true);

      setMessageType("success");
      setMessage("✅ Thêm sách thành công!");
      setTimeout(() => setMessage(""), 3000);

      setFormData({
        nameBook: "",
        price: "",
        quantity: 1,
        description: "",
        idAuthor: "",
        idsCategory: [],
        imageFile: null,
        imagePreview: "",
      });
    } catch (err) {
      console.error("❌ Lỗi khi thêm sách:", err);
      setMessageType("error");
      setMessage("❌ Thêm sách thất bại. Vui lòng thử lại!");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-page">
      <h2 className="page-title">Thêm sách</h2>

      <form className="add-book-form" onSubmit={handleSubmit}>
        <div className="left-form">
          <label>Tên sách</label>
          <input
            name="nameBook"
            placeholder="Nhập tên sách"
            value={formData.nameBook}
            onChange={handleChange}
          />

          <label>ID tác giả</label>
          <input
            name="idAuthor"
            placeholder="Nhập ID tác giả"
            type="number"
            value={formData.idAuthor}
            onChange={handleChange}
          />

          <label>ID thể loại (vd: 1,2,3)</label>
          <input
            name="idsCategory"
            placeholder="Nhập ID thể loại"
            value={formData.idsCategory.join(",")}
            onChange={(e) => {
              const ids = e.target.value
                .split(",")
                .map((v) => parseInt(v.trim(), 10))
                .filter((v) => !isNaN(v));
              setFormData((prev) => ({ ...prev, idsCategory: ids }));
            }}
          />

          <label>Giá</label>
          <input
            name="price"
            placeholder="Nhập giá sách"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />

          <label>Số lượng</label>
          <div className="quantity">
            <button type="button" onClick={handleDecrease}>-</button>
            <input
              type="text"
              value={formData.quantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
            />
            <button type="button" onClick={handleIncrease}>+</button>
          </div>
        </div>

        <div className="right-form">
          <label>Mô tả</label>
          <textarea
            name="description"
            placeholder="Giới thiệu thông tin sách"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Ảnh bìa</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {formData.imagePreview && (
            <img
              src={formData.imagePreview}
              alt="Preview"
              className="preview-image"
            />
          )}
        </div>

        {message && (
          <div className={`message-box ${messageType}`}>{message}</div>
        )}

        <div className="form-footer">
          <button type="submit" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm sách"}
          </button>
        </div>
      </form>
    </div>
  );
}
