import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const TransactionPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isAscending, setIsAscending] = useState(true);
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedTransactionForProof, setSelectedTransactionForProof] =
    useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("access_token");
  const [uploadedProofUrl, setUploadedProofUrl] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getTransactionList();
  }, [token, navigate]);

  const getTransactionList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/my-transaction?is_paginate=false&per_page=5&page=1&search",
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
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await axios.post(
          "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (uploadResponse.data.error === false) {
          const proofUrl = uploadResponse.data.result;
          setUploadedProofUrl(proofUrl);
        }
      } catch (error) {
        console.error("Failed to upload payment proof:", error);

        setNotification({
          show: true,
          message: "Failed to upload payment proof",
          type: "error",
        });

        setTimeout(() => {
          setNotification({
            show: false,
            message: "",
            type: "",
          });
        }, 3000);
      }
    }
  };

  const handleConfirmProofUpload = async () => {
    try {
      await axios.post(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/transaction/update-proof-payment/${selectedTransactionForProof}`,
        {
          proof_payment_url: uploadedProofUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowProofModal(false);
      setUploadedProofUrl(null);
      setNotification({
        show: true,
        message: "Payment proof updated successfully",
        type: "success",
      });

      getTransactionList();

      setTimeout(() => {
        setNotification({
          show: false,
          message: "",
          type: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Failed to update payment proof:", error);

      setNotification({
        show: true,
        message: "Failed to update payment proof",
        type: "error",
      });

      setTimeout(() => {
        setNotification({
          show: false,
          message: "",
          type: "",
        });
      }, 3000);
    }
  };

  const handleCancelClick = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setShowModal(true);
  };

  const sortTransactions = () => {
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = new Date(a.order_date);
      const dateB = new Date(b.order_date);
      return isAscending ? dateA - dateB : dateB - dateA;
    });
    setTransactions(sortedTransactions);
    setIsAscending(!isAscending);
  };

  const handleCancelTransaction = async () => {
    try {
      setCancelLoading(true);
      await axios.post(
        `https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/transaction/cancel/${selectedTransactionId}`,
        { status: "success" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowModal(false);
      setSelectedTransactionId(null);

      setNotification({
        show: true,
        message: "Transaction cancelled successfully",
        type: "success",
      });

      await getTransactionList();

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (err) {
      console.error("Error cancelling transaction:", err);
      setNotification({
        show: true,
        message: err.response?.data?.message || "Failed to cancel transaction",
        type: "error",
      });
    } finally {
      setCancelLoading(false);
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
      case "paid":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            My Transactions
          </h1>

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
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.toUpperCase()}
                      </span>

                      {transaction.status.toLowerCase() === "pending" && (
                        <>
                          <button
                            onClick={() => handleCancelClick(transaction.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            disabled={cancelLoading}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTransactionForProof(transaction.id);
                              setShowProofModal(true);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Upload Proof
                          </button>
                        </>
                      )}
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

      {showProofModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg text-center w-96">
            <h2 className="text-xl font-semibold mb-4">Upload Payment Proof</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {!uploadedProofUrl ? (
              <button
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Select Payment Proof
              </button>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Uploaded Proof URL:
                </p>
                <div className="bg-gray-100 p-2 rounded mb-4 break-words">
                  {uploadedProofUrl}
                </div>
              </div>
            )}
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowProofModal(false);
                  setUploadedProofUrl(null);
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              {uploadedProofUrl && (
                <button
                  onClick={handleConfirmProofUpload}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg text-center">
            <p>Are you sure you want to cancel this transaction?</p>
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={handleCancelTransaction}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                disabled={cancelLoading}
              >
                {cancelLoading ? "Cancelling..." : "Yes"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTransactionId(null);
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                disabled={cancelLoading}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TransactionPage;
