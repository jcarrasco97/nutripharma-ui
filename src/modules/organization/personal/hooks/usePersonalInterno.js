import { useState, useEffect, useCallback } from "react";
import { personalInternoService } from "../services/personalInternoService";

export const usePersonalInterno = () => {
  const [admins, setAdmins] = useState([]);
  const [adminsBajas, setAdminsBajas] = useState([]);
  const [mostrarBajas, setMostrarBajas] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // 1. Añadimos confirmPassword al estado inicial
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellidos: "",
  });

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [datosAdmins, datosBajas] = await Promise.all([
        personalInternoService.listarAdmins(),
        personalInternoService.listarBajas().catch(() => []),
      ]);
      setAdmins(datosAdmins);
      setAdminsBajas(datosBajas);
    } catch (error) {
      console.error("Error al cargar administradores:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    // 🛡️ ESCUDO: Validación Frontend de Contraseñas
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden. Por favor, revísalas.");
      return; // Bloquea la ejecución aquí mismo
    }

    setEnviando(true);
    try {
      // 2. Extraemos solo lo que el backend necesita para no mandar "confirmPassword"
      const payload = {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
      };

      await personalInternoService.crearAdmin(payload);

      alert("Administrador creado con éxito. Ya puede iniciar sesión.");

      // 3. Limpiamos todos los campos, incluyendo la confirmación
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        nombre: "",
        apellidos: "",
      });

      setMostrarBajas(false);
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || "Error al crear administrador.");
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (
      !window.confirm(
        "¿Seguro que deseas revocar el acceso a este Administrador?",
      )
    )
      return;
    try {
      await personalInternoService.eliminarAdmin(id);
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar admin:", error);
      alert(
        error.response?.data?.message ||
          "Error al eliminar. Puede que sea el SuperAdmin.",
      );
    }
  };

  const handleRestaurar = async (id) => {
    if (
      !window.confirm(
        "¿Seguro que deseas reactivar a este Administrador? Recuperará todos sus privilegios de acceso.",
      )
    )
      return;
    try {
      await personalInternoService.restaurarAdmin(id);
      cargarDatos();
    } catch (error) {
      console.error("Error al restaurar admin:", error);
      alert("Error al restaurar el registro.");
    }
  };

  return {
    admins,
    adminsBajas,
    mostrarBajas,
    setMostrarBajas,
    cargando,
    enviando,
    formData,
    handleChange,
    handleCrear,
    handleEliminar,
    handleRestaurar,
  };
};
