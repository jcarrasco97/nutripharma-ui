import axios from "axios";

// URL corregida a /api/farmacia
const API_URL = `${import.meta.env.VITE_API_URL}/api/farmacias`;

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const farmaciaService = {
  listarTodas: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },
  crear: async (farmaciaData) => {
    const response = await axios.post(API_URL, farmaciaData, getConfig());
    return response.data;
  },
  obtenerMiPerfil: async () => {
    const response = await axios.get(`${API_URL}/perfil/me`, getConfig());
    return response.data;
  },
  actualizar: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, getConfig());
    return response.data;
  },
  eliminar: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getConfig());
    return response.data;
  },
  listarBajas: async () => {
    const response = await axios.get(`${API_URL}/bajas`, getConfig());
    return response.data;
  },
  restaurar: async (id) => {
    const response = await axios.put(
      `${API_URL}/${id}/restaurar`,
      {},
      getConfig(),
    );
    return response.data;
  },
  ajustarSaldo: async (id, nuevoSaldo, nota) => {
    const response = await axios.put(
      `${API_URL}/${id}/ajustar-saldo`,
      { nuevoSaldo, nota },
      getConfig(),
    );
    return response.data;
  },
  obtenerMovimientos: async (id) => {
    const response = await axios.get(`${API_URL}/${id}/movimientos`, getConfig());
    return response.data;
  },
  obtenerMisMovimientos: async () => {
    const response = await axios.get(`${API_URL}/movimientos/me`, getConfig());
    return response.data;
  },
};
