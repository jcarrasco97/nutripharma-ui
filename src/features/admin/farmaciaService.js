import axios from "axios";

const API_URL = "http://localhost:8080/api";

const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const farmaciaService = {
  listarTodas: async () => {
    const response = await axios.get(`${API_URL}/farmacias`, getConfig());
    return response.data;
  },

  // ¡AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA!
  crear: async (farmaciaData) => {
    const response = await axios.post(
      `${API_URL}/farmacias`,
      farmaciaData,
      getConfig(),
    );
    return response.data;
  },
  obtenerMiPerfil: async () => {
    const response = await axios.get(
      `${API_URL}/farmacias/perfil/me`,
      getConfig(),
    );
    return response.data;
  },
  // Añade esto:
  actualizar: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data, getConfig());
    return response.data;
  },
  eliminar: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getConfig());
    return response.data;
  },
};
