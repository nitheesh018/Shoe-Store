import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="flex-1 p-4 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">All Orders</h2>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <table className="min-w-full table-auto border border-gray-600">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-2 py-2 text-left">Items</th>
                  <th className="px-2 py-2 text-left">ID</th>
                  <th className="px-2 py-2 text-left">User</th>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">Total</th>
                  <th className="px-2 py-2 text-left">Paid</th>
                  <th className="px-2 py-2 text-left">Delivered</th>
                  <th className="px-2 py-2 text-left"></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-700 text-white">
                    <td className="px-2 py-2">
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="w-16"
                      />
                    </td>
                    <td className="px-2 py-2">{order._id}</td>
                    <td className="px-2 py-2">{order.user?.username || "N/A"}</td>
                    <td className="px-2 py-2">{order.createdAt?.substring(0, 10)}</td>
                    <td className="px-2 py-2">$ {order.totalPrice}</td>
                    <td className="px-2 py-2">
                      {order.isPaid ? (
                        <span className="text-green-400 font-bold">✔ Paid</span>
                      ) : (
                        <span className="text-red-400 font-bold">✘ Pending</span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {order.isDelivered ? (
                        <span className="text-green-400 font-bold">✔ Delivered</span>
                      ) : (
                        <span className="text-red-400 font-bold">✘ Pending</span>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-pink-500 font-bold underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderList;
