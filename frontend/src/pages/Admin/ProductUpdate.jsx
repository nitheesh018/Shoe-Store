import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(_id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData) {
      setImage(productData.image || "");
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setStock(productData.countInStock || "");
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      await updateProduct({
        productId: _id,
        formData,
      }).unwrap();

      toast.success("Product updated successfully");
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Update failed. Try again.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await deleteProduct({ productId: _id }).unwrap();
      toast.success(`"${res?.name || 'Product'}" deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <h2 className="text-xl font-bold mb-4">Update / Delete Product</h2>

          {image && (
            <div className="text-center">
              <img src={image} alt="product" className="block mx-auto w-full h-[40%]" />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-white font-bold mb-2">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="block mt-2 text-white"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Name", value: name, set: setName },
                { label: "Price", value: price, set: setPrice, type: "number" },
                { label: "Quantity", value: quantity, set: setQuantity, type: "number" },
                { label: "Brand", value: brand, set: setBrand },
                { label: "Count in Stock", value: stock, set: setStock, type: "number" },
              ].map(({ label, value, set, type = "text" }) => (
                <div key={label}>
                  <label>{label}</label>
                  <input
                    type={type}
                    className="p-4 mb-3 border rounded-lg bg-[#101011] text-white w-full"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                  />
                </div>
              ))}

              <div>
                <label>Category</label>
                <select
                  className="p-4 mb-3 border rounded-lg bg-[#101011] text-white w-full"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label>Description</label>
              <textarea
                className="p-4 mb-3 border rounded-lg bg-[#101011] text-white w-full"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-4 mt-6">
              <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold">
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
