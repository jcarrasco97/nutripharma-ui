import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

import { useFarmacias, farmaciaService } from "@/modules/organization/farmacias";
import { useNutricionistas, nutricionistasService } from "@/modules/organization/nutricionistas";
import { useProductos, productosService } from "@/modules/sales/catalogo";
import { usePersonalInterno } from "@/modules/organization/personal";

export const useAdministracion = () => {
  // ==========================================
  // ROL DEL USUARIO ACTUAL (isSuperAdmin)
  // ==========================================
  const isSuperAdmin = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const decoded = jwtDecode(token);
      const roles = decoded?.roles || decoded?.authorities || [];
      return roles.some((r) =>
        (typeof r === "string" ? r : r.authority || "")
          .toUpperCase()
          .includes("SUPERADMIN")
      );
    } catch {
      return false;
    }
  })();

  // ==========================================
  // ESTADO DE LA INTERFAZ (UI STATE)
  // ==========================================
  const [pestana, setPestana] = useState("nutricionistas");
  const [enviando, setEnviando] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [sheetAbierto, setSheetAbierto] = useState(false);

  const [modalAsignaciones, setModalAsignaciones] = useState({
    visible: false,
    tipo: null,
    item: null,
  });

  const abrirModalAsignaciones = (item, tipo) =>
    setModalAsignaciones({ visible: true, tipo, item });
  const cerrarModalAsignaciones = () =>
    setModalAsignaciones({ visible: false, tipo: null, item: null });

  const abrirSheetCrear = () => {
    setItemEditando(null);
    setSheetAbierto(true);
  };

  const abrirSheetEditar = (item) => {
    setItemEditando(item);
    setSheetAbierto(true);
  };

  const cerrarSheet = () => {
    setSheetAbierto(false);
    setItemEditando(null);
  };

  const [formData, setFormData] = useState({
    nombre: "", apellidos: "", email: "", telefono: "", password: "",
    nombreFarmacia: "", cif: "", direccion: "", esProvinciaLocal: true,
    porcentajeComision: "",
    nombreProducto: "", acronimo: "", categoria: "PEQUENO", referencia: "",
    pvp: "", pvf: "",
    asignaciones: [],
    // Personal interno (SuperAdmin)
    confirmPassword: "",
  });

  // ==========================================
  // CONSUMO DE MÓDULOS DE DOMINIO
  // ==========================================
  const { farmacias, farmaciasBajas, cargandoFarmacias, cargarFarmacias, eliminarFarmacia, restaurarFarmacia } = useFarmacias();
  const { nutricionistas, nutricionistasBajas, cargandoNutricionistas, cargarNutricionistas, eliminarNutricionista, restaurarNutricionista } = useNutricionistas();
  const { productos, productosBajas, cargandoProductos, cargarProductos, eliminarProducto, restaurarProducto, toggleStockProducto } = useProductos();

  // Personal interno (solo SuperAdmin)
  const personalHook = usePersonalInterno(isSuperAdmin);

  const cargando = cargandoFarmacias || cargandoNutricionistas || cargandoProductos;

  const cargarDatos = useCallback(async () => {
    await Promise.all([
      cargarFarmacias(),
      cargarNutricionistas(),
      cargarProductos(),
    ]);
  }, [cargarFarmacias, cargarNutricionistas, cargarProductos]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // ==========================================
  // MANEJADORES DE EVENTOS
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleToggleFarmacia = (farmaciaId) => {
    const targetSetter = itemEditando ? setItemEditando : setFormData;
    targetSetter((prev) => {
      const currentAsignaciones = prev.asignaciones || [];
      const existe = currentAsignaciones.find(
        (a) => (a.farmaciaId || a.id) === farmaciaId
      );
      if (existe) {
        return {
          ...prev,
          asignaciones: currentAsignaciones.filter(
            (a) => (a.farmaciaId || a.id) !== farmaciaId
          ),
        };
      } else {
        return {
          ...prev,
          asignaciones: [...currentAsignaciones, { farmaciaId, kilometros: 0 }],
        };
      }
    });
  };

  const handleCambiarKilometros = (farmaciaId, kms) => {
    const targetSetter = itemEditando ? setItemEditando : setFormData;
    targetSetter((prev) => ({
      ...prev,
      asignaciones: (prev.asignaciones || []).map((a) =>
        a.farmaciaId === farmaciaId ? { ...a, kilometros: Number(kms) } : a
      ),
    }));
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      if (pestana === "nutricionistas") {
        await nutricionistasService.crear({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono,
          password: formData.password,
          asignaciones: formData.asignaciones,
          horasContratoMensual: Number(formData.horasContratoMensual) || 40,
        });
      }
      if (pestana === "farmacias") {
        await farmaciaService.crear({
          nombre: formData.nombre,
          cif: formData.cif,
          direccion: formData.direccion,
          esProvinciaLocal: formData.esProvinciaLocal,
          porcentajeComision: Number(formData.porcentajeComision) || 30,
          email: formData.email,
          password: formData.password,
        });
      }
      if (pestana === "productos") {
        await productosService.crearProducto({
          nombreProducto: formData.nombreProducto,
          acronimo: formData.acronimo,
          categoria: formData.categoria,
          referencia: formData.referencia,
          pvf: Number(formData.pvf),
          pvp: Number(formData.pvp),
        });
      }
      if (pestana === "personal") {
        await personalHook.handleCrear(e);
        cerrarSheet();
        return;
      }

      setFormData({
        nombre: "", apellidos: "", email: "", telefono: "", password: "",
        cif: "", direccion: "", esProvinciaLocal: true, porcentajeComision: "",
        nombreProducto: "", acronimo: "", categoria: "PEQUENO", referencia: "",
        pvp: "", pvf: "", asignaciones: [], confirmPassword: "",
      });
      cerrarSheet();
      cargarDatos();
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Error al crear el registro.");
    } finally {
      setEnviando(false);
    }
  };

  const handleActualizar = async (e, confirmPassword) => {
    if (e) e.preventDefault();
    try {
      if (pestana === "nutricionistas") {
        const asignacionesLimpias = itemEditando.asignaciones.map((a) => ({
          farmaciaId: a.farmaciaId || a.id,
          kilometros: Number(a.kilometros) || 0,
        }));
        await nutricionistasService.actualizar(itemEditando.id, {
          nombre: itemEditando.nombre,
          apellidos: itemEditando.apellidos,
          email: itemEditando.email,
          telefono: itemEditando.telefono,
          horasContratoMensual: Number(itemEditando.horasContratoMensual) || 40,
          password: itemEditando.password || undefined,
          asignaciones: asignacionesLimpias,
        });
      } else if (pestana === "farmacias") {
        await farmaciaService.actualizar(itemEditando.id, {
          nombre: itemEditando.nombreFarmacia || itemEditando.nombre,
          cif: itemEditando.cif,
          telefono: itemEditando.telefono,
          email: itemEditando.email,
          direccion: itemEditando.direccion,
          esProvinciaLocal: itemEditando.esProvinciaLocal,
          password: itemEditando.password || undefined,
        });
      } else if (pestana === "productos") {
        await productosService.actualizar(itemEditando.id, {
          nombreProducto: itemEditando.nombreProducto,
          acronimo: itemEditando.acronimo,
          categoria: itemEditando.categoria,
          referencia: itemEditando.referencia,
          pvf: Number(itemEditando.pvf),
          pvp: Number(itemEditando.pvp),
        });
      }
      cerrarSheet();
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar los datos.");
    }
  };

  const handleEliminar = async (id, tipo) => {
    if (tipo === "nutricionista") await eliminarNutricionista(id);
    if (tipo === "farmacia") await eliminarFarmacia(id);
    if (tipo === "producto") await eliminarProducto(id);
    if (tipo === "admin") await personalHook.handleEliminar(id);
  };

  const handleRestaurar = async (id, tipo) => {
    if (tipo === "nutricionista") await restaurarNutricionista(id);
    if (tipo === "farmacia") await restaurarFarmacia(id);
    if (tipo === "producto") await restaurarProducto(id);
    if (tipo === "admin") await personalHook.handleRestaurar(id);
  };

  return {
    // Rol
    isSuperAdmin,
    // Pestañas
    pestana, setPestana,
    // Datos de dominio
    nutricionistas, farmacias, productos,
    nutricionistasBajas, farmaciasBajas, productosBajas,
    // Personal interno
    admins: personalHook.admins,
    adminsBajas: personalHook.adminsBajas,
    cargandoAdmins: personalHook.cargando,
    // Estado UI
    cargando, enviando,
    itemEditando, setItemEditando,
    sheetAbierto, setSheetAbierto,
    abrirSheetCrear, abrirSheetEditar, cerrarSheet,
    // Formulario de creación
    formData, setFormData,
    handleChange, handleCrear, handleActualizar, handleEliminar, handleRestaurar,
    // Modal asignaciones
    modalAsignaciones, abrirModalAsignaciones, cerrarModalAsignaciones,
    // Handlers de asignaciones
    handleToggleFarmacia, handleCambiarKilometros,
    handleToggleStock: toggleStockProducto,
    // Formulario personal interno (para el Sheet)
    formDataAdmin: personalHook.formData,
    setFormDataAdmin: personalHook.setFormData ?? (() => {}),
    handleChangeAdmin: personalHook.handleChange,
    handleCrearAdmin: personalHook.handleCrear,
    enviandoAdmin: personalHook.enviando,
  };
};