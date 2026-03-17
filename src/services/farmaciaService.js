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
};
