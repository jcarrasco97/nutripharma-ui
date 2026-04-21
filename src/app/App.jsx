import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// 👇 Importa el Toaster que creamos
import { Toaster } from "../shared/components/ui/Toaster";

// 👇 Nuevas rutas FSD
import Login from "../modules/security/components/Login";
import ResetPassword from "../modules/security/components/ResetPassword";
import Dashboard from "../layout/Dashboard"; // <-- Aquí estaba el fallo principal
import ProtectedRoute from "./router/ProtectedRoute";
import Playground from '../shared/playground/Playground'; // La crearemos ahora

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
