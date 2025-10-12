import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/Context";
import "./BookUpdate.css";

export default function BookUpdate({ id, onBack }) {
  const { callApiWithToken } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [book, setBook] = useState({
    nameBook: "",
    price: "",
    number: 1,
    describe: "",
    categoryIds: [],
    idAuthor: "",
  });

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [bookData, setBookData] = useState(null); // giữ bản gốc API

  // 🔹 Lấy danh sách thể loại
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await callApiWithToken(`${API_URL}/api/books/category`);
        const data = res?.data || res;
        setCategories(
          (Array.isArray(data) ? data : []).map((c) => ({
            id: c.id,
            name: c.name,
          }))
        );
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách thể loại:", err);
      }
    };
    fetchCategories();
  }, [API_URL, callApiWithToken]);

  // 🔹 Lấy danh sách tác giả
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await callApiWithToken(`${API_URL}/api/admin/get-all-author`);
        const data = res?.data || res;
        setAuthors(
          (Array.isArray(data) ? data : []).map((a) => ({
            idAuthor: a.idAuthor,
            name: a.author,
          }))
        );
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách tác giả:", err);
      }
    };
    fetchAuthors();
  }, [API_URL, callApiWithToken]);

  // 🔹 Lấy thông tin sách theo ID
  useEffect(() => {
    let objectUrl;
    const fetchBook = async () => {
      try {
        const res = await callApiWithToken(`${API_URL}/api/books/${id}`);
        const data = res?.data || res;
        setBookData(data);

        // 🔹 Tìm id tác giả khớp theo tên
        let matchedAuthor = null;
        if (Array.isArray(authors) && data.author) {
          matchedAuthor = authors.find(
            (a) =>
              a.name.toLowerCase().trim() === data.author.toLowerCase().trim()
          );
        }

        setBook({
          nameBook: data.nameBook || "",
          price: data.price ?? "",
          number: data.number ?? 1,
          describe: data.describe || "",
          categoryIds: data.category?.map((c) => c.id) || [],
          idAuthor: matchedAuthor ? matchedAuthor.idAuthor : "",
        });

        const imageUrl =
          data.thumbnailUrl ||
          data.thumbnail ||
          data.imageUrl ||
          data.image ||
          data.coverUrl ||
          data.url ||
          "";

        if (imageUrl) {
          const fullUrl = imageUrl.startsWith("http")
            ? imageUrl
            : `${API_URL}${imageUrl}`;
          setPreview(fullUrl);
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

    if (id && authors.length > 0) fetchBook();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, callApiWithToken, API_URL, authors]);

  // 🔹 Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const ids = selectedOptions.map((opt) => parseInt(opt.value));
    setBook((prev) => ({ ...prev, categoryIds: ids }));
  };

  // 🔹 Validate
  const validateForm = () => {
    if (
      !book.nameBook.trim() ||
      !book.price ||
      !book.number ||
      !book.describe.trim() ||
      book.categoryIds.length === 0 ||
      !book.idAuthor
    ) {
      setMessageType("error");
      setMessage("⚠️ Vui lòng điền đầy đủ tất cả các trường bắt buộc!");
      setTimeout(() => setMessage(""), 3000);
      return false;
    }
    return true;
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      nameBook: book.nameBook,
      price: Number(book.price),
      quantity: Number(book.number),
      description: book.describe,
      idsCategory: book.categoryIds,
      idAuthor: Number(book.idAuthor),
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
      setMessageType("success");
      setMessage("✅ Cập nhật sách thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật sách:", err);
      setMessageType("error");
      setMessage("❌ Không thể cập nhật sách!");
    }
  };

  if (loading) return <p className="loading">Đang tải dữ liệu...</p>;

  return (
    <div className="book-update-container">
      <h2>Cập nhật sách</h2>
      <form onSubmit={handleSubmit} className="book-form">
        {/* --- Hàng 1 --- */}
        <div className="form-group half">
          <label>Tên sách *</label>
          <input
            type="text"
            name="nameBook"
            value={book.nameBook}
            onChange={handleChange}
            placeholder="Nhập tên sách"
          />
        </div>

        <div className="form-group half">
          <label>Tác giả *</label>
          <select
            className="author-select"
            name="idAuthor"
            value={book.idAuthor}
            onChange={handleChange}
          >
            <option value="">-- Chọn tác giả --</option>
            {authors.map((author, index) => (
              <option key={author.idAuthor || index} value={author.idAuthor}>
                🖋 {author.name}
              </option>
            ))}
          </select>

          {book.idAuthor ? (
            <div className="selected-author fade-in">
              ✅{" "}
              {
                authors.find(
                  (a) => String(a.idAuthor) === String(book.idAuthor)
                )?.name
              }
            </div>
          ) : (
            bookData?.author && (
              <div className="selected-author fade-in">
                ✅ {bookData.author} (từ dữ liệu cũ)
              </div>
            )
          )}
        </div>

        {/* --- Hàng 2 --- */}
        <div className="form-group half">
          <label>Giá *</label>
          <input
            type="number"
            name="price"
            value={book.price}
            onChange={handleChange}
            placeholder="Nhập giá sách"
          />
        </div>

        <div className="form-group half">
          <label>Số lượng *</label>
          <input
            type="number"
            name="number"
            value={book.number}
            onChange={handleChange}
            placeholder="Nhập số lượng"
          />
        </div>

        {/* --- Mô tả --- */}
        <div className="form-group full">
          <label>Mô tả *</label>
          <textarea
            name="describe"
            value={book.describe}
            onChange={handleChange}
            placeholder="Nhập mô tả sách"
          />
        </div>

        {/* --- Thể loại --- */}
        <div className="form-group full">
          <label>Thể loại *</label>
          <select
            multiple
            className="category-select"
            value={book.categoryIds.map(String)}
            onChange={handleCategoryChange}
          >
            {categories.map((cat, index) => (
              <option key={cat.id || index} value={cat.id}>
                📚 {cat.name}
              </option>
            ))}
          </select>

          {book.categoryIds.length > 0 && (
            <div className="selected-categories">
              {book.categoryIds.map((cid, idx) => {
                const category = categories.find(
                  (c) => String(c.id) === String(cid)
                );
                return (
                  <span className="category-tag" key={`${cid}-${idx}`}>
                    {category ? category.name : "Không rõ"}
                    <button
                      type="button"
                      className="remove-cat-btn"
                      onClick={() =>
                        setBook((prev) => ({
                          ...prev,
                          categoryIds: prev.categoryIds.filter(
                            (id) => id !== cid
                          ),
                        }))
                      }
                    >
                      ✖
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* --- Ảnh bìa --- */}
        <div className="form-group full">
          <label>Ảnh bìa</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {preview && <img src={preview} alt="Preview" className="preview" />}
          {preview && (
            <button
              type="button"
              onClick={() => {
                setPreview("");
                setRemoveImage(true);
              }}
            >
              Xóa ảnh
            </button>
          )}
        </div>

        {/* --- Thông báo --- */}
        {message && <div className={`message-box ${messageType}`}>{message}</div>}

        {/* --- Nút --- */}
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
