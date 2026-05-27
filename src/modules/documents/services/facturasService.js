import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/facturas`;

const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const facturasService = {
  subirFactura: async (formData) => {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  obtenerMisFacturas: async () => {
    const response = await axios.get(`${API_URL}/mis-facturas`, getConfig());
    return response.data;
  },

  obtenerTodas: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },

  descargarFactura: async (id, nombreArchivo) => {
    const response = await axios.get(`${API_URL}/${id}/descargar`, {
      ...getConfig(),
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", nombreArchivo || `factura_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  },

  eliminarFactura: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getConfig());
    return response.data;
  },
};
