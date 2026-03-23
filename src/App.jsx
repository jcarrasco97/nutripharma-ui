import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./features/auth/Login";
import ResetPassword from "./features/auth/ResetPassword";
import Dashboard from "./features/dashboard/Dashboard";
import ProtectedRoute from "./core/routes/ProtectedRoute"; // <-- Importamos al portero

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Ruta PRIVADA: Envolvemos el Dashboard con el ProtectedRoute */}
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
