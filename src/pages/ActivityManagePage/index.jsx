import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/footer";
import Navbar from "../../components/Navbar";

const SportActivitiesManagement = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 5,
    totalPage: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    sport_category_id: "",
    activity_date: "",
    start_time: "",
    end_time: "",
    address: "",
    price: "",
    slot: "",
  });
  const [selectedActivity, setSelectedActivity] = useState(null);

  const navigate = useNavigate();

  // Fetch Activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities?is_paginate=true&per_page=${pagination.perPage}&page=${pagination.page}`
      );
      setActivities(response.data.result.data);
      setPagination((prev) => ({
        ...prev,
        totalPage: response.data.result.last_page,
      }));
    } catch (error) {
      console.error("Error fetching activities:", error);
      alert("Failed to fetch activities");
    }
    setLoading(false);
  };

  // Fetch Categories (for display)
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-categories"
      );
      setCategories(response.data.result.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Delete Activity
  const handleDeleteActivity = async (activityId) => {
    if (
      window.confirm(`Are you sure you want to delete activity ${activityId}?`)
    ) {
      try {
        await axios.delete(
          `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities/delete/${activityId}`
        );
        alert("Activity deleted successfully");
        fetchActivities(); // Refresh the list
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert(error.response?.data?.message || "Failed to delete activity");
      }
    }
  };

  // Pagination Handlers
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPage) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));
    }
  };

  // Formatting Utilities
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Fetch activities and categories on component mount and when pagination changes
  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, [pagination.page]);

  const handleOpenModal = (type, activity = null) => {
    setModalType(type);
    setSelectedActivity(activity);
    if (activity) {
      setFormValues({
        title: activity.title,
        sport_category_id: activity.sport_category.id,
        activity_date: activity.activity_date,
        start_time: activity.start_time,
        end_time: activity.end_time,
        address: activity.address,
        price: activity.price,
        slot: activity.slot,
      });
    } else {
      setFormValues({
        title: "",
        sport_category_id: "",
        activity_date: "",
        start_time: "",
        end_time: "",
        address: "",
        price: "",
        slot: "",
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmitForm = async () => {
    try {
      if (modalType === "create") {
        await axios.post(
          "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities",
          formValues
        );
        alert("Activity created successfully");
      } else if (modalType === "edit") {
        await axios.put(
          `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities/update/${selectedActivity.id}`,
          formValues
        );
        alert("Activity updated successfully");
      }
      fetchActivities();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.message || "Failed to submit form");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities/delete/${selectedActivity.id}`
      );
      alert("Activity deleted successfully");
      fetchActivities();
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert(error.response?.data?.message || "Failed to delete activity");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sport Activities Management
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Manage and View Your Sport Activities
            </p>
          </div>
        </div>
      </div>

      {/* Activities Management Section */}
      <div className="container mx-auto px-4 py-16 bg-white rounded-t-3xl shadow-inner">
        {/* Create Activity Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => handleOpenModal("create")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            + Create Activity
          </button>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-600">
            Page {pagination.page} of {pagination.totalPage}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-blue-50 disabled:opacity-50"
            >
              &#8592; Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={pagination.page === pagination.totalPage}
              className="p-2 rounded-lg border border-gray-300 hover:bg-blue-50 disabled:opacity-50"
            >
              Next &#8594;
            </button>
          </div>
        </div>

        {/* No Activities Message */}
        {activities.length === 0 && (
          <div className="flex justify-center items-center py-16 text-center">
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="text-6xl mb-4">🏅</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                No Activities Found
              </h3>
              <p className="text-gray-600">
                Create your first sport activity to get started.
              </p>
            </div>
          </div>
        )}

        {/* Activities Grid */}
        {activities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-2">
                    {activity.sport_category.name}
                  </span>
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {activity.title}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600">📅</span>
                    <span>{formatDate(activity.activity_date)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600">⏰</span>
                    <span>
                      {formatTime(activity.start_time)} -{" "}
                      {formatTime(activity.end_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600">📍</span>
                    <span className="text-sm">{activity.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600">👥</span>
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span>Available Slots</span>
                        <span className="font-semibold">
                          {activity.participants.length} / {activity.slot}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{
                            width: `${
                              (activity.participants.length / activity.slot) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(activity.price)}
                      </div>
                      {activity.price_discount > activity.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(activity.price_discount)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal("edit", activity)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenModal("delete", activity)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {modalType === "delete" ? (
              <>
                <h3 className="text-xl font-bold mb-4">
                  Confirm Delete Activity
                </h3>
                <p>Are you sure you want to delete this activity?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteActivity}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">
                  {modalType === "create" ? "Create Activity" : "Edit Activity"}
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formValues.title}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <select
                      name="sport_category_id"
                      value={formValues.sport_category_id}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Other input fields */}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={handleCloseModal}
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitForm}
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SportActivitiesManagement;
