import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/Context";
import "./BookUpdate.css";

export default function BookUpdate({ id, onBack }) {
  const { callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL; // ✅ Lấy base URL từ .env

  const [book, setBook] = useState({
    nameBook: "",
    price: "",
    number: 1,
    describe: "",
    categoryIds: [],
  });

  const [loading, setLoading] = useState(true);

  // --- ẢNH ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  // --- THÔNG BÁO ---
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  useEffect(() => {
    let objectUrl;

    const fetchBook = async () => {
      try {
        const bookData = await callApiWithToken(`${API_URL}/api/books/${id}`);

        console.log("📘 Book data:", bookData);

        setBook({
          nameBook: bookData.nameBook || "",
          price: bookData.price ?? "",
          number: bookData.number ?? 1,
          describe: bookData.describe || "",
          categoryIds: bookData.category?.map((c) => c.id) || [],
        });

        // --- xử lý ảnh bìa ---
        const imageUrl =
          bookData.thumbnailUrl ||
          bookData.thumbnail ||
          bookData.imageUrl ||
          bookData.image ||
          bookData.coverUrl ||
          bookData.url ||
          "";

        if (imageUrl) {
          const fullUrl = imageUrl.startsWith("http")
            ? imageUrl
            : `${API_URL}${imageUrl}`;
          setPreview(fullUrl);
          setSelectedFile(null);
          setRemoveImage(false);
        } else {
          setPreview("");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải sách:", err);
        setMessageType("error");
        setMessage("Không thể tải thông tin sách!");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, callApiWithToken, API_URL]);

  // --- chọn ảnh mới ---
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);

    const objUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreview(objUrl);
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview("");
    setRemoveImage(true);
  };

  // --- input chung ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const ids = e.target.value
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
    setBook((prev) => ({ ...prev, categoryIds: ids }));
  };

  // --- submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nameBook: book.nameBook,
      price: book.price !== "" ? Number(book.price) : null,
      quantity: book.number !== "" ? Number(book.number) : null,
      description: book.describe,
      idsCategory: book.categoryIds,
      idAuthor: 1,
      removeThumbnail: removeImage,
    };

    const form = new FormData();
    form.append(
      "updateBookRequest",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (selectedFile) form.append("thumbnail", selectedFile);

    try {
      await callApiWithToken(
        `${API_URL}/api/admin/update-book/${id}`,
        { method: "PUT", body: form },
        true
      );

      // ✅ Hiển thị thông báo thành công
      setMessageType("success");
      setMessage("✅ Cập nhật sách thành công!");

      // Ẩn thông báo sau 3 giây
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật sách:", err);
      setMessageType("error");
      setMessage("❌ Không thể cập nhật sách!");
    }
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (loading) return <p className="loading">Đang tải dữ liệu...</p>;

  return (
    <div className="book-update-container">
      <h2>Cập nhật sách</h2>

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label>Tên sách</label>
          <input
            type="text"
            name="nameBook"
            value={book.nameBook}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Giá</label>
          <input
            type="number"
            name="price"
            value={book.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Số lượng</label>
          <input
            type="number"
            name="number"
            value={book.number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="describe"
            value={book.describe}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>IDs Thể loại (phân cách bằng dấu ,)</label>
          <input
            type="text"
            value={book.categoryIds.join(",")}
            onChange={handleCategoryChange}
          />
        </div>

        {/* --- ảnh bìa --- */}
        <div className="form-group">
          <label>Ảnh bìa</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview ? (
            <div className="image-preview-row" style={{ marginTop: 10 }}>
              <img
                src={preview}
                alt="Preview"
                className="preview"
                style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8 }}
              />
              <div style={{ marginLeft: 12 }}>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-btn"
                >
                  Xóa ảnh
                </button>
                <div className="image-status">
                  {selectedFile ? "Ảnh mới (chưa lưu)" : "Ảnh hiện có"}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-image">Chưa có ảnh bìa</div>
          )}
        </div>

        {/* Thông báo */}
        {message && <div className={`message-box ${messageType}`}>{message}</div>}

        <div className="form-buttons">
          <button type="button" onClick={onBack}>
            Quay lại
          </button>
          <button type="submit">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
}
