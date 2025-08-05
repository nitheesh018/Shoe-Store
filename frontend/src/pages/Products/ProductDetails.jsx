import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="px-6 py-4">
        <Link to="/" className="text-white font-semibold hover:underline">
          ← Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-10 px-6 py-8">
            {/* Left: Image */}
            <div className="w-full lg:w-1/2 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-h-[500px] object-cover rounded-xl shadow-lg"
              />
              <HeartIcon product={product} />
            </div>

            {/* Right: Info */}
            <div className="w-full lg:w-1/2 text-white">
              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
              <p className="text-gray-400 mb-4">{product.description}</p>
              <p className="text-4xl font-extrabold text-pink-500 mb-6">
                ${product.price}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <FaStore className="mr-2" /> Brand: {product.brand}
                  </div>
                  <div className="flex items-center mb-2">
                    <FaClock className="mr-2" />
                    Added: {moment(product.createAt).fromNow()}
                  </div>
                  <div className="flex items-center mb-2">
                    <FaStar className="mr-2" />
                    Reviews: {product.numReviews}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <FaStar className="mr-2" /> Ratings: {product.rating}
                  </div>
                  <div className="flex items-center mb-2">
                    <FaShoppingCart className="mr-2" />
                    Quantity: {product.quantity}
                  </div>
                  <div className="flex items-center mb-2">
                    <FaBox className="mr-2" />
                    In Stock: {product.countInStock}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="p-2 rounded text-black"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg transition"
              >
                Add To Cart
              </button>
            </div>
          </div>

          {/* Tabs and Review Form */}
          <div className="px-6 py-10">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
