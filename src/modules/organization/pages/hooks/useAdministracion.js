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
    nombreFarmacia: "", direccion: "", esProvinciaLocal: true, porcentajeComision: "",
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

  const handleToggleFarmacia = (farmaciaId) => {
    setFormData((prev) => {
      const existe = prev.asignaciones.find((a) => a.farmaciaId === farmaciaId);
      if (existe) {
        return { ...prev, asignaciones: prev.asignaciones.filter((a) => a.farmaciaId !== farmaciaId) };
      } else {
        return { ...prev, asignaciones: [...prev.asignaciones, { farmaciaId, kilometros: 0 }] };
      }
    });
  };

  const handleCambiarKilometros = (farmaciaId, km) => {
    setFormData((prev) => ({
      ...prev,
      asignaciones: prev.asignaciones.map((a) => (a.farmaciaId === farmaciaId ? { ...a, kilometros: km } : a)),
    }));
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      if (pestana === "nutricionistas") {
        await nutricionistasService.crear({
          nombre: formData.nombre, apellidos: formData.apellidos, email: formData.email,
          telefono: formData.telefono, password: formData.password, asignaciones: formData.asignaciones,
        });
      }
      if (pestana === "farmacias") {
        await farmaciaService.crear({
          nombreFarmacia: formData.nombreFarmacia, direccion: formData.direccion,
          esProvinciaLocal: formData.esProvinciaLocal, porcentajeComision: Number(formData.porcentajeComision),
        });
      }
      if (pestana === "productos") {
        await productosService.crearProducto({
          nombreProducto: formData.nombreProducto, acronimo: formData.acronimo, categoria: formData.categoria,
          referencia: formData.referencia, pvf: Number(formData.pvf), pvp: Number(formData.pvp),
        });
      }
      alert("Creado correctamente.");
      setFormData({
        nombre: "", apellidos: "", email: "", telefono: "", password: "",
        nombreFarmacia: "", direccion: "", esProvinciaLocal: true, porcentajeComision: "",
        nombreProducto: "", acronimo: "", categoria: "", referencia: "", pvp: "", pvf: "", asignaciones: [],
      });
      cargarDatos();
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Error al crear el registro.");
    } finally {
      setEnviando(false);
    }
  };

  const handleActualizar = async (e, confirmPassword) => {
    e.preventDefault();
    try {
      if (pestana === "nutricionistas") {
        const payload = {
          nombre: itemEditando.nombre, apellidos: itemEditando.apellidos, email: itemEditando.email,
          telefono: itemEditando.telefono, asignaciones: itemEditando.asignaciones || [],
        };
        if (itemEditando.password && itemEditando.password === confirmPassword) {
          payload.password = itemEditando.password;
        }
        await nutricionistasService.actualizar(itemEditando.id, payload);
      }
      if (pestana === "farmacias") {
        await farmaciaService.actualizar(itemEditando.id, {
          nombreFarmacia: itemEditando.nombreFarmacia, direccion: itemEditando.direccion,
          esProvinciaLocal: itemEditando.esProvinciaLocal, porcentajeComision: Number(itemEditando.porcentajeComision),
        });
      }
      if (pestana === "productos") {
        await productosService.actualizar(itemEditando.id, {
          nombreProducto: itemEditando.nombreProducto, acronimo: itemEditando.acronimo, categoria: itemEditando.categoria,
          referencia: itemEditando.referencia, pvf: Number(itemEditando.pvf), pvp: Number(itemEditando.pvp),
        });
      }
      alert("Datos actualizados correctamente.");
      setItemEditando(null);
      setMostrarBajas(false);
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