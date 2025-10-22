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

export default function Statistics() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [stats, setStats] = useState({ count: "-", revenue: "-" });
  const [chartData, setChartData] = useState([]);

  // 🧾 Dữ liệu mẫu
  const orders = [
    { date: "2025-10-01", total: 250000, count: 2 },
    { date: "2025-10-03", total: 500000, count: 3 },
    { date: "2025-10-05", total: 100000, count: 1 },
    { date: "2025-10-07", total: 800000, count: 4 },
    { date: "2025-10-10", total: 300000, count: 2 },
  ];

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      alert("⚠️ Vui lòng chọn khoảng thời gian hợp lệ!");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const filtered = orders.filter((o) => {
      const d = new Date(o.date);
      return d >= from && d <= to;
    });

    const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0);
    const totalCount = filtered.reduce((sum, o) => sum + o.count, 0);

    setStats({
      count: totalCount,
      revenue: totalRevenue.toLocaleString("vi-VN") + " ₫",
    });
    setChartData(filtered);
  };

  return (
    <div className="stats-wrapper">
      <h2 className="page-title">📊 Báo cáo thống kê</h2>

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
              <button className="btn-filter" onClick={handleFilter}>
                Thống kê
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="label-cell">Số lượng</td>
            <td className="value-cell">{stats.count}</td>

            {/* Biểu đồ nằm bên phải, gộp 2 hàng */}
            <td rowSpan="2" colSpan="3" className="chart-cell">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 15, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="left"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                      label={{
                        value: "Số lượng",
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(v) =>
                        (v / 1000).toLocaleString("vi-VN") + "K"
                      }
                      label={{
                        value: "Doanh thu (VNĐ)",
                        angle: 90,
                        position: "insideRight",
                        fontSize: 12,
                      }}
                    />
                    <Tooltip
                      formatter={(value, name) =>
                        name === "Doanh thu"
                          ? `${value.toLocaleString("vi-VN")} ₫`
                          : value
                      }
                    />
                    <Legend verticalAlign="top" height={30} />
                    {/* Cột số lượng */}
                    {/* Cột số lượng (Xanh dương) */}
<Bar
  yAxisId="left"
  dataKey="count"
  name="Số lượng"
  fill="#3498db"
  barSize={25}
  radius={[6, 6, 0, 0]}
>
  <LabelList
    dataKey="count"
    position="top"
    style={{ fontSize: "12px", fill: "#3498db", fontWeight: 600 }}
  />
</Bar>

{/* Cột doanh thu (Vàng) */}
<Bar
  yAxisId="right"
  dataKey="total"
  name="Doanh thu"
  fill="#f5b041"
  barSize={25}
  radius={[6, 6, 0, 0]}
>
  <LabelList
    dataKey="total"
    position="top"
    formatter={(v) => (v / 1000).toLocaleString("vi-VN") + "K"}
    style={{ fontSize: "12px", fill: "#f39c12", fontWeight: 600 }}
  />
</Bar>

                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="chart-placeholder">Biểu đồ</p>
              )}
            </td>
          </tr>

          <tr>
            <td className="label-cell">Doanh Thu</td>
            <td className="value-cell">{stats.revenue}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
