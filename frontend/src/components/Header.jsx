import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error) return <h1 className="text-red-500 text-center">Error loading products</h1>;

  return (
    <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-6 px-6 py-10">
      {/* Left: Top Products Grid (only show on xl screens) */}
      <div className="hidden xl:grid grid-cols-2 gap-6 w-1/2">
        {data?.map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>

      {/* Right: Main Carousel */}
      <div className="w-full xl:w-1/2">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;
