import axios from "axios";

// URL absoluta al controlador
const API_URL = `${import.meta.env.VITE_API_URL}/api/personal-interno`;

const getConfig = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const personalInternoService = {
  crearAdmin: async (datos) => {
    const response = await axios.post(`${API_URL}/admin`, datos, getConfig());
    return response.data;
  },
  listarAdmins: async () => {
    const response = await axios.get(`${API_URL}/admin`, getConfig());
    return response.data;
  },
  eliminarAdmin: async (id) => {
    const response = await axios.delete(`${API_URL}/admin/${id}`, getConfig());
    return response.data;
  },
  actualizarAdmin: async (id, datos) => {
    const response = await axios.put(`${API_URL}/admin/${id}`, datos, getConfig());
    return response.data;
  },
  // --- NUEVA FUNCIÓN PARA EL CEMENTERIO ---
  listarBajas: async () => {
    const response = await axios.get(`${API_URL}/admin/bajas`, getConfig());
    return response.data;
  },
  restaurarAdmin: async (id) => {
    const response = await axios.put(
      `${API_URL}/admin/${id}/restaurar`,
      {},
      getConfig(),
    );
    return response.data;
  },
};
