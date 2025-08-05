import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrders = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-6 text-white">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error || "Something went wrong"}
        </Message>
      ) : !orders || orders.length === 0 ? (
        <Message variant="info">You have no orders yet.</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-700 bg-[#151515] text-white rounded-lg overflow-hidden">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-3 py-2 text-left">Image</th>
                <th className="px-3 py-2 text-left">Order ID</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Paid</th>
                <th className="px-3 py-2 text-left">Delivered</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const firstItem = order.orderItems?.[0];
                return (
                  <tr key={order._id} className="border-b border-gray-700">
                    <td className="px-3 py-2">
                      {firstItem?.image ? (
                        <img
                          src={firstItem.image}
                          alt={firstItem.name || "Product"}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{order._id}</td>
                    <td className="px-3 py-2">
                      {order.createdAt?.substring(0, 10)}
                    </td>
                    <td className="px-3 py-2">
                      ${order.totalPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-3 py-2">
                      {order.isPaid ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                          Paid
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {order.isDelivered ? (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                          Delivered
                        </span>
                      ) : (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-pink-500 font-bold underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
