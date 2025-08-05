import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  const handleTabClick = (tabNumber) => setActiveTab(tabNumber);

  return (
    <div className="flex flex-col md:flex-row w-full gap-6 text-white">
      {/* Tabs */}
      <div className="flex md:flex-col gap-2 border-r border-gray-600 pr-4">
        <button
          onClick={() => handleTabClick(1)}
          className={`py-2 px-4 text-left transition ${
            activeTab === 1 ? "border-l-4 border-pink-500 font-bold" : "hover:text-pink-400"
          }`}
        >
          Write Your Review
        </button>
        <button
          onClick={() => handleTabClick(2)}
          className={`py-2 px-4 text-left transition ${
            activeTab === 2 ? "border-l-4 border-pink-500 font-bold" : "hover:text-pink-400"
          }`}
        >
          All Reviews
        </button>
        <button
          onClick={() => handleTabClick(3)}
          className={`py-2 px-4 text-left transition ${
            activeTab === 3 ? "border-l-4 border-pink-500 font-bold" : "hover:text-pink-400"
          }`}
        >
          Related Products
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 1 && (
          <div>
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6 max-w-2xl">
                <div>
                  <label htmlFor="rating" className="block text-lg mb-1">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2 rounded text-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-lg mb-1">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 rounded text-black"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded transition"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="text-gray-400">
                Please{" "}
                <Link to="/login" className="text-pink-400 underline">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-5">
            {product.reviews.length === 0 ? (
              <p className="text-gray-400">No Reviews</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#1A1A1A] p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-300">
                    <strong>{review.name}</strong>
                    <span>{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p className="text-white mb-2">{review.comment}</p>
                  <Ratings value={review.rating} />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data?.length === 0 ? (
              <p className="text-gray-400">No related products found.</p>
            ) : (
              data.map((relatedProduct) => (
                <SmallProduct key={relatedProduct._id} product={relatedProduct} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
