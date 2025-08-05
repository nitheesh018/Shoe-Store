import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation, useUploadProductImageMutation } from "../../redux/api/productApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductCreate = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    quantity: "",
    countInStock: "",
    category: "",
    image: "",
  });

  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);
    setImagePreview(URL.createObjectURL(file)); // Show preview

    try {
      const res = await uploadProductImage(form).unwrap();
      setFormData((prev) => ({ ...prev, image: res.image }));
      toast.success("✅ Image uploaded");
    } catch (err) {
      toast.error(err?.data?.message || "❌ Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createProduct(formData).unwrap();
      toast.success("✅ Product created!");
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error(err?.data?.error || "❌ Failed to create product");
      console.error(err);
    }
  };

  if (!userInfo?.isAdmin) return <p className="text-center text-red-600">Unauthorized</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ Image Preview */}
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="max-h-[200px] mx-auto rounded mb-3" />
        )}

        {/* ✅ Image Upload Field */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border rounded px-3 py-2"
        />

        {/* ✅ All Other Fields */}
        {[
          "name",
          "brand",
          "description",
          "price",
          "quantity",
          "countInStock",
          "category",
        ].map((field) => (
          <input
            key={field}
            type={["price", "quantity", "countInStock"].includes(field) ? "number" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            className="w-full border rounded px-3 py-2"
            required
          />
        ))}

        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded w-full font-bold"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
