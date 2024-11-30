import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../footer";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityDetails, setActivityDetails] = useState(null);
  const [pagination, setPagination] = useState({
    categories: { page: 1, perPage: 5, totalPage: null },
    activities: { page: 1, perPage: 5, totalPage: null },
  });

  const navigate = useNavigate();

  const handleReservation = (activityId) => {
    sessionStorage.setItem("selectedActivityId", activityId);
    navigate("/payment-method-page");
  };

  const fetchCategories = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-categories?is_paginate=true&per_page=${pagination.categories.perPage}&page=${pagination.categories.page}`
      );
      setCategories(response.data.result.data);
      setPagination((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          totalPage: response.data.result.last_page,
        },
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  };

  const fetchActivities = async (categoryId) => {
    setLoading(true);
    try {
      const url = categoryId
        ? `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities?is_paginate=false&sport_category_id=${categoryId}`
        : `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities?is_paginate=true&per_page=${pagination.activities.perPage}&page=${pagination.activities.page}`;

      const response = await axios.get(url);
      setActivities(
        categoryId ? response.data.result : response.data.result.data
      );

      if (!categoryId) {
        setPagination((prev) => ({
          ...prev,
          activities: {
            ...prev.activities,
            totalPage: response.data.result.last_page,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
    setLoading(false);
  };

  const fetchActivityDetails = async (activityId) => {
    try {
      const response = await axios.get(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/sport-activities/${activityId}`
      );
      setActivityDetails(response.data.result);
    } catch (error) {
      console.error("Error fetching activity details:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchActivities();
  }, [pagination.categories.page, pagination.activities.page]);

  useEffect(() => {
    if (selectedCategory) {
      fetchActivities(selectedCategory);
    } else {
      fetchActivities();
    }
  }, [selectedCategory]);

  const handleNextCategories = () => {
    if (pagination.categories.page < pagination.categories.totalPage) {
      setPagination((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          page: prev.categories.page + 1,
        },
      }));
    }
  };

  const handleBackCategories = () => {
    if (pagination.categories.page > 1) {
      setPagination((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          page: prev.categories.page - 1,
        },
      }));
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <img
              src="image/logo2.png"
              alt="SportRes Logo"
              className="mx-auto w-64 " // Ukuran gambar logo lebih kecil dan diposisikan di tengah
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Sport Venue
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Book sports facilities and join activities in your area
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Sport Categories
            <div className="h-1 w-20 bg-blue-600 mt-2"></div>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleBackCategories}
              disabled={pagination.categories.page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-blue-50 disabled:opacity-50"
            >
              &#8592;
            </button>
            <button
              onClick={handleNextCategories}
              disabled={
                pagination.categories.page === pagination.categories.totalPage
              }
              className="p-2 rounded-lg border border-gray-300 hover:bg-blue-50 disabled:opacity-50"
            >
              &#8594;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* ALL button added */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-blue-50"
            }`}
          >
            <div className="text-2xl mb-3">🌐</div>
            <h3 className="font-semibold text-center">ALL</h3>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-blue-50"
              }`}
            >
              <div className="text-2xl mb-3">🏆</div>
              <h3 className="font-semibold text-center">{category.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Activities Section */}
      <div className="container mx-auto px-4 py-16 bg-white rounded-t-3xl shadow-inner">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          {selectedCategory ? "Category Activities" : "All Activities"}
          <div className="h-1 w-20 bg-blue-600 mt-2"></div>
        </h2>
        {/* No Activities Message */}
        {activities.length === 0 && (
          <div className="flex justify-center items-center py-16 text-center">
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="text-6xl mb-4">🏅</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Activities Not Available
              </h3>
              <p className="text-gray-600">
                {selectedCategory
                  ? "No activities found for this category at the moment."
                  : "No activities are currently available."}
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
                      <Link
                        to={`/activity-detail/${activity.id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleReservation(activity.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        Reserve Now →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
