import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 👇 Todo con el alias @ apuntando directo a la raíz de src/
import { Toaster } from "@/shared/components/ui/Toaster"; // (Si moviste Toaster a shared/ui/)
import { Login, ResetPassword } from "@/modules/security";
import Dashboard from "@/layout/Dashboard";
import Playground from '@/shared/playground/Playground'; // (O donde lo hayas puesto)

// Este se queda con ./ porque está en la misma carpeta app/router/
import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
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