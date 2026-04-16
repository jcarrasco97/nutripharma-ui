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
  obtenerFacturacionAdmin: async (anio, farmaciaId, nutriId) => {
    let url = `${API_URL}/dashboard/admin/facturacion?anio=${anio}`;
    if (farmaciaId) url += `&farmaciaId=${farmaciaId}`;
    if (nutriId) url += `&nutricionistaId=${nutriId}`;

    const response = await axios.get(url, getConfig());
    return response.data;
  },

  obtenerCalendarioAdmin: async (anio, mes) => {
    const response = await axios.get(
      `${API_URL}/dashboard/admin/calendario?anio=${anio}&mes=${mes}`,
      getConfig(),
    );
    return response.data;
  },

  obtenerConsultaDetalle: async (id) => {
    const response = await axios.get(`${API_URL}/consultas/${id}`, getConfig());
    return response.data;
  },

  obtenerPedidoDetalle: async (id) => {
    const response = await axios.get(`${API_URL}/pedidos/${id}`, getConfig());
    return response.data;
  },

  obtenerAuditoriaNutricionista: async (id, anio, mes) => {
    // IMPORTANTE: Ajustar desfase de índice - JS usa 0-11, Backend usa 1-12
    const mesAjustado = mes + 1;
    const response = await axios.get(
      `${API_URL}/dashboard/admin/auditoria/${id}?anio=${anio}&mes=${mesAjustado}`,
      getConfig(),
    );
    return response.data;
  },

  obtenerMesesDisponiblesAuditoria: async (id) => {
    const res = await axios.get(
      `${API_URL}/dashboard/admin/auditoria/${id}/meses`,
      getConfig(),
    );
    return res.data;
  },
};
