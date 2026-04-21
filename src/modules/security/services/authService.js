import axios from "axios";

// Añadimos /api a la URL base
const API_URL = "http://localhost:8080/api";

export const authService = {
  login: async (username, password) => {
    // Esto llamará a http://localhost:8080/api/auth/login
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
    return response.data;
  },
  solicitarReset: async (email) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, null, {
      params: { email },
    });
    return response.data;
  },

  cambiarPassword: async (token, nuevaPassword) => {
    // Mandamos la password como String crudo
    const response = await axios.post(
      `${API_URL}/auth/reset-password`,
      `"${nuevaPassword}"`,
      {
        params: { token },
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  },
};
