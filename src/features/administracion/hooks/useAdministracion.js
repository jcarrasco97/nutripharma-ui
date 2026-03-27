import { useState, useEffect, useCallback } from "react";
import { farmaciaService } from "../services/farmaciaService";
import { nutricionistasService } from "../services/nutricionistasService";
import { productosService } from "../../pedidos/services/productosService";

export const useAdministracion = () => {
  const [pestana, setPestana] = useState("nutricionistas");
  const [nutricionistas, setNutricionistas] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [farmaciasBajas, setFarmaciasBajas] = useState([]);
  const [nutricionistasBajas, setNutricionistasBajas] = useState([]);
  const [mostrarBajas, setMostrarBajas] = useState(false);
  const [productosBajas, setProductosBajas] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);

  // --- NUEVO ESTADO PARA EL MODAL DE VISTA RÁPIDA ---
  const [modalAsignaciones, setModalAsignaciones] = useState({
    visible: false,
    tipo: null,
    item: null,
  });
  const abrirModalAsignaciones = (item, tipo) =>
    setModalAsignaciones({ visible: true, tipo, item });
  const cerrarModalAsignaciones = () =>
    setModalAsignaciones({ visible: false, tipo: null, item: null });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellidos: "",
    telefono: "", // <-- CAMBIADO: Antes dni
    horasContratoMensual: "",
    cif: "",
    direccion: "",
    nombreProducto: "",
    acronimo: "",
    categoria: "PEQUENO",
    referencia: "",
    pvf: "",
    pvp: "",
    asignaciones: [],
    esProvinciaLocal: true,
    porcentajeComision: 30,
  });

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [
        datosNutris,
        datosFarms,
        datosProds,
        bajasNutris,
        bajasFarms,
        bajasProds,
      ] = await Promise.all([
        nutricionistasService.listarTodas().catch(() => []),
        farmaciaService.listarTodas().catch(() => []),
        productosService.listarTodos().catch(() => []),
        nutricionistasService.listarBajas().catch(() => []),
        farmaciaService.listarBajas().catch(() => []),
        productosService.listarBajas().catch(() => []),
      ]);

      setNutricionistas(datosNutris);
      setFarmacias(datosFarms);
      setProductos(datosProds);
      setNutricionistasBajas(bajasNutris);
      setFarmaciasBajas(bajasFarms);
      setProductosBajas(bajasProds);
    } catch (error) {
      console.error("Error crítico al cargar administración:", error);
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

  const handleToggleFarmacia = (farmaciaId, checked, esEdicion = false) => {
    const setTarget = esEdicion ? setItemEditando : setFormData;
    setTarget((prev) => {
      const actuales = prev.asignaciones || [];
      if (checked) {
        return {
          ...prev,
          asignaciones: [...actuales, { farmaciaId, kilometros: 0 }],
        };
      } else {
        return {
          ...prev,
          asignaciones: actuales.filter((a) => a.farmaciaId !== farmaciaId),
        };
      }
    });
  };

  const handleCambiarKilometros = (farmaciaId, kms, esEdicion = false) => {
    const setTarget = esEdicion ? setItemEditando : setFormData;
    setTarget((prev) => {
      const actuales = prev.asignaciones || [];
      return {
        ...prev,
        asignaciones: actuales.map((a) =>
          a.farmaciaId === farmaciaId ? { ...a, kilometros: Number(kms) } : a,
        ),
      };
    });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      if (pestana === "nutricionistas") {
        await nutricionistasService.crear({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono, // <-- CAMBIADO: Antes dni
          horasContratoMensual: Number(formData.horasContratoMensual),
          asignaciones: formData.asignaciones,
        });
        alert("Nutricionista creada con éxito.");
      } else if (pestana === "farmacias") {
        await farmaciaService.crear({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          cif: formData.cif,
          direccion: formData.direccion,
          esProvinciaLocal: formData.esProvinciaLocal,
          porcentajeComision: Number(formData.porcentajeComision),
        });
        alert("Farmacia registrada con éxito.");
      } else if (pestana === "productos") {
        await productosService.crearProducto({
          nombreProducto: formData.nombreProducto,
          acronimo: formData.acronimo,
          categoria: formData.categoria,
          referencia: formData.referencia,
          pvf: parseFloat(formData.pvf),
          pvp: parseFloat(formData.pvp),
        });
        alert("Producto añadido al catálogo.");
      }

      setFormData({
        email: "",
        password: "",
        nombre: "",
        apellidos: "",
        telefono: "", // <-- CAMBIADO: Antes dni
        horasContratoMensual: "",
        cif: "",
        direccion: "",
        nombreProducto: "",
        acronimo: "",
        categoria: "PEQUENO",
        referencia: "",
        pvf: "",
        pvp: "",
        asignaciones: [],
        esProvinciaLocal: true,
        porcentajeComision: 30,
      });

      setMostrarBajas(false);
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || "Error al realizar la operación.");
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (id, tipo) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar este ${tipo}? Esta acción es irreversible.`,
      )
    )
      return;
    try {
      if (tipo === "nutricionista") await nutricionistasService.eliminar(id);
      if (tipo === "farmacia") await farmaciaService.eliminar(id);
      if (tipo === "producto") await productosService.eliminar(id);
      cargarDatos();
    } catch (error) {
      console.error(`Error al eliminar ${tipo}:`, error);
      alert(error.response?.data?.message || "Error al eliminar el registro.");
    }
  };

  const handleToggleStock = async (id) => {
    try {
      await productosService.toggleStock(id);
      cargarDatos();
    } catch (error) {
      console.error("Error al cambiar stock:", error);
      alert("Error al actualizar la disponibilidad del producto.");
    }
  };

  const handleRestaurar = async (id, tipo) => {
    if (
      !window.confirm(
        `¿Seguro que deseas reactivar este registro? Volverá a estar operativo.`,
      )
    )
      return;
    try {
      if (tipo === "nutricionista") await nutricionistasService.restaurar(id);
      if (tipo === "farmacia") await farmaciaService.restaurar(id);
      if (tipo === "producto") await productosService.restaurar(id);
      cargarDatos();
    } catch (error) {
      console.error(`Error al restaurar ${tipo}:`, error);
      alert("Error al restaurar el registro.");
    }
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      if (pestana === "nutricionistas") {
        await nutricionistasService.actualizar(itemEditando.id, {
          nombre: itemEditando.nombre,
          apellidos: itemEditando.apellidos,
          telefono: itemEditando.telefono, // <-- AÑADIDO POR SI ACASO
          horasContratoMensual: Number(itemEditando.horasContratoMensual),
          asignaciones: itemEditando.asignaciones || [],
        });
      }
      if (pestana === "farmacias") {
        await farmaciaService.actualizar(itemEditando.id, {
          nombre: itemEditando.nombre,
          cif: itemEditando.cif,
          direccion: itemEditando.direccion,
          esProvinciaLocal: itemEditando.esProvinciaLocal,
          porcentajeComision: Number(itemEditando.porcentajeComision),
        });
      }
      if (pestana === "productos") {
        await productosService.actualizar(itemEditando.id, itemEditando);
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

  return {
    pestana,
    setPestana,
    nutricionistas,
    farmacias,
    productos,
    nutricionistasBajas,
    farmaciasBajas,
    productosBajas,
    mostrarBajas,
    setMostrarBajas,
    cargando,
    enviando,
    itemEditando,
    setItemEditando,
    formData,
    setFormData,
    modalAsignaciones,
    abrirModalAsignaciones,
    cerrarModalAsignaciones,

    handleChange,
    handleToggleFarmacia,
    handleCambiarKilometros,
    handleCrear,
    handleEliminar,
    handleToggleStock,
    handleRestaurar,
    handleActualizar,
  };
};
