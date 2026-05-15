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
  Calendar,
  FileBarChart,
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

  const userRoles = Array.isArray(usuario?.roles)
    ? usuario.roles.map((r) => (typeof r === "string" ? r : r.authority))
    : [];

  const isAdmin = userRoles.includes("ROLE_ADMIN");
  const isNutricionista = userRoles.includes("ROLE_NUTRICIONISTA");
  const isFarmacia = userRoles.includes("ROLE_FARMACIA");
  const isSuperAdmin = userRoles.includes("ROLE_SUPERADMIN");

  const [vistaActual, setVistaActual] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) return hash;
    if (isNutricionista) return "resumen";
    if (isFarmacia) return "resumen-farmacia";
    // Admin: la vista inicial es ahora "rendimiento" (ex "resumen-admin")
    return "rendimiento";
  });

  useEffect(() => {
    if (vistaActual) window.history.pushState(null, "", `#${vistaActual}`);
  }, [vistaActual]);

  useEffect(() => {
    const manejarBotonAtras = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) setVistaActual(hash);
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

    // ── NUTRICIONISTA ──────────────────────────────────────────────────────────
    if (isNutricionista && !isAdmin) {
      items.push({ id: "resumen", label: "Resumen", icon: BarChart3 });
      items.push({ id: "pedidos", label: "Liquidación", icon: ShoppingCart });
      items.push({ id: "consultas", label: "Consultas", icon: Stethoscope });
      items.push({ id: "suministros", label: "Suministros", icon: Package });
    }

    // ── FARMACIA ───────────────────────────────────────────────────────────────
    if (isFarmacia) {
      if (!items.some((i) => i.id === "resumen-farmacia"))
        items.push({ id: "resumen-farmacia", label: "Resumen", icon: BarChart3 });
      if (!items.some((i) => i.id === "pedidos"))
        items.push({ id: "pedidos", label: "Pedidos", icon: ShoppingCart });
      items.push({ id: "historial-farmacia", label: "Historial", icon: History });
    }

    // ── ADMIN ──────────────────────────────────────────────────────────────────
    if (isAdmin) {
      // Grupo "Inicio" — los tres nuevos ítems sustituyen a "resumen-admin"
      items.push({ id: "rendimiento", label: "Rendimiento", icon: BarChart3 });
      items.push({ id: "calendario", label: "Calendario", icon: Calendar });
      items.push({ id: "informes", label: "Informes", icon: FileBarChart });

      // Grupo "Área de trabajo"
      items.push({ id: "validaciones-consultas", label: "Consultas", icon: Stethoscope });
      if (!items.some((i) => i.id === "pedidos"))
        items.push({ id: "pedidos", label: "Pedidos", icon: ShoppingCart });
      items.push({ id: "validaciones-suministros", label: "Material", icon: Package });

      // Planos
      items.push({ id: "usuarios", label: "Administración", icon: Users });
    }

    // Documentación — visible para todos los roles
    if (!items.some((i) => i.id === "documentacion"))
      items.push({ id: "documentacion", label: "Documentación", icon: FileText });

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