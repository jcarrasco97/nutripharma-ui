import axios from "axios";

const API_URL = "http://localhost:8080/api";
const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const suministrosService = {
  listarMateriales: async () => {
    const response = await axios.get(
      `${API_URL}/suministros/materiales`,
      getConfig(),
    );
    return response.data;
  },
  listarPeticiones: async () => {
    const response = await axios.get(
      `${API_URL}/suministros/peticiones`,
      getConfig(),
    );
    return response.data;
  },
  crearPeticion: async (datos) => {
    const response = await axios.post(
      `${API_URL}/suministros/peticiones`,
      datos,
      getConfig(),
    );
    return response.data;
  },
};
