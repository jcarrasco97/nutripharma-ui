import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Configuración para que Axios envíe siempre el Token en las cabeceras
const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const dashboardService = {
  obtenerResumenNutricionista: async (id, anio, mes) => {
    const response = await axios.get(
      `${API_URL}/dashboard/nutricionistas/${id}/resumen?anio=${anio}&mes=${mes}`,
      getConfig(),
    );
    return response.data;
  },
};
