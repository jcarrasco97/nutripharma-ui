import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import ResetPassword from "./features/auth/ResetPassword";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./core/routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
