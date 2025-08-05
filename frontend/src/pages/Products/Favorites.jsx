import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="px-6 md:px-20 py-10">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Favorite Products ❤️
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400 text-center">
          You haven't added any favorites yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
