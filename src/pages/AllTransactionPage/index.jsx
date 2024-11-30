import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer";

const AllTransactionsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAscending, setIsAscending] = useState(true); // State untuk arah pengurutan

  const token = localStorage.getItem("access_token");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("useEmail");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getAllTransactions();
  }, [token, navigate]);

  const getAllTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/all-transaction?is_paginate=false&per_page=5&page=1&search",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(response.data.result);
      setError(null);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.response?.data?.message || "Failed to fetch transactions");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (transactionId, newStatus) => {
    try {
      const response = await axios.post(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/transaction/update-status/${transactionId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error === false) {
        // Update local state to reflect new status
        const updatedTransactions = transactions.map((t) =>
          t.id === transactionId ? { ...t, status: newStatus } : t
        );
        setTransactions(updatedTransactions);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortTransactions = () => {
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = new Date(a.order_date);
      const dateB = new Date(b.order_date);
      return isAscending ? dateA - dateB : dateB - dateA;
    });
    setTransactions(sortedTransactions);
    setIsAscending(!isAscending); // Toggle arah pengurutan
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl font-semibold text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-xl font-semibold text-red-600">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            All Transactions
          </h1>

          {/* Tombol untuk mengurutkan */}
          <div className="text-center mb-6">
            <button
              onClick={sortTransactions}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Sort by Order Date ({isAscending ? "Newest" : "Oldest"})
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {transaction.transaction_items.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Invoice: {transaction.invoice_id}
                      </p>
                      <p className="text-sm text-gray-500">User: {userName}</p>
                      <p className="text-sm text-gray-500">
                        Email: {userEmail}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <select
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          transaction.status
                        )}`}
                        value={transaction.status}
                        onChange={(e) =>
                          updateTransactionStatus(
                            transaction.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="success">success</option>
                        <option value="failed">failed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Order Date:</span>{" "}
                        {formatDate(transaction.order_date)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Expires:</span>{" "}
                        {formatDate(transaction.expired_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Activity Date:</span>{" "}
                        {formatDate(
                          transaction.transaction_items.sport_activities
                            .activity_date
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Time:</span>{" "}
                        {transaction.transaction_items.sport_activities.start_time.slice(
                          0,
                          5
                        )}{" "}
                        -{" "}
                        {transaction.transaction_items.sport_activities.end_time.slice(
                          0,
                          5
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(transaction.total_amount)}
                    </div>
                    <div className="mt-2 md:mt-0">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span>{" "}
                        {transaction.transaction_items.sport_activities.address}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllTransactionsPage;
