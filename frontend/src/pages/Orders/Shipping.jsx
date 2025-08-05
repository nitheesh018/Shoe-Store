import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";

import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress?.address) {
      setAddress("");
      setCity("");
      setPostalCode("");
      setCountry("");
    }
  }, [shippingAddress]);

  return (
    <div className="container mx-auto mt-10 px-4">
      <ProgressSteps step1 step2 />

      <div className="max-w-2xl mx-auto bg-[#181818] p-6 rounded-lg mt-12 shadow-md text-white">
        <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              required
              className="w-full p-3 rounded border bg-[#101011] text-white"
            />
          </div>

          <div>
            <label className="block mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              required
              className="w-full p-3 rounded border bg-[#101011] text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter postal code"
              required
              className="w-full p-3 rounded border bg-[#101011] text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country"
              required
              className="w-full p-3 rounded border bg-[#101011] text-white"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">Select Payment Method</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="form-radio text-pink-500"
                />
                <span className="ml-2">PayPal / Credit Card</span>
              </label>
              {/* Optional: Add more payment options here */}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 rounded-lg font-bold mt-6"
          >
            Continue to Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
