import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import "./Navigation.css";

const Navigation = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-[#000] w-[4%] hover:w-[15%] h-screen fixed transition-all duration-300`}
      id="navigation-container"
    >
      {/* TOP LINKS */}
      <div className="flex flex-col justify-center space-y-4">
        {/* HOME */}
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>

        {/* SHOP */}
        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>

        {/* CART */}
        <Link to="/cart" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">CART</span>
          </div>
          {cartItems.length > 0 && (
            <div className="absolute top-9 left-6 text-sm text-white bg-pink-500 rounded-full px-1">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </div>
          )}
        </Link>

        {/* FAVORITES */}
        <Link to="/favorite" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <FaHeart className="mt-[3rem] mr-2" size={20} />
            <span className="hidden nav-item-name mt-[3rem]">FAVORITES</span>
          </div>
          <FavoritesCount />
        </Link>
      </div>

      {/* USER DROPDOWN / LOGIN */}
      <div className="relative">
        {userInfo ? (
          <>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 text-white focus:outline-none mt-10"
            >
              <span>{userInfo.username}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <ul
                className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-800 rounded shadow-md p-2 w-[180px] z-50 ${
                  !userInfo.isAdmin ? "-top-40" : "-top-[22rem]"
                }`}
              >
                {userInfo.isAdmin && (
                  <>
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categorylist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Users
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                </li>

                <li>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </>
        ) : (
          <ul className="mt-10 space-y-4">
            <li>
              <Link
                to="/login"
                className="flex items-center transition-transform transform hover:translate-x-2"
              >
                <AiOutlineLogin className="mr-2" size={26} />
                <span className="hidden nav-item-name">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center transition-transform transform hover:translate-x-2"
              >
                <AiOutlineUserAdd className="mr-2" size={26} />
                <span className="hidden nav-item-name">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
