import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  BarChart3,
  ShoppingCart,
  Stethoscope,
  Package,
  FileText,
  Users,
  History,
  Calculator,
  FileBox,
} from "lucide-react";

export const useDashboard = () => {
  const navigate = useNavigate();

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

  // 👇 CIRUGÍA 1: Movemos la lectura de ROLES arriba para que el estado sepa quién eres al instante
  const userRoles = Array.isArray(usuario?.roles)
    ? usuario.roles.map((r) => (typeof r === "string" ? r : r.authority))
    : [];

  const isAdmin = userRoles.includes("ROLE_ADMIN");
  const isNutricionista = userRoles.includes("ROLE_NUTRICIONISTA");
  const isFarmacia = userRoles.includes("ROLE_FARMACIA");
  const isSuperAdmin = userRoles.includes("ROLE_SUPERADMIN");

  // 1. Inicialización de vistaActual (ahora sí sabe qué roles tienes)
  const [vistaActual, setVistaActual] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) return hash;
    if (isNutricionista) return "resumen";
    if (isFarmacia) return "resumen-farmacia";
    return "resumen-admin";
  });

  // 2. Sincronizar la URL cuando haces clic en el menú
  useEffect(() => {
    if (vistaActual) {
      window.history.pushState(null, "", `#${vistaActual}`);
    }
  }, [vistaActual]);

  // 3. Escuchar cuando el usuario le da al botón "Atrás" del navegador
  useEffect(() => {
    const manejarBotonAtras = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setVistaActual(hash); // Cambiamos la vista internamente
      }
    };

    window.addEventListener("popstate", manejarBotonAtras);
    return () => window.removeEventListener("popstate", manejarBotonAtras);
  }, []);



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

  const menuItems = useMemo(() => {
    const items = [];

    if (isNutricionista && !isAdmin) {
      items.push({ id: "resumen", label: "Resumen", icon: BarChart3 });
      items.push({ id: "pedidos", label: "Liquidación", icon: ShoppingCart });
      items.push({ id: "consultas", label: "Consultas", icon: Stethoscope });
      items.push({ id: "suministros", label: "Suministros", icon: Package });
    }

    if (isFarmacia) {
      if (!items.some((i) => i.id === "resumen-farmacia"))
        items.push({ id: "resumen-farmacia", label: "Resumen", icon: BarChart3 });

      if (!items.some((i) => i.id === "pedidos"))
        items.push({ id: "pedidos", label: "Pedidos", icon: ShoppingCart });

      items.push({ id: "historial-farmacia", label: "Historial", icon: History });
    }

    if (isAdmin) {
      if (!items.some((i) => i.id === "resumen-admin"))
        items.push({ id: "resumen-admin", label: "Dashboard", icon: BarChart3 });

      if (!items.some((i) => i.id === "pedidos"))
        items.push({ id: "pedidos", label: "Pedidos", icon: ShoppingCart });

      items.push({ id: "usuarios", label: "Administración", icon: Users });
    }

    if (!items.some((i) => i.id === "documentacion")) {
      items.push({ id: "documentacion", label: "Documentación", icon: FileText });
    }

    return items;
  }, [isAdmin, isNutricionista, isFarmacia, isSuperAdmin]);

  return {
    usuario,
    vistaActual,
    setVistaActual,
    handleLogout,
    menuItems,
    isAdmin,
    isNutricionista,
    isFarmacia,
  };
};