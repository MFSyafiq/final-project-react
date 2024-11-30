import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showModal, setShowModal] = useState(false); // State untuk modal

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");

    if (token) {
      setIsLoggedIn(true);
      setUserName(storedUserName || "");
      setUserRole(storedUserRole || "");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("access_token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");

      setIsLoggedIn(false);
      setUserName("");
      setUserRole("");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userRole");
        navigate("/login");
      }
    }
  };

  return (
    <div className="bg-black p-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {isLoggedIn && <div className="text-white">Welcome, {userName}</div>}

        <div className="flex space-x-3 md:space-x-5 text-white">
          <Link to="/" className="hover:underline">
            <p>Home</p>
          </Link>

          {!isLoggedIn ? (
            <Link to="/login" className="hover:underline">
              <p>Login/Register</p>
            </Link>
          ) : (
            <>
              {userRole === "user" && (
                <Link to="/my-transaction-page" className="hover:underline">
                  <p>My Transaction</p>
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/all-transaction-page" className="hover:underline">
                  <p>All Transactions</p>
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/category-manage-page" className="hover:underline">
                  <p>Category Manage</p>
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/activity-manage-page" className="hover:underline">
                  <p>Activity Manage</p>
                </Link>
              )}
              <button
                onClick={() => setShowModal(true)}
                className="text-white hover:underline cursor-pointer"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded shadow-lg text-center">
            <p>Apakah Anda yakin untuk log out?</p>
            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  handleLogout();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
