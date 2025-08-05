import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl shadow-lg overflow-hidden hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-105 relative group w-full max-w-sm mx-auto">
      {/* Image and Favorite Icon */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover"
        />
        <HeartIcon product={product} />
      </div>

      {/* Name and Price */}
      <div className="p-4 text-white">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold mb-2 hover:underline">
            {product.name}
          </h2>
        </Link>
        <div className="flex justify-between items-center">
          <span className="bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
