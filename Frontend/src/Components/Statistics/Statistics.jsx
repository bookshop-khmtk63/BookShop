import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import "./Statistics.css";
import { useAuth } from "../../Context/Context"; // ⚠️ Đảm bảo đúng đường dẫn

export default function Statistics() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [stats, setStats] = useState({ totalOrders: "-", totalRevenue: "-" });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { callApiWithToken } = useAuth();

  // ✅ Hàm lọc và lấy dữ liệu thống kê từ API
  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      alert("⚠️ Vui lòng chọn khoảng thời gian hợp lệ!");
      return;
    }

    try {
      setLoading(true);

      const endpoint = `/api/admin/statistics/revenue?startDate=${fromDate}&endDate=${toDate}&period=daily`;
      const result = await callApiWithToken(endpoint);

      // 📦 API trả về dạng:
      // {
      //   code: 200,
      //   message: "success",
      //   data: { totalRevenue, totalOrders, revenueOverTime: [...] }
      // }

      // Do callApiWithToken() đã unwrap => ta nhận trực tiếp data object
      const { totalRevenue, totalOrders, revenueOverTime } = result || {};

      if (!Array.isArray(revenueOverTime) || revenueOverTime.length === 0) {
        alert("Không có dữ liệu thống kê trong khoảng thời gian này!");
        setChartData([]);
        setStats({ totalOrders: "-", totalRevenue: "-" });
        return;
      }

      const formatted = revenueOverTime.map((item) => ({
        date: item.label,
        revenue: item.value,
      }));

      setStats({
        totalOrders: totalOrders ?? "-",
        totalRevenue:
          typeof totalRevenue === "number"
            ? totalRevenue.toLocaleString("vi-VN") + " ₫"
            : "-",
      });

      setChartData(formatted);
    } catch (error) {
      console.error("🔥 Lỗi khi tải thống kê:", error);
      alert("❌ Đã xảy ra lỗi khi lấy dữ liệu thống kê!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stats-wrapper">
      <h2 className="page-title">📊 Báo cáo doanh thu</h2>

      <table className="stats-table">
        <thead>
          <tr>
            <th>Từ ngày</th>
            <th>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </th>
            <th>đến</th>
            <th>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </th>
            <th>
              <button
                className="btn-filter"
                onClick={handleFilter}
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Thống kê"}
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Tổng số đơn hàng */}
          <tr>
            <td className="label-cell">Tổng số đơn hàng</td>
            <td className="value-cell">{stats.totalOrders}</td>

            <td rowSpan="2" colSpan="3" className="chart-cell">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(v) =>
                        v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : v
                      }
                      label={{
                        value: "Doanh thu (VNĐ)",
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      formatter={(value) =>
                        `${value.toLocaleString("vi-VN")} ₫`
                      }
                    />
                    <Legend verticalAlign="top" height={30} />

                    <Bar
                      dataKey="revenue"
                      name="Doanh thu"
                      fill="#f5b041"
                      barSize={40}
                      radius={[6, 6, 0, 0]}
                    >
                      <LabelList
                        dataKey="revenue"
                        position="top"
                        formatter={(v) =>
                          v >= 1000000
                            ? (v / 1000000).toFixed(1) + "M"
                            : v.toLocaleString("vi-VN")
                        }
                        style={{
                          fontSize: "12px",
                          fill: "#f39c12",
                          fontWeight: 600,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="chart-placeholder">
                  {loading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu"}
                </p>
              )}
            </td>
          </tr>

          {/* Tổng doanh thu */}
          <tr>
            <td className="label-cell">Tổng doanh thu</td>
            <td className="value-cell">{stats.totalRevenue}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
