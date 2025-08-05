import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials(response));
      toast.success("Login successful!");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Login failed");
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center items-center px-6 md:px-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Sign In</h1>

        <form onSubmit={submitHandler} className="w-full max-w-md space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-black"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {isLoading && <Loader />}
        </form>

        <p className="mt-6 text-sm">
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-pink-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>

      {/* Image Section */}
      <div className="hidden md:block w-1/2">
    <img
      src="/download.jpg"
      alt="Sneaker design"
      className="object-cover w-full h-full"
    />

      </div>
    </div>
  );
};

export default Login;
