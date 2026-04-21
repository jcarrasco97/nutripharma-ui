import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { authService } from "../services/authService";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tokenReset = searchParams.get("token");

  // Estados de Login
  const [credenciales, setCredenciales] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [cargando, setCargando] = useState(false);
  const [vistaRecuperar, setVistaRecuperar] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados de Reset Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Efecto: Mostrar mensaje de éxito si venimos de cambiar la contraseña
  useEffect(() => {
    if (location.state?.resetExitoso) {
      setMensajeExito("¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.");
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Manejador Genérico
  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    setError("");
  };

  // Acción 1: Iniciar Sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setMensajeExito("");
    try {
      const data = await authService.login(credenciales.username, credenciales.password);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Credenciales incorrectas o cuenta inactiva.");
    } finally {
      setCargando(false);
    }
  };

  // Acción 2: Pedir email de recuperación
  const handlePedirRecuperacion = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    try {
      await authService.solicitarReset(emailRecuperacion);
      setMensajeExito("Si el correo existe, hemos enviado un enlace. Revisa tu bandeja de entrada.");
      setTimeout(() => {
        setVistaRecuperar(false);
        setMensajeExito("");
      }, 5000);
    } catch (err) {
      console.error("Error al pedir recuperación:", err);
      setError("Error al solicitar la recuperación.");
    } finally {
      setCargando(false);
    }
  };

  // Acción 3: Guardar la nueva contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, verifícalas.");
      setCargando(false);
      return;
    }

    try {
      await authService.cambiarPassword(tokenReset, newPassword);
      navigate("/", { replace: true, state: { resetExitoso: true } });
    } catch (err) {
      console.error("Error al guardar nueva contraseña:", err);
      setError("Este enlace ya ha sido utilizado o ha caducado por seguridad.");
    } finally {
      setCargando(false);
    }
  };

  return {
    // Datos y funciones genéricas
    cargando, error, setError, mensajeExito,
    
    // Login
    credenciales, handleChange, handleLogin, showPassword, setShowPassword,
    
    // Recuperar
    vistaRecuperar, setVistaRecuperar, emailRecuperacion, setEmailRecuperacion, handlePedirRecuperacion,
    
    // Reset
    tokenReset, newPassword, setNewPassword, confirmPassword, setConfirmPassword, 
    showConfirmPassword, setShowConfirmPassword, handleResetPassword
  };
};