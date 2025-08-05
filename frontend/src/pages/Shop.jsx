import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetFilteredProductsMutation,
} from "../redux/api/productApiSlice";
import {
  useFetchCategoriesQuery,
} from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";

import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const [priceFilter, setPriceFilter] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const { data: categoryData, isLoading: loadingCategories } = useFetchCategoriesQuery();
  const [getFilteredProducts, { data: filteredProducts, isLoading }] = useGetFilteredProductsMutation();

  // Load categories once
  useEffect(() => {
    if (categoryData) {
      dispatch(setCategories(categoryData));
    }
  }, [categoryData, dispatch]);

  // Refetch products on filter change
  useEffect(() => {
    getFilteredProducts({ checked, radio }).then((res) => {
      const filtered = res.data?.filter((product) => {
        return (
          (!priceFilter || product.price.toString().includes(priceFilter)) &&
          (!selectedBrand || product.brand === selectedBrand)
        );
      });

      dispatch(setProducts(filtered || []));
    });
  }, [checked, radio, priceFilter, selectedBrand]);

  const handleCheck = (checkedValue, id) => {
    const updated = checkedValue
      ? [...checked, id]
      : checked.filter((c) => c !== id);

    dispatch(setChecked(updated));
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
  };

  const uniqueBrands = [
    ...new Set(filteredProducts?.map((p) => p.brand).filter(Boolean)),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="bg-black/30 backdrop-blur-xl p-5 rounded-xl w-full md:w-64 shadow-inner border border-pink-600 transition duration-300">
          <h2 className="text-white font-bold text-lg mb-4 border-b pb-2 text-center">
            Filter by Categories
          </h2>
          {loadingCategories ? (
            <Loader />
          ) : (
            <div className="space-y-3 mb-6">
              {categories?.map((c) => (
                <label key={c._id} className="flex items-center text-white text-sm">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded mr-2"
                  />
                  {c.name}
                </label>
              ))}
            </div>
          )}

          <h2 className="text-white font-bold text-lg mb-4 border-b pb-2 text-center">
            Filter by Brand
          </h2>
          <div className="space-y-3 mb-6">
            {uniqueBrands.map((brand) => (
              <label key={brand} className="flex items-center text-white text-sm">
                <input
                  type="radio"
                  name="brand"
                  onChange={() => handleBrandChange(brand)}
                  checked={selectedBrand === brand}
                  className="w-4 h-4 text-pink-600 border-gray-300 mr-2"
                />
                {brand}
              </label>
            ))}
          </div>

          <h2 className="text-white font-bold text-lg mb-4 border-b pb-2 text-center">
            Filter by Price
          </h2>
          <input
            type="text"
            placeholder="Enter price"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full p-2 rounded bg-[#1F1F1F] text-white border border-gray-600 mb-4"
          />

          <button
            onClick={() => {
              setPriceFilter("");
              setSelectedBrand("");
              dispatch(setChecked([]));
              window.scrollTo(0, 0);
            }}
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-lg font-semibold shadow hover:brightness-110 transition"
          >
            Reset Filters
          </button>
        </aside>

        {/* Main Section */}
        <main className="flex-1">
          <h2 className="text-white text-xl font-bold mb-6 text-center md:text-left">
            {products.length} Products Found
          </h2>

          {isLoading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
