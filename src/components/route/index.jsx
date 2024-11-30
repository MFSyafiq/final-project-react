import LandingPage from "../../pages/LandingPage";
import Register from "../../pages/Register";
import Login from "../../pages/Login";
import AcitvityDetailPage from "../../pages/ActivityDetailPage";
import MyTransactionPage from "../../pages/MyTransactionPage";
import AllTransactionPage from "../../pages/AllTransactionPage";
import CategoryManagePage from "../../pages/CategoryManagePage";
import ActivityManagePage from "../../pages/ActivityManagePage";
import { ProtectedRoute } from "./ProtectedRoute";

export const route = [
  { path: "/", element: <LandingPage /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  {
    path: "activity-detail/:id",
    element: (
      <ProtectedRoute>
        <AcitvityDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "my-transaction-page",
    element: (
      <ProtectedRoute>
        <MyTransactionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "all-transaction-page",
    element: (
      <ProtectedRoute>
        <AllTransactionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "category-manage-page",
    element: (
      <ProtectedRoute>
        <CategoryManagePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "activity-manage-page",
    element: (
      <ProtectedRoute>
        <ActivityManagePage />
      </ProtectedRoute>
    ),
  },
];
