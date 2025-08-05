import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updateProfile, { isLoading }] = useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("✅ Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Profile update failed");
    }
  };

  return (
    <div className="container mx-auto px-4 mt-20">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="w-full md:w-1/2 bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-white">Update Profile</h2>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-white mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 rounded border bg-[#101011] text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 rounded border bg-[#101011] text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep existing"
                className="w-full p-3 rounded border bg-[#101011] text-white"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full p-3 rounded border bg-[#101011] text-white"
              />
            </div>

            {isLoading && <Loader />}

            <div className="flex justify-between items-center mt-6">
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-6 rounded-lg font-semibold"
              >
                Update
              </button>

              <Link
                to="/user-orders"
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-6 rounded-lg"
              >
                My Orders
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
