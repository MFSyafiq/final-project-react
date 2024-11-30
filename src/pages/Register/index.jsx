import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    c_password: "",
    role: "",
    phone_number: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    const payload = {
      ...form,
    };

    axios
      .post(
        "https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/register",
        payload
      )
      .then((res) => {
        console.log("res", res);
        setSuccessMessage(
          res?.data?.data?.message ||
            "Registration successful! Redirecting to login..."
        );
        setErrorMessage("");
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((err) => {
        console.log("err", err);
        setErrorMessage(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
        setSuccessMessage("");
      });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-xl flex flex-col gap-4 p-8 shadow-lg w-[90%] max-w-md">
          <p className="text-center text-xl font-bold">Register</p>

          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              className="bg-gray-200 border rounded-lg p-2 pl-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={form.email}
              name="email"
              onChange={handleChange}
              placeholder="Username or Email"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Name</label>
            <input
              className="bg-gray-200 border rounded-lg p-2 pl-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={form.name}
              name="name"
              onChange={handleChange}
              placeholder="Name"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Role</label>
            <select
              className="bg-gray-200 border rounded-lg p-2 pl-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.role}
              name="role"
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Phone Number</label>
            <input
              className="bg-gray-200 border rounded-lg p-2 pl-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={form.phone_number}
              name="phone_number"
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>

          <div className="relative w-full">
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              className="bg-gray-200 border rounded-lg p-2 pl-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type={showPassword ? "text" : "password"}
              value={form.password}
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="relative w-full">
            <label className="block mb-1 text-gray-600">Confirm Password</label>
            <input
              className="bg-gray-200 border rounded-lg p-2 pl-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type={showConfirmPassword ? "text" : "password"}
              value={form.c_password}
              name="c_password"
              onChange={handleChange}
              placeholder="Confirm Password"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {successMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col items-center">
            <button
              className="bg-black text-white rounded-lg p-2 w-1/2 hover:bg-gray-700 transition-colors"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login">
              <span className="cursor-pointer text-blue-600 hover:underline">
                Login Here
              </span>
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
