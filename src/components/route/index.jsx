import DetailMenuPage from "../../pages/DetailMenuPage";
import LandingPage from "../../pages/LandingPage";
import EditPage from "../../pages/EditPage";
import Register from "../../pages/Register";
import MenuPage from "../../pages/MenuPage";
import Login from "../../pages/Login";
import { ProtectedRoute } from "./ProtectedRoute";

export const route = [
  { path: "/", element: <LandingPage /> },
  { path: "login", element: <Login /> },
  { path: "register", element: <Register /> },
  {
    path: "menu-page",
    element: (
      <ProtectedRoute>
        <MenuPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "menu-detail/:id",
    element: (
      <ProtectedRoute>
        <DetailMenuPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "edit-page",
    element: (
      <ProtectedRoute>
        <EditPage />
      </ProtectedRoute>
    ),
  },
];
