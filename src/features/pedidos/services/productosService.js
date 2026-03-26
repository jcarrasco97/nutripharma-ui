import axios from "axios";

const API_URL = "http://localhost:8080/api/productos";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const productosService = {
  crearProducto: async (productoData) => {
    const response = await axios.post(API_URL, productoData, getConfig());
    return response.data;
  },
  listarTodos: async () => {
    const response = await axios.get(API_URL, getConfig());
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
  toggleStock: async (id) => {
    const response = await axios.patch(
      `${API_URL}/${id}/stock`,
      {},
      getConfig(),
    );
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
};
