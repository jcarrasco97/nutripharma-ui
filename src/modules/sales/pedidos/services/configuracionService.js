import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/configuracion`;

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const configuracionService = {
  obtenerConfiguracion: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },

  actualizarLimiteMonedero: async (nuevoLimite) => {
    const response = await axios.put(
      `${API_URL}/limite-monedero`,
      { limiteMonedero: nuevoLimite },
      getConfig()
    );
    return response.data;
  },
};
