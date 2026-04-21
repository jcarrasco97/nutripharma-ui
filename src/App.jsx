import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// 👇 Importa el Toaster que creamos
import { Toaster } from "./shared/components/ui/Toaster";

// 👇 Nuevas rutas FSD
import Login from "./features/auth/views/Login";
import ResetPassword from "./features/auth/views/ResetPassword";
import Dashboard from "./core/layout/Dashboard"; // <-- Aquí estaba el fallo principal
import ProtectedRoute from "./core/routes/ProtectedRoute";
import Playground from './features/playground/Playground'; // La crearemos ahora

function App() {
  return (
    <BrowserRouter>
      {/* 👇 Añade el componente aquí. Se mantendrá "invisible" hasta que dispares un toast */}
      <Toaster position="top-right" expand={false} richColors />

      <Routes>
        <Route path="/sandbox" element={<Playground />} />
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
