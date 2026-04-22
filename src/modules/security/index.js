// src/modules/security/index.js

// Exportamos las vistas para el Router
export { default as Login } from './components/Login';
export { default as ResetPassword } from './components/ResetPassword';

// Exportamos el hook y el servicio por si la capa global (App/Providers) los necesita
export { useAuth } from './hooks/useAuth';
export { authService } from './services/authService';