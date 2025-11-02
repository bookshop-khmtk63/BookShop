import React, { useEffect, useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import { useAuth } from "../../Context/Context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountManager.css";

export default function AccountManager() {
  const { callApiWithToken } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  // 🔹 Gọi API lấy danh sách người dùng
  const fetchAccounts = async (page = 0) => {
    setLoading(true);
    try {
      const res = await callApiWithToken(
        `/api/admin/get-all-user?page=${page}&size=${itemsPerPage}`
      );
  
      // ✅ callApiWithToken() trả về trực tiếp phần "data" nên không cần .data.data
      const pageData = res;
      if (pageData && Array.isArray(pageData.data)) {
        console.log("✅ Dữ liệu user:", pageData.data);
        setAccounts(pageData.data);
        setTotalPages(pageData.totalPages || 1);
      } else {
        console.error("⚠️ Sai format dữ liệu:", res);
        toast.error("Lỗi định dạng dữ liệu người dùng!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi gọi API người dùng:", err);
      toast.error("Không thể tải danh sách tài khoản!");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAccounts(currentPage);
  }, [currentPage]);

  // 🔹 Khóa / Mở khóa tài khoản
  const toggleAccountStatus = async (id, isLocked) => {
    try {
      const endpoint = isLocked
        ? `/api/admin/unlock/${id}` // đang bị khóa thì mở khóa
        : `/api/admin/locked/${id}`; // đang mở thì khóa lại

      const res = await callApiWithToken(endpoint, { method: "PUT" });

      const message =
        res?.data?.message ||
        (isLocked
          ? "Mở khóa tài khoản thành công!"
          : "Khóa tài khoản thành công!");

      toast.success(message);

      // ✅ Cập nhật giao diện ngay lập tức
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === id ? { ...acc, locked: !isLocked } : acc
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi đổi trạng thái tài khoản:", error);
      toast.error("Không thể thay đổi trạng thái tài khoản!");
    }
  };

  // 🔹 Chuyển trang
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  };

  return (
    <div className="account-manager">
      <h2 className="page-title">📋 Danh sách tài khoản</h2>

      <div className="table-wrapper">
        {loading ? (
          <p style={{ textAlign: "center" }}>⏳ Đang tải dữ liệu...</p>
        ) : (
          <table className="account-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Ngày đăng kí</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    😕 Không có tài khoản nào.
                  </td>
                </tr>
              ) : (
                accounts.map((acc, index) => (
                  <tr key={acc.id}>
                    <td>{currentPage * itemsPerPage + index + 1}</td>
                    <td>{acc.username}</td>
                    <td>{acc.email}</td>
                    <td>{acc.expiration || "Không rõ"}</td>
                    <td>
                      {acc.locked ? (
                        <span className="status-inactive">Đã khóa</span>
                      ) : acc.active ? (
                        <span className="status-active">Hoạt động</span>
                      ) : (
                        <span className="status-inactive">
                          Không hoạt động
                        </span>
                      )}
                    </td>
                    <td>
  <button
    className="status-btn"
    onClick={() => toggleAccountStatus(acc.id, acc.locked)}
  >
    {acc.locked ? (
      <FaLock
        className="lock"
        title="Tài khoản đã bị khóa"
      />
    ) : (
      <FaUnlock
        className="unlock"
        title="Tài khoản đang hoạt động"
      />
    )}
  </button>
</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Phân trang --- */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          ❮
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-number ${currentPage === i ? "active" : ""}`}
            onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 === totalPages}
        >
          ❯
        </button>
      </div>
    </div>
  );
}
