import axios from "axios";

const API_URL = "http://localhost:8080/api/consultas";
const getConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const consultasService = {
  listarTodas: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },
  obtenerMisConsultas: async () => {
    const response = await axios.get(`${API_URL}/mis-consultas`, getConfig());
    return response.data;
  },
  // AQUÍ ESTÁN LOS NOMBRES QUE ESPERA TU COMPONENTE
  crear: async (datos) => {
    const response = await axios.post(API_URL, datos, getConfig());
    return response.data;
  },
  confirmar: async (id) => {
    const response = await axios.put(
      `${API_URL}/${id}/confirmar`,
      {},
      getConfig(),
    );
    return response.data;
  },
  abrirIncidencia: async (id, mensaje) => {
    const response = await axios.put(`${API_URL}/${id}/incidencia`, mensaje, {
      headers: { ...getConfig().headers, "Content-Type": "text/plain" },
    });
    return response.data;
  },
  obtenerHistorialFarmacia: async () => {
    const response = await axios.get(
      `${API_URL}/historial-farmacia`,
      getConfig(),
    );
    return response.data;
  },
  obtenerTodas: async () => {
    const response = await axios.get(API_URL, getConfig());
    return response.data;
  },
  validarTurnoAdmin: async (id) => {
    const response = await axios.put(
      `${API_URL}/${id}/validar`,
      {},
      getConfig(),
    );
    return response.data;
  },

  // 👇 NUEVAS LLAMADAS PARA EL SISTEMA DE EDICIÓN Y CANCELACIÓN 👇
  editarYValidarTurnoAdmin: async (id, datos) => {
    // datos = { nuevas: 3, revisiones: 2, promociones: 0, personalFarmacia: 0 }
    const response = await axios.put(
      `${API_URL}/${id}/editar-validar`,
      datos,
      getConfig(),
    );
    return response.data;
  },

  cancelarTurnoAdmin: async (id) => {
    const response = await axios.put(
      `${API_URL}/${id}/cancelar`,
      {},
      getConfig(),
    );
    return response.data;
  },

  // 👇 NUEVO MÉTODO PARA SUBIR FOTOS (EVIDENCIAS) 👇
  subirEvidencia: async (consultaId, archivoArchivo) => {
    const formData = new FormData();
    formData.append("file", archivoArchivo);

    const config = getConfig();
    config.headers["Content-Type"] = "multipart/form-data";

    const response = await axios.post(
      `${API_URL}/${consultaId}/evidencia`,
      formData,
      config,
    );
    return response.data;
  },
  // Descarga la imagen y genera una URL local para React
  verEvidencia: async (consultaId) => {
    const config = getConfig();
    config.responseType = "blob";

    const response = await axios.get(
      `${API_URL}/${consultaId}/evidencia`,
      config,
    );

    const tipoArchivo = response.headers["content-type"] || "image/jpeg";
    const blob = new Blob([response.data], { type: tipoArchivo });

    // RETORNAMOS la URL en lugar de abrirla en una pestaña
    return window.URL.createObjectURL(blob);
  },
  // Permite al admin destruir una foto rechazada
  eliminarEvidenciaAdmin: async (consultaId) => {
    const response = await axios.delete(
      `${API_URL}/${consultaId}/evidencia`,
      getConfig(),
    );
    return response.data;
  },
  liquidarLote: async (ids) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/liquidar-lote`, ids, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};
