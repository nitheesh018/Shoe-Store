import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
// CRUD OPERATIONS FOR CATEGORIES
const CategoryList = () => {
  const { data: categories = [], refetch } = useFetchCategoriesQuery();

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name: name.trim() }).unwrap();
      setName("");
      toast.success(`"${result.name}" created successfully.`);
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Creating category failed. Try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName.trim(),
        },
      }).unwrap();

      toast.success(`"${result.name}" updated successfully.`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Updating category failed.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory?._id) {
      toast.error("No category selected.");
      return;
    }

    try {
      const result = await deleteCategory({ categoryId: selectedCategory._id }).unwrap();
      toast.success(`"${selectedCategory.name}" deleted successfully.`);
      setSelectedCategory(null);
      setModalVisible(false);
      await refetch();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Category deletion failed. Try again.");
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <div className="h-12 font-bold text-xl">Manage Categories</div>

        {/* Create Form */}
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />

        <hr className="my-6 border-gray-300" />

        {/* Existing Categories */}
        <div className="flex flex-wrap">
          {categories.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        {/* Modal Update/Delete */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
