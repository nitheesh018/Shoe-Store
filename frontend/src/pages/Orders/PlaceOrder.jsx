import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [shippingAddress?.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(shippingPrice),
        taxPrice: Number(taxPrice),
        totalPrice: Number(totalPrice),
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Order failed");
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-10 px-4">
        {cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <>
            {/* Cart Table */}
            <div className="overflow-x-auto mb-10">
              <table className="w-full border-collapse border border-gray-700 bg-[#151515] text-white rounded">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-2">
                        <Link to={`/product/${item._id}`} className="text-pink-400 underline">
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">${Number(item.price).toFixed(2)}</td>
                      <td className="p-2">${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Card */}
            <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg text-white">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <ul className="mb-4 space-y-2 text-lg">
                <li>
                  <strong>Items:</strong> $ {Number(itemsPrice || 0).toFixed(2)}
                </li>
                <li>
                  <strong>Shipping:</strong> $ {Number(shippingPrice || 0).toFixed(2)}
                </li>
                <li>
                  <strong>Tax:</strong> $ {Number(taxPrice || 0).toFixed(2)}
                </li>
                <li className="text-pink-500 font-bold">
                  <strong>Total:</strong> $ {Number(totalPrice || 0).toFixed(2)}
                </li>
              </ul>

              <div className="mb-4">
                <h3 className="font-semibold">Shipping Address</h3>
                <p>
                  {shippingAddress?.address}, {shippingAddress?.city},{" "}
                  {shippingAddress?.postalCode}, {shippingAddress?.country}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold">Payment Method</h3>
                <p>{paymentMethod}</p>
              </div>

              {error && (
                <Message variant="danger">
                  {error?.data?.message || error.message || "Error placing order"}
                </Message>
              )}

              <button
                type="button"
                className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg text-lg w-full mt-4"
                disabled={cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
