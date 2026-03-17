import axios from "axios";

const API_URL = "http://localhost:8080/api";
const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const pedidosService = {
  listarTodos: async () => {
    const response = await axios.get(`${API_URL}/pedidos`, getConfig());
    return response.data;
  },
  crear: async (datos) => {
    const response = await axios.post(`${API_URL}/pedidos`, datos, getConfig());
    return response.data;
  },
  liquidar: async (id) => {
    // NUEVA FUNCIÓN PARA LIQUIDAR
    const response = await axios.put(
      `${API_URL}/pedidos/${id}/liquidar`,
      {},
      getConfig(),
    );
    return response.data;
  },
};
