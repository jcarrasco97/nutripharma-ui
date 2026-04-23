import { useState, useEffect, useCallback } from "react";

// 1. IMPORTAMOS TUS NUEVOS HOOKS MODULARES DESDE SUS BARRELS
import { useFarmacias, farmaciaService } from "@/modules/organization/farmacias";
import { useNutricionistas, nutricionistasService } from "@/modules/organization/nutricionistas";
import { useProductos, productosService } from "@/modules/sales/catalogo";

export const useAdministracion = () => {
  // ==========================================
  // ESTADO DE LA INTERFAZ (UI STATE) - INTACTO
  // ==========================================
  const [pestana, setPestana] = useState("nutricionistas");
  const [mostrarBajas, setMostrarBajas] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);

  const [modalAsignaciones, setModalAsignaciones] = useState({
    visible: false,
    tipo: null,
    item: null,
  });

  const abrirModalAsignaciones = (item, tipo) => setModalAsignaciones({ visible: true, tipo, item });
  const cerrarModalAsignaciones = () => setModalAsignaciones({ visible: false, tipo: null, item: null });

  const [formData, setFormData] = useState({
    nombre: "", apellidos: "", email: "", telefono: "", password: "",
    nombreFarmacia: "", cif: "", direccion: "", esProvinciaLocal: true, porcentajeComision: "", // 👈 AÑADIDO cif: ""
    nombreProducto: "", acronimo: "", categoria: "", referencia: "", pvp: "", pvf: "",
    asignaciones: [],
  });

  // ==========================================
  // CONSUMO DE MÓDULOS DE DOMINIO
  // ==========================================
  const { farmacias, farmaciasBajas, cargandoFarmacias, cargarFarmacias, eliminarFarmacia, restaurarFarmacia } = useFarmacias();
  const { nutricionistas, nutricionistasBajas, cargandoNutricionistas, cargarNutricionistas, eliminarNutricionista, restaurarNutricionista } = useNutricionistas();
  const { productos, productosBajas, cargandoProductos, cargarProductos, eliminarProducto, restaurarProducto, toggleStockProducto } = useProductos();

  // Consolidamos el estado de carga
  const cargando = cargandoFarmacias || cargandoNutricionistas || cargandoProductos;

  const cargarDatos = useCallback(async () => {
    await Promise.all([
      cargarFarmacias(),
      cargarNutricionistas(),
      cargarProductos()
    ]);
  }, [cargarFarmacias, cargarNutricionistas, cargarProductos]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // ==========================================
  // MANEJADORES DE EVENTOS (ORQUESTACIÓN) - INTACTOS
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // 1. Corregimos la lógica del Checkbox para que use 'id' o 'farmaciaId' de forma segura
  const handleToggleFarmacia = (farmaciaId) => {
    const targetSetter = itemEditando ? setItemEditando : setFormData;

    targetSetter((prev) => {
      const currentAsignaciones = prev.asignaciones || [];
      // 🛡️ Buscamos por farmaciaId (nuevo) o id (si ya venía del backend)
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

  // 2. Corregimos los kilómetros para que sepa dónde escribir
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
          horasContratoMensual: Number(formData.horasContratoMensual) || 40
        });
      }
      if (pestana === "farmacias") {
        await farmaciaService.crear({
          // 👇 1. FIX 500: Usamos "nombre" porque así se llama el input y así lo espera el Backend
          nombre: formData.nombre,
          cif: formData.cif,
          direccion: formData.direccion,
          esProvinciaLocal: formData.esProvinciaLocal,
          porcentajeComision: Number(formData.porcentajeComision) || 30, // Fallback por seguridad
          email: formData.email,
          password: formData.password
        });
      }
      if (pestana === "productos") {
        await productosService.crearProducto({
          nombreProducto: formData.nombreProducto, acronimo: formData.acronimo, categoria: formData.categoria,
          referencia: formData.referencia, pvf: Number(formData.pvf), pvp: Number(formData.pvp),
        });
      }
      alert("Creado correctamente.");

      // 👇 2. FIX REACT WARNING: Reseteamos TODOS los campos estrictamente a ""
      setFormData({
        nombre: "", apellidos: "", email: "", telefono: "", password: "",
        cif: "", direccion: "", esProvinciaLocal: true, porcentajeComision: "", // <-- ¡Aquí faltaba el CIF!
        nombreProducto: "", acronimo: "", categoria: "PEQUENO", referencia: "", pvp: "", pvf: "", asignaciones: [],
      });

      cargarDatos();
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Error al crear el registro.");
    } finally {
      setEnviando(false);
    }
  };

  // Corregimos la actualización para que el backend reciba exactamente lo que espera
  const handleActualizar = async (e, confirmPassword) => {
    if (e) e.preventDefault();
    try {
      if (pestana === "nutricionistas") {
        const asignacionesLimpias = itemEditando.asignaciones.map(a => ({
          farmaciaId: a.farmaciaId || a.id,
          kilometros: Number(a.kilometros) || 0
        }));

        await nutricionistasService.actualizar(itemEditando.id, {
          nombre: itemEditando.nombre,
          apellidos: itemEditando.apellidos,
          email: itemEditando.email,
          telefono: itemEditando.telefono,
          // 👇 LA LÍNEA QUE FALTA PARA EVITAR EL ERROR 500 👇
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
      }
      // ... resto del código (alert, setItemEditando, cargarDatos)
      alert("Datos actualizados correctamente.");
      setItemEditando(null);
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar los datos.");
    }
  };

  // Mapeamos las funciones a las de los módulos
  const handleEliminar = async (id, tipo) => {
    if (tipo === "nutricionista") await eliminarNutricionista(id);
    if (tipo === "farmacia") await eliminarFarmacia(id);
    if (tipo === "producto") await eliminarProducto(id);
  };

  const handleRestaurar = async (id, tipo) => {
    if (tipo === "nutricionista") await restaurarNutricionista(id);
    if (tipo === "farmacia") await restaurarFarmacia(id);
    if (tipo === "producto") await restaurarProducto(id);
  };

  return {
    pestana, setPestana,
    nutricionistas, farmacias, productos,
    nutricionistasBajas, farmaciasBajas, productosBajas,
    mostrarBajas, setMostrarBajas,
    cargando, enviando,
    itemEditando, setItemEditando,
    formData, setFormData,
    handleChange, handleCrear, handleActualizar, handleEliminar, handleRestaurar,
    modalAsignaciones, abrirModalAsignaciones, cerrarModalAsignaciones,
    handleToggleFarmacia, handleCambiarKilometros,
    handleToggleStock: toggleStockProducto
  };
};