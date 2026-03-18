import axios from "axios";

const API_URL = "http://localhost:8080/api/nutricionistas";
const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const nutricionistasService = {
  listarTodas: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },
  crear: async (datos) => {
    // Los datos que le pasamos deben coincidir EXACTAMENTE con tu NutricionistaRequest de Java
    const response = await axios.post(API_URL, datos, getConfig());
    return response.data;
  },
  obtenerMiPerfil: async () => {
    // Fíjate que ahora dice /perfil/me
    const response = await axios.get(
      "http://localhost:8080/api/nutricionistas/perfil/me",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      },
    );
    return response.data;
  },
};
