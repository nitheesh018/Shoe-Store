import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-[#1A1A1A] rounded-2xl shadow-lg overflow-hidden hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-105 relative group">
      {/* Image & Brand Tag */}
      <div className="relative">
        <Link to={`/product/${p._id}`}>
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-52 object-cover"
          />
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            {p.brand}
          </span>
        </Link>
        <HeartIcon product={p} />
      </div>

      {/* Product Info */}
      <div className="p-4 text-white">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-lg font-semibold">{p.name}</h5>
          <span className="text-pink-400 font-bold">
            {p.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          {p.description?.substring(0, 60)}...
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="text-sm text-pink-400 font-medium hover:underline"
          >
            Read More →
          </Link>
          <button
            onClick={() => addToCartHandler(p, 1)}
            className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition"
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
