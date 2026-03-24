import React, { useEffect, useState } from "react";
import {
  LogOut,
  Activity,
  BarChart3,
  ShoppingCart,
  Stethoscope,
  Package,
  FileText,
  ShieldCheck,
  Users,
  Menu,
  History,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Importación de Vistas (NUEVA ARQUITECTURA FEATURE-BASED)

// 1. Vistas del propio módulo Dashboard (Misma carpeta: ./)
import VistaResumen from "./VistaResumen";
import VistaResumenFarmacia from "./VistaResumenFarmacia";
import VistaResumenAdmin from "./VistaResumenAdmin";

// 2. Vistas de otros módulos (Subimos un nivel: ../)
import VistaConsultas from "../consultas/VistaConsultas";
import VistaHistorialFarmacia from "../consultas/VistaHistorialFarmacia";

import VistaPedidos from "../pedidos/VistaPedidos";

import VistaSuministros from "../suministros/VistaSuministros";
import VistaAdminSuministros from "../suministros/VistaAdminSuministros";

import VistaDocumentacion from "../documentacion/VistaDocumentacion";

// 3. Vistas de Administración
import VistaValidaciones from "../admin/VistaValidaciones";
import VistaAdministracion from "../admin/VistaAdministracion";
import VistaPersonalInterno from "../admin/VistaPersonalInterno";

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. ESTADOS
  const [usuario] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return { email: decoded.sub, roles: decoded.roles || [] };
    } catch {
      return null;
    }
  });

  // Estado para controlar qué módulo se ve al arrancar
  const [vistaActual, setVistaActual] = useState(() => {
    // 1. Si es el Jefe (Admin), lo mandamos directo a su nuevo panel gráfico y calendario.
    // Ya no importa si también es Nutricionista, su vista principal es la de mando.
    if (usuario && usuario.roles.includes("ROLE_ADMIN")) {
      return "resumen-admin";
    }

    // 2. Si es Farmacia, lo mandamos directo a su resumen.
    if (usuario && usuario.roles.includes("ROLE_FARMACIA")) {
      return "resumen"; // <--- NUEVO VALOR
    }

    // 3. Por defecto (para las Nutricionistas base), a su resumen operativo.
    return "resumen";
  });

  const [menuAbierto, setMenuAbierto] = useState(false);

  // 2. PROTECCIÓN DE RUTA
  useEffect(() => {
    if (!usuario) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [usuario, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!usuario) return null;

  // 3. CONTROL DE ROLES
  const isAdmin = usuario.roles.includes("ROLE_ADMIN");
  const isNutricionista = usuario.roles.includes("ROLE_NUTRICIONISTA");
  const isFarmacia = usuario.roles.includes("ROLE_FARMACIA");
  const isSuperAdmin = usuario.roles.includes("ROLE_SUPERADMIN"); // <-- AÑADIDO

  // 4. GENERACIÓN DEL MENÚ DINÁMICO
  const generarMenu = () => {
    const items = [];

    // Módulos de Nutricionista
    if (isNutricionista) {
      items.push({
        id: "resumen",
        label: "Resumen Operativo",
        icon: BarChart3,
      });
      items.push({
        id: "pedidos",
        label: "Pedidos y Liquidación",
        icon: ShoppingCart,
      });
      items.push({
        id: "consultas",
        label: "Mis Consultas",
        icon: Stethoscope,
      });
      items.push({
        id: "suministros",
        label: "Petición Suministros",
        icon: Package,
      });
    }

    // Módulos de Farmacia
    if (isFarmacia) {
      // Usamos .some para no duplicar botones si el usuario tuviera perfiles raros
      if (!items.some((i) => i.id === "resumen"))
        items.push({ id: "resumen", label: "Mi Resumen", icon: BarChart3 });
      if (!items.some((i) => i.id === "pedidos"))
        items.push({
          id: "pedidos",
          label: "Hacer Pedido",
          icon: ShoppingCart,
        });
      items.push({
        id: "historial-farmacia",
        label: "Historial Consultas",
        icon: History,
      });
    }

    // Módulos Exclusivos del Admin (Paco)
    if (isAdmin) {
      items.push({
        id: "resumen-admin",
        label: "Dashboard General",
        icon: BarChart3,
      });
      items.push({
        id: "validaciones",
        label: "Centro Validaciones",
        icon: ShieldCheck,
      });
      items.push({ id: "usuarios", label: "Administración", icon: Users });
    }

    // El módulo de Documentación es para todos, así que lo empujamos una sola vez al final
    items.push({
      id: "documentacion",
      label: "Gestión Documental",
      icon: FileText,
    });

    // --- NUEVO: Módulo Exclusivo del SuperAdmin (Paco) ---
    if (isSuperAdmin) {
      items.push({
        id: "personal-interno",
        label: "Personal Interno",
        icon: Shield,
      });
    }

    return items;
  };

  const menuItems = generarMenu();

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* SIDEBAR */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-sky-600 text-white rounded-lg"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        <Menu size={24} />
      </button>

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col
          ${menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-20 flex items-center px-8 border-b border-gray-100 bg-sky-600 text-white">
          <Activity size={28} className="mr-3" />
          <h1 className="text-2xl font-bold tracking-tight">NutriPharma</h1>
        </div>

        <div className="p-6 border-b border-gray-100 bg-sky-50">
          <p className="text-xs text-sky-600 font-bold uppercase tracking-wider mb-1">
            Conectado como
          </p>
          <p
            className="text-sm font-medium text-gray-800 truncate"
            title={usuario.email}
          >
            {usuario.email}
          </p>
          <div className="flex gap-2 mt-2">
            {isNutricionista && (
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-md font-bold">
                Nutricionista
              </span>
            )}
            {isFarmacia && (
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md font-bold">
                Farmacia
              </span>
            )}
            {isAdmin && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md font-bold">
                Admin
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icono = item.icon;
            const activo = vistaActual === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setVistaActual(item.id);
                  setMenuAbierto(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activo
                    ? "bg-sky-100 text-sky-700 font-bold shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                }`}
              >
                <Icono
                  size={20}
                  className={`mr-3 ${activo ? "text-sky-600" : "text-gray-400"}`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors"
          >
            <LogOut size={20} className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 hidden md:flex">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {vistaActual.replace("-", " ")}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {/* 👇 AQUÍ INSERTAMOS LA VISTA DEL ADMIN 👇 */}
          {vistaActual === "resumen-admin" ? (
            <VistaResumenAdmin />
          ) : vistaActual === "resumen" ? (
            isFarmacia ? (
              <VistaResumenFarmacia cambiarVista={setVistaActual} />
            ) : (
              <VistaResumen />
            )
          ) : vistaActual === "consultas" ? (
            <VistaConsultas />
          ) : vistaActual === "pedidos" ? (
            <VistaPedidos />
          ) : vistaActual === "suministros" ? (
            <VistaSuministros />
          ) : vistaActual === "documentacion" ? (
            <VistaDocumentacion />
          ) : vistaActual === "validaciones" ? (
            <VistaValidaciones />
          ) : vistaActual === "admin-suministros" ? (
            <VistaAdminSuministros />
          ) : vistaActual === "historial-farmacia" ? (
            <VistaHistorialFarmacia />
          ) : vistaActual === "usuarios" ? (
            <VistaAdministracion />
          ) : vistaActual === "personal-interno" ? (
            <VistaPersonalInterno /> // <-- AÑADIDO
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] flex items-center justify-center">
              <div className="text-center">
                <Activity size={48} className="mx-auto text-sky-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700">
                  Módulo en construcción
                </h3>
                <p className="text-gray-500 mt-2">
                  Estás en la vista:{" "}
                  <span className="font-bold text-sky-600">{vistaActual}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {menuAbierto && (
        <div
          className="fixed inset-0 bg-gray-800/50 z-30 md:hidden"
          onClick={() => setMenuAbierto(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
