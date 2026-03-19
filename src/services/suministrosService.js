import axios from "axios";

// Ajustamos la URL base al nuevo controlador
const API_URL = "http://localhost:8080/api/suministros";

const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const suministrosService = {
  listarMateriales: async () => {
    const response = await axios.get(`${API_URL}/materiales`, getConfig());
    return response.data;
  },

  // Cambiamos listarPeticiones a la ruta personalizada
  obtenerMisPeticiones: async () => {
    const response = await axios.get(`${API_URL}/mis-peticiones`, getConfig());
    return response.data;
  },

  // Enviamos directamente el array de IDs en un objeto { materialIds: [...] }
  crearPeticion: async (materialIds) => {
    const response = await axios.post(
      `${API_URL}/peticiones`,
      { materialIds },
      getConfig(),
    );
    return response.data;
  },
  // --- MÉTODOS PARA EL ADMIN ---
  listarPeticionesAdmin: async () => {
    const response = await axios.get(
      `${API_URL}/peticiones-admin`,
      getConfig(),
    );
    return response.data;
  },

  cambiarEstado: async (id, estado) => {
    // Usamos params para enviar el estado en la URL: ?estado=APROBADO
    const response = await axios.put(
      `${API_URL}/peticiones/${id}/estado`,
      null,
      {
        ...getConfig(),
        params: { estado },
      },
    );
    return response.data;
  },
};
