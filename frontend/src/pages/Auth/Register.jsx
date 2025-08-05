import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

// 🌄 Background Image URL (can be customized)
const backgroundImage ="/register.jpg";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Registration successful!");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-full flex">
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center items-center px-6 md:px-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Register</h1>

        <form onSubmit={submitHandler} className="w-full max-w-md space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-black"
              required
            />
          </div>

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

          <div>
            <label className="block mb-1 text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <p className="mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-pink-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex w-1/2">
        <img
          src={backgroundImage}
          alt="Register Visual"
          className="object-cover w-full h-screen"
        />
      </div>
    </div>
  );
};

export default Register;
