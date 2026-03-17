import axios from "axios";

const API_URL = "http://localhost:8080/api";
const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const consultasService = {
  listarTodas: async () => {
    const response = await axios.get(`${API_URL}/consultas`, getConfig());
    return response.data;
  },
  crear: async (datos) => {
    const response = await axios.post(
      `${API_URL}/consultas`,
      datos,
      getConfig(),
    );
    return response.data;
  },
  confirmar: async (id) => {
    const response = await axios.put(
      `${API_URL}/consultas/${id}/confirmar`,
      {},
      getConfig(),
    );
    return response.data;
  },
  abrirIncidencia: async (id, mensaje) => {
    // Al enviar solo un String, le decimos explícitamente a Spring Boot que es texto plano
    const response = await axios.put(
      `${API_URL}/consultas/${id}/incidencia`,
      mensaje,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "text/plain",
        },
      },
    );
    return response.data;
  },
};
