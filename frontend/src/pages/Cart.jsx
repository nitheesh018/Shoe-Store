import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const getImageUrl = (path) =>
    path.startsWith("/uploads") ? `http://localhost:5000${path}` : path;

  return (
    <div className="container mx-auto px-4 py-8">
      {cartItems.length === 0 ? (
        <div className="text-center text-white">
          <p className="text-lg mb-2">Your cart is empty.</p>
          <Link to="/shop" className="text-pink-400 hover:underline">
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Cart Items List */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-6">Shopping Cart</h1>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center bg-[#1a1a1a] rounded-lg p-4 mb-4 shadow"
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1 mt-4 md:mt-0 md:ml-6 text-white">
                  <Link
                    to={`/product/${item._id}`}
                    className="text-lg font-semibold text-pink-400 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <div className="text-sm text-gray-400 mt-1">{item.brand}</div>
                  <div className="text-sm font-bold mt-1">${item.price}</div>
                </div>

                <div className="mt-4 md:mt-0 md:ml-4 w-24">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                    className="w-full p-2 rounded text-black"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => removeFromCartHandler(item._id)}
                  className="text-red-500 ml-4 mt-4 md:mt-0"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full md:w-1/3 bg-[#1a1a1a] text-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
            <p className="text-lg mb-2">
              Items:{" "}
              <span className="font-semibold">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            </p>
            <p className="text-lg mb-4">
              Total:{" "}
              <span className="font-bold text-pink-400">
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
            </p>

            <button
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-md transition"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;