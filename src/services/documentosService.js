import axios from "axios";

const API_URL = "http://localhost:8080/api/documentos";

const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const documentosService = {
  listar: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },

  // Nueva ruta para el desplegable de usuarios
  obtenerDestinatarios: async () => {
    const response = await axios.get(`${API_URL}/destinatarios`, getConfig());
    return response.data;
  },

  subir: async (formData) => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // Dejamos que Axios ponga el Content-Type y el Boundary automáticamente
      },
    });
    return response.data;
  },

  descargar: async (id, nombreOriginal) => {
    const response = await axios.get(`${API_URL}/${id}/descargar`, {
      ...getConfig(),
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nombreOriginal);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  },

  // Nueva ruta para eliminar documentos definitamente
  eliminar: async (id) => {
    // Es vital pasar el getConfig() para que Spring Security sepa que eres ADMIN
    const response = await axios.delete(`${API_URL}/${id}`, getConfig());
    return response.data;
  },
};
