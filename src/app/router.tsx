import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../shared/guards/ProtectedRoute";
import AppLayout from "./AppLayout";
import NotFoundPage from "./NotFoundPage";

import HomePage from "../features/discovery/pages/HomePage";
import CategoriesPage from "../features/discovery/pages/CategoriesPage";
import CategoryPage from "../features/discovery/pages/CategoryPage";
import SearchPage from "../features/discovery/pages/SearchPage";
import AuthPage from "../features/auth/pages/authPage";
import OtpPage from "../features/auth/pages/OtpPage";
import MyProfilePage from "../features/auth/pages/MyProfilePage";
// import ActivatePage from "../features/auth/pages/ActivatePage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import ProfilePage from "../features/users/pages/ProfilePage";
import CreateProjectPage from "../features/projects/pages/CreateProjectPage";
import ProjectDetailPage from "../features/projects/pages/ProjectDetailPage";
import { ProjectsPage } from "../features/projects/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "categories/:slug", element: <CategoryPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:id", element: <ProjectDetailPage /> },
      { path: "authenticate", element: <AuthPage/>},
      { path: "verify-otp", element: <OtpPage/>},
      { path: "my-profile", element: <MyProfilePage/>},
      // { path: "login", element: <LoginPage /> },
      // { path: "register", element: <RegisterPage /> },
      // { path: "activate/:token", element: <ActivatePage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "projects/create", element: <CreateProjectPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
