import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Context/Context";
import "./AddBook.css";

export default function AddBook() {
  const { callApiWithToken } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});

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

  // ==================== Fetch Authors & Categories ====================
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await callApiWithToken("/api/admin/get-all-author", { method: "GET" });
        const data = res?.data || res;
        const mapped = Array.isArray(data)
          ? data.map((a) => ({ idAuthor: a.idAuthor, author: a.author }))
          : [];
        setAuthors(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi tải tác giả:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await callApiWithToken("/api/books/category", { method: "GET" });
        const data = res?.data || res;
        const mapped = Array.isArray(data)
          ? data.map((c) => ({ id: c.id, name: c.name }))
          : [];
        setCategories(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi tải thể loại:", err);
      }
    };

    fetchAuthors();
    fetchCategories();
  }, [callApiWithToken]);

  // ==================== Input change ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setFormData((prev) => ({ ...prev, idsCategory: selected }));
  };

  const handleDecrease = () => {
    setFormData((prev) => ({
      ...prev,
      quantity: prev.quantity > 1 ? prev.quantity - 1 : 1,
    }));
  };

  const handleIncrease = () => {
    setFormData((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  // ==================== Validate ====================
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nameBook.trim()) newErrors.nameBook = "Vui lòng nhập tên sách";
    if (!formData.idAuthor) newErrors.idAuthor = "Vui lòng chọn tác giả";
    if (!formData.idsCategory.length)
      newErrors.idsCategory = "Vui lòng chọn ít nhất 1 thể loại";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Giá phải lớn hơn 0";
    if (!formData.quantity || Number(formData.quantity) <= 0)
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    if (!formData.description.trim())
      newErrors.description = "Vui lòng nhập mô tả sách";
    if (!formData.imageFile)
      newErrors.imageFile = "Vui lòng chọn ảnh bìa sách";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== Submit ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessageType("error");
      setMessage("⚠️ Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      const payload = {
        nameBook: formData.nameBook.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        description: formData.description.trim(),
        idAuthor: Number(formData.idAuthor),
        idsCategory: formData.idsCategory.map(Number),
      };

      form.append(
        "createBookRequest",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      form.append("thumbnail", formData.imageFile);

      await callApiWithToken("/api/admin/create-book", { method: "POST", body: form }, true);

      setMessageType("success");
      setMessage("✅ Thêm sách thành công!");
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
      setErrors({});
    } catch (err) {
      console.error("❌ Lỗi khi thêm sách:", err);
      setMessageType("error");
      setMessage("❌ Thêm sách thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // ==================== UI ====================
  return (
    <div className="add-book-page">
      <h2 className="page-title">Thêm sách</h2>

      <form className="add-book-form" onSubmit={handleSubmit}>
        <div className="left-form">
          {/* === Tên sách === */}
          <label>Tên sách *</label>
          <input
            name="nameBook"
            placeholder="Nhập tên sách"
            value={formData.nameBook}
            onChange={handleChange}
            className={errors.nameBook ? "error-input" : ""}
          />
          {errors.nameBook && <p className="error-text">{errors.nameBook}</p>}

          {/* === Tác giả === */}
          <label>Tác giả *</label>
          <select
            name="idAuthor"
            value={formData.idAuthor}
            onChange={handleChange}
            className={errors.idAuthor ? "error-input" : ""}
          >
            <option value="">-- Chọn tác giả --</option>
            {authors.map((a, i) => (
              <option key={`${a.idAuthor}-${i}`} value={a.idAuthor}>
                {a.author}
              </option>
            ))}
          </select>
          {errors.idAuthor && <p className="error-text">{errors.idAuthor}</p>}

          {formData.idAuthor && (
            <div className="selected-author">
              <strong>Đã chọn:</strong>{" "}
              {authors.find((a) => a.idAuthor.toString() === formData.idAuthor.toString())?.author}
            </div>
          )}

          {/* === Thể loại === */}
          <label>Thể loại *</label>
          <select
            name="idsCategory"
            multiple
            value={formData.idsCategory}
            onChange={handleCategoryChange}
            className={errors.idsCategory ? "error-input" : ""}
          >
            {categories.map((c, i) => (
              <option key={`${c.id}-${i}`} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.idsCategory && <p className="error-text">{errors.idsCategory}</p>}

          {formData.idsCategory.length > 0 && (
            <div className="selected-categories">
              <strong>Đã chọn:</strong>{" "}
              {formData.idsCategory
                .map((id) => categories.find((c) => c.id.toString() === id.toString())?.name)
                .filter(Boolean)
                .join(", ")}
            </div>
          )}

          {/* === Giá === */}
          <label>Giá *</label>
          <input
            name="price"
            type="number"
            placeholder="Nhập giá sách"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "error-input" : ""}
          />
          {errors.price && <p className="error-text">{errors.price}</p>}

          {/* === Số lượng === */}
          <label>Số lượng *</label>
          <div className="quantity">
            <button type="button" onClick={handleDecrease}>-</button>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className={errors.quantity ? "error-input" : ""}
            />
            <button type="button" onClick={handleIncrease}>+</button>
          </div>
          {errors.quantity && <p className="error-text">{errors.quantity}</p>}
        </div>

        <div className="right-form">
          {/* === Mô tả === */}
          <label>Mô tả *</label>
          <textarea
            name="description"
            placeholder="Giới thiệu thông tin sách"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "error-input" : ""}
          />
          {errors.description && <p className="error-text">{errors.description}</p>}

          {/* === Ảnh bìa === */}
          <label>Ảnh bìa *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={errors.imageFile ? "error-input" : ""}
          />
          {formData.imagePreview && (
            <img src={formData.imagePreview} alt="Preview" className="preview-image" />
          )}
          {errors.imageFile && <p className="error-text">{errors.imageFile}</p>}
        </div>

        <div className="form-footer">
          <button type="submit" disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm sách"}
          </button>
        </div>

        {/* ✅ THÔNG BÁO DƯỚI CÙNG */}
        {message && (
          <div className={`message-box ${messageType} bottom-message`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
