import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="bg-[#1A1A1A] rounded-xl shadow-md overflow-hidden hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-105 w-full max-w-xs mx-auto">
      {/* Image & Heart */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover"
        />
        <HeartIcon product={product} />
      </div>

      {/* Content */}
      <div className="p-4 text-white">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-base font-semibold mb-2 hover:underline">
            {product.name}
          </h2>
        </Link>

        <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          ${product.price}
        </span>
      </div>
    </div>
  );
};

export default SmallProduct;
