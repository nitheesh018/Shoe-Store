import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingUsers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "line" },
      tooltip: { theme: "dark" },
      colors: ["#00E396"],
      dataLabels: { enabled: true },
      stroke: { curve: "smooth" },
      title: { text: "Sales Trend", align: "left" },
      grid: { borderColor: "#ccc" },
      markers: { size: 1 },
      xaxis: {
        categories: [],
        title: { text: "Date" },
      },
      yaxis: {
        title: { text: "Sales" },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          {
            name: "Sales",
            data: formattedSalesDate.map((item) => item.y),
          },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="flex flex-col md:flex-row">
      <AdminMenu />

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Admin Dashboard</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-black rounded-lg p-5 shadow-md">
            <div className="font-bold text-white mb-2">Total Sales</div>
            <h1 className="text-3xl font-bold text-green-400">
              $
              {loadingSales ? <Loader /> : sales?.totalSales?.toFixed(2) || "0.00"}
            </h1>
          </div>

          <div className="bg-black rounded-lg p-5 shadow-md">
            <div className="font-bold text-white mb-2">Customers</div>
            <h1 className="text-3xl font-bold text-pink-400">
              {loadingUsers ? <Loader /> : customers?.length || 0}
            </h1>
          </div>

          <div className="bg-black rounded-lg p-5 shadow-md">
            <div className="font-bold text-white mb-2">Orders</div>
            <h1 className="text-3xl font-bold text-yellow-300">
              {loadingOrders ? <Loader /> : orders?.totalOrders || 0}
            </h1>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-[#1F1F1F] p-6 rounded-lg shadow-lg">
          <h2 className="text-white font-bold text-xl mb-4">Sales Overview</h2>
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="100%"
          />
        </div>

        {/* Order Table */}
        <div className="mt-12">
          <OrderList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
