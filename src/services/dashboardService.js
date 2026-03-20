import axios from "axios";

const API_URL = "http://localhost:8080/api";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const dashboardService = {
  // Para los Nutricionistas
  obtenerResumenNutricionista: async (id, anio, mes) => {
    const response = await axios.get(
      `${API_URL}/dashboard/nutricionistas/${id}/resumen?anio=${anio}&mes=${mes}`,
      getConfig(),
    );
    return response.data;
  },

  // 👇 NUEVO PARA EL ADMIN 👇
  obtenerFacturacionAdmin: async (anio) => {
    const response = await axios.get(
      `${API_URL}/dashboard/admin/facturacion?anio=${anio}`,
      getConfig(),
    );
    return response.data;
  },

  obtenerCalendarioAdmin: async (anio, mes) => {
    const response = await axios.get(
      `${API_URL}/dashboard/admin/calendario?anio=${anio}&mes=${mes}`,
      getConfig(),
    );
    return response.data;
  },
};
