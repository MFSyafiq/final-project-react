import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../../components/footer";
import Navbar from "../../components/Navbar";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const token = localStorage.getItem("access_token");

  // Fetch all categories without pagination
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-categories?is_paginate=false",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data.result);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showNotification("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showNotification("Category name cannot be empty", "error");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-categories/create",
        { name: newCategoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showNotification("Category created successfully", "success");
      setNewCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      showNotification("Failed to create category", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      showNotification("Category name cannot be empty", "error");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-categories/update/${editingCategory.id}`,
        { name: editingCategory.name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showNotification("Category updated successfully", "success");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      showNotification("Failed to update category", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      await axios.delete(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-categories/delete/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification("Category deleted successfully", "success");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      showNotification("Failed to delete category", "error");
    } finally {
      setLoading(false);
    }
  };

  // Show notification helper
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}

      {/* Create Category */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New Category Name"
          className="flex-grow px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleCreateCategory}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Create Category
        </button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
          >
            {editingCategory?.id === category.id ? (
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                className="flex-grow px-2 py-1 border rounded"
              />
            ) : (
              <span className="font-medium">{category.name}</span>
            )}

            <div className="flex gap-2">
              {editingCategory?.id === category.id ? (
                <>
                  <button
                    onClick={handleUpdateCategory}
                    disabled={loading}
                    className="text-green-600 hover:text-green-800 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CategoryManagement;
