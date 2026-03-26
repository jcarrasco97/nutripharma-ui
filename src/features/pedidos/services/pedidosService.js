import axios from "axios";

const API_URL = "http://localhost:8080/api/pedidos";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const pedidosService = {
  // Lista absolutamente todos (solo para Admin)
  listarTodos: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },

  // Crea un nuevo pedido
  crear: async (datos) => {
    const response = await axios.post(API_URL, datos, getConfig());
    return response.data;
  },

  // Liquida un pedido existente
  liquidar: async (id) => {
    const response = await axios.put(
      `${API_URL}/${id}/liquidar`,
      {},
      getConfig(),
    );
    return response.data;
  },

  // Obtiene solo los pedidos del usuario conectado (Nutri o Farmacia)
  obtenerMisPedidos: async () => {
    const response = await axios.get(`${API_URL}/mis-pedidos`, getConfig());
    return response.data;
  },
  obtenerTodos: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },
  marcarComoEnviadoAdmin: async (id, repartos = []) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/${id}/enviar`, repartos, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
