import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  BarChart3,
  ShoppingCart,
  Stethoscope,
  Package,
  FileText,
  ShieldCheck,
  Users,
  History,
  Shield,
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

  const [vistaActual, setVistaActual] = useState(() => {
    if (usuario && usuario.roles.includes("ROLE_ADMIN")) return "resumen-admin";
    if (usuario && usuario.roles.includes("ROLE_FARMACIA")) return "resumen";
    return "resumen";
  });

  const [menuAbierto, setMenuAbierto] = useState(false);

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

  const userRoles = Array.isArray(usuario?.roles)
    ? usuario.roles.map((r) => (typeof r === "string" ? r : r.authority))
    : [];

  const isAdmin = userRoles.includes("ROLE_ADMIN");
  const isNutricionista = userRoles.includes("ROLE_NUTRICIONISTA");
  const isFarmacia = userRoles.includes("ROLE_FARMACIA");
  const isSuperAdmin = userRoles.includes("ROLE_SUPERADMIN");

  const menuItems = useMemo(() => {
    const items = [];

    if (isNutricionista && !isAdmin) {
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

    if (isFarmacia) {
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

    if (isAdmin) {
      if (!items.some((i) => i.id === "resumen-admin"))
        items.push({
          id: "resumen-admin",
          label: "Dashboard General",
          icon: BarChart3,
        });
      if (!items.some((i) => i.id === "pedidos"))
        items.push({
          id: "pedidos",
          label: "Crear Pedido (Proxy)",
          icon: ShoppingCart,
        });
      items.push({
        id: "validaciones",
        label: "Centro Validaciones",
        icon: ShieldCheck,
      });
      items.push({ id: "usuarios", label: "Administración", icon: Users });
    }

    if (!items.some((i) => i.id === "documentacion")) {
      items.push({
        id: "documentacion",
        label: "Gestión Documental",
        icon: FileText,
      });
    }

    if (isSuperAdmin) {
      if (!items.some((i) => i.id === "personal-interno")) {
        items.push({
          id: "personal-interno",
          label: "Personal Interno",
          icon: Shield,
        });
      }
    }

    return items;
  }, [isAdmin, isNutricionista, isFarmacia, isSuperAdmin]);

  return {
    usuario,
    vistaActual,
    setVistaActual,
    menuAbierto,
    setMenuAbierto,
    handleLogout,
    menuItems,
    isAdmin,
    isNutricionista,
    isFarmacia,
  };
};
