import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login"></Navigate>;
  }
  return (
    <>
      {children} <Outlet />
    </>
  );
};
