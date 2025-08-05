import React from "react";
import ReactDOM from "react-dom/client"; // this will render in browser and put all into html
import App from "./App.jsx";
import "./index.css";
import { Route, RouterProvider, createRoutesFromElements } from "react-router"; // to check url and shows the right page 
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './redux/store.js';
import PrivateRoute from "./components/PrivateRoute";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// User Pages
import Profile from "./pages/User/Profile";
import UserOrders from "./pages/User/UserOrders"; 

// Admin Pages
import AdminRoute from "./pages/Admin/AdminRoute";
import UserList from "./pages/Admin/UserList";
import CategoryList from "./pages/Admin/CategoryList";
import ProductList from "./pages/Admin/ProductList";
import AllProducts from "./pages/Admin/AllProducts";
import ProductUpdate from "./pages/Admin/ProductUpdate";
import OrderList from "./pages/Admin/OrderList";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProductCreate from "./pages/Admin/ProductCreate";

// Shop Pages
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";

// Order Pages
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import Order from "./pages/Orders/Order.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(             
    <Route path="/" element={<App />}>    {/* whole navigation and all pages are wrapped inside main layout app.jsx  }
      {/* Public Routes  and i have divided 3 routes differently for each one*/}
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />

      {/* Private Routes for Logged-In Users */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/user-orders" element={<UserOrders />} /> {/* FIXED */}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="productlist/:pageNumber" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="product/create" element={<ProductCreate />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
