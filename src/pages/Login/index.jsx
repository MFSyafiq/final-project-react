import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    const payload = {
      username: email,
      password: password,
    };

    axios
      .post("https://reqres.in/api/login", payload)
      .then((res) => {
        const token = res?.data?.token;
        localStorage.setItem("access_token", token);

        setSuccess(true);
        setError(false);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        setError(err?.response.data.error);
        setSuccess("");
      });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="bg-white rounded-xl flex flex-col gap-6 p-8 shadow-lg max-w-md w-full mx-4">
          <p className="text-2xl font-semibold justify-center flex">Login</p>

          <input
            className="bg-gray-200 border rounded-lg p-2 pl-4 w-full"
            type="text"
            placeholder="Email"
            onChange={handleChangeEmail}
          />
          <input
            className="bg-gray-200 border rounded-lg p-2 pl-4 w-full"
            type="password"
            placeholder="Password"
            onChange={handleChangePassword}
          />
          {error && (
            <p className="text-red-400 font-bold text-center">{error}</p>
          )}

          <div className="flex flex-col items-center">
            <button
              className="bg-black text-white rounded-lg p-2 w-1/2 hover:bg-gray-700 transition-colors"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          <p className="text-center">
            Don't have an account yet?{" "}
            <Link to="/register">
              <span className="cursor-pointer text-[#0000EE] hover:underline">
                Register Here
              </span>
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
