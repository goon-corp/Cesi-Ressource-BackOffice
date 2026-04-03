import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../../pages/login";
import ForgotPassword from "../../pages/forgotPassword";
import Dashboard from "../../pages/dashboard/Dashboard";
import { HeaderLayout } from "./HeaderLayout";
import ProtectedRoute from "./ProtectedRoute";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HeaderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
