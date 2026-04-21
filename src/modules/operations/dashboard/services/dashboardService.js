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
  obtenerFacturacionAdmin: async (anioInicio, anioFin, farmaciaId, nutriId) => {
    let url = `${API_URL}/dashboard/admin/facturacion?anioInicio=${anioInicio}&anioFin=${anioFin}`;
    if (farmaciaId) url += `&farmaciaId=${farmaciaId}`;
    if (nutriId) url += `&nutricionistaId=${nutriId}`;

    const response = await axios.get(url, getConfig());
    return response.data;
  },

  obtenerRendimientoProductos: async (anioInicio, anioFin, mes, farmaciaId, nutriId) => {
    let url = `${API_URL}/dashboard/admin/rendimiento-productos?anioInicio=${anioInicio}&anioFin=${anioFin}`;
    if (mes) url += `&mes=${mes}`;
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

  descargarInformeProductosPdf: async (payload) => {
    const config = getConfig();
    config.responseType = 'blob';
    const response = await axios.post(`${API_URL}/dashboard/admin/rendimiento-productos/pdf`, payload, config);
    return response.data;
  },

  descargarInformeFacturacionPdf: async (payload) => {
    const config = getConfig();
    config.responseType = 'blob';
    const response = await axios.post(`${API_URL}/dashboard/admin/facturacion/pdf`, payload, config);
    return response.data;
  },

  obtenerRendimientoClinico: async (anioInicio, anioFin, mes, nutriId) => {
    let url = `${API_URL}/dashboard/admin/rendimiento-clinico?anioInicio=${anioInicio}&anioFin=${anioFin}`;
    if (mes) url += `&mes=${mes}`;
    if (nutriId) url += `&nutricionistaId=${nutriId}`;
    const response = await axios.get(url, getConfig());
    return response.data;
  },

  descargarInformeClinicoPdf: async (payload) => {
    const config = getConfig();
    config.responseType = 'blob';
    const response = await axios.post(`${API_URL}/dashboard/admin/clinico/pdf`, payload, config);
    return response.data;
  },
};
