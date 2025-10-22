import React, { useEffect, useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import "./AccountManager.css";

export default function AccountManager() {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔹 Dữ liệu mẫu (sau này có thể thay bằng API thật)
  const mockData = [
    {
      id: 1,
      name: "Nguyễn Tuấn",
      email: "tuan@gmail.com",
      phone: "0987654321",
      address: "123 Nguyễn Trãi, Hà Nội",
      active: true,
    },
    {
      id: 2,
      name: "Lê Minh",
      email: "minh@yahoo.com",
      phone: "0912345678",
      address: "456 Lê Lợi, TP.HCM",
      active: false,
    },
    {
      id: 3,
      name: "Trần Hoa",
      email: "hoa@gmail.com",
      phone: "0909999999",
      address: "789 Hai Bà Trưng, Đà Nẵng",
      active: true,
    },
    {
      id: 4,
      name: "Phạm Duy",
      email: "duy@gmail.com",
      phone: "0912121212",
      address: "Tân Bình, TP.HCM",
      active: true,
    },
    {
      id: 5,
      name: "Ngô Huy",
      email: "huy@gmail.com",
      phone: "0988123456",
      address: "Cầu Giấy, Hà Nội",
      active: false,
    },
    {
      id: 6,
      name: "Trịnh Hà",
      email: "ha@gmail.com",
      phone: "0909090909",
      address: "Quảng Nam",
      active: true,
    },
  ];

  useEffect(() => {
    setAccounts(mockData);
  }, []);

  // 🔹 Tính toán phân trang
  const totalPages = Math.ceil(accounts.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = accounts.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // 🔹 Khóa/Mở khóa tài khoản
  const toggleAccountStatus = (id) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, active: !acc.active } : acc
      )
    );
  };

  return (
    <div className="account-manager">
      <h2 className="page-title">📋 Danh sách tài khoản</h2>

      <div className="table-wrapper">
        <table className="account-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Trạng thái tài khoản</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  😕 Không có tài khoản nào.
                </td>
              </tr>
            ) : (
              currentData.map((acc, index) => (
                <tr key={acc.id}>
                  <td>{startIdx + index + 1}</td>
                  <td>{acc.name}</td>
                  <td>{acc.email}</td>
                  <td>{acc.phone}</td>
                  <td>{acc.address}</td>
                  <td>
                    <button
                      className="status-btn"
                      onClick={() => toggleAccountStatus(acc.id)}
                    >
                      {acc.active ? (
                        <FaUnlock className="unlock" />
                      ) : (
                        <FaLock className="lock" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Phân trang --- */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ❮
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-number ${
              currentPage === i + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ❯
        </button>
      </div>
    </div>
  );
}
