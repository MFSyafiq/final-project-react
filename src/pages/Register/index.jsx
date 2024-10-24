import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = () => {
    const payload = {
      ...form,
    };

    axios
      .post("https://reqres.in/api/register", payload)
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => {});
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-xl flex flex-col gap-6 p-8 shadow-lg w-[90%] max-w-md">
          <p className="text-center text-xl font-bold">Register</p>
          <input
            className="bg-gray-200 border rounded-lg p-2 pl-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={form.email}
            name="email"
            onChange={handleChange}
            placeholder="Username or Email"
          />
          <input
            className="bg-gray-200 border rounded-lg p-2 pl-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            value={form.password}
            name="password"
            onChange={handleChange}
            placeholder="Password"
          />
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
