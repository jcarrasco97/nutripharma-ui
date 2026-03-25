import React, { useState, useEffect } from "react";
import {
  Users,
  Store,
  Plus,
  Loader2,
  Mail,
  Lock,
  Building,
  User,
  Clock,
  FileText,
  PackagePlus,
  Edit,
  Trash2,
  X,
  Save,
  MapPin,
  Car,
  Archive,
  RefreshCw,
} from "lucide-react";
import { farmaciaService } from "./farmaciaService";
import { nutricionistasService } from "./nutricionistasService";
import { productosService } from "../pedidos/productosService";

const VistaAdministracion = () => {
  const [pestana, setPestana] = useState("nutricionistas");
  const [nutricionistas, setNutricionistas] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [farmaciasBajas, setFarmaciasBajas] = useState([]);
  const [nutricionistasBajas, setNutricionistasBajas] = useState([]);
  const [mostrarBajas, setMostrarBajas] = useState(false); // Controla si vemos el cementerio
  const [productosBajas, setProductosBajas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [itemEditando, setItemEditando] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellidos: "",
    dni: "",
    horasContratoMensual: "",
    cif: "",
    direccion: "",
    telefono: "",
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

  const cargarDatos = async () => {
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
        nutricionistasService.listarTodas(),
        farmaciaService.listarTodas(),
        productosService.listarTodos(),
        nutricionistasService.listarBajas().catch(() => []), // Atrapamos el error por si acaso
        farmaciaService.listarBajas().catch(() => []),
        productosService.listarBajas().catch(() => []), // <-- AÑADIDO
      ]);
      setNutricionistas(datosNutris);
      setFarmacias(datosFarms);
      setProductos(datosProds);
      setNutricionistasBajas(bajasNutris); // <-- AÑADIDO
      setFarmaciasBajas(bajasFarms); // <-- AÑADIDO
      setProductosBajas(bajasProds); // <-- AÑADIDO
    } catch (error) {
      console.error("Error al cargar administracion:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
          dni: formData.dni,
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
        dni: "",
        horasContratoMensual: "",
        cif: "",
        direccion: "",
        telefono: "",
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
      console.error(`Error al eliminar ${tipo}:`, error); // <-- AÑADIDO PARA ESLINT
      alert("Error al eliminar. Puede que tenga datos asociados.");
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

      // Recargamos los datos para ver cómo desaparece del cementerio y vuelve arriba
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
      console.error("Error al actualizar:", error); // <-- AÑADIDO PARA ESLINT
      alert("Error al actualizar los datos.");
    }
  };

  if (cargando && nutricionistas.length === 0)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      {/* MODAL DE EDICIÓN */}
      {itemEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit size={20} /> Modificar Datos
              </h3>
              <button
                onClick={() => setItemEditando(null)}
                className="text-indigo-200 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={handleActualizar}
              className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar"
            >
              {pestana === "nutricionistas" && (
                <>
                  <input
                    type="text"
                    value={itemEditando.nombre}
                    onChange={(e) =>
                      setItemEditando({
                        ...itemEditando,
                        nombre: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="Nombre"
                    required
                  />
                  <input
                    type="text"
                    value={itemEditando.apellidos}
                    onChange={(e) =>
                      setItemEditando({
                        ...itemEditando,
                        apellidos: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="Apellidos"
                    required
                  />
                  <input
                    type="number"
                    value={itemEditando.horasContratoMensual}
                    onChange={(e) =>
                      setItemEditando({
                        ...itemEditando,
                        horasContratoMensual: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="Horas mensuales"
                    required
                  />

                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Asignación y Kilometraje
                    </label>
                    <div className="max-h-56 overflow-y-auto space-y-2 p-3 border rounded-xl bg-gray-50 custom-scrollbar">
                      {farmacias.map((farmacia) => {
                        const asignacionInfo = itemEditando.asignaciones?.find(
                          (a) => a.farmaciaId === farmacia.id,
                        );
                        const isChecked = !!asignacionInfo;
                        return (
                          <div
                            key={farmacia.id}
                            className={`flex flex-col p-3 rounded-lg border transition-all ${isChecked ? "bg-white border-indigo-200 shadow-sm" : "bg-transparent border-transparent hover:bg-gray-100"}`}
                          >
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleToggleFarmacia(
                                    farmacia.id,
                                    e.target.checked,
                                    true,
                                  )
                                }
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                              />
                              <span className="text-sm font-bold text-gray-700">
                                {farmacia.nombre}
                              </span>
                            </label>
                            {isChecked && (
                              <div className="mt-2 pl-7 flex items-center gap-2 animate-fade-in">
                                <Car size={14} className="text-gray-400" />
                                <input
                                  type="number"
                                  min="0"
                                  value={asignacionInfo.kilometros}
                                  onChange={(e) =>
                                    handleCambiarKilometros(
                                      farmacia.id,
                                      e.target.value,
                                      true,
                                    )
                                  }
                                  className="w-20 p-1 text-sm border rounded-md focus:ring-indigo-500"
                                  placeholder="Km"
                                  required
                                />
                                <span className="text-xs font-bold text-gray-400">
                                  Km totales
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {farmacias.length === 0 && (
                        <p className="text-xs text-gray-500 text-center">
                          No hay farmacias.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {pestana === "farmacias" && (
                <>
                  <input
                    type="text"
                    value={itemEditando.nombre}
                    onChange={(e) =>
                      setItemEditando({
                        ...itemEditando,
                        nombre: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="Nombre Farmacia"
                    required
                  />
                  <input
                    type="text"
                    value={itemEditando.cif}
                    onChange={(e) =>
                      setItemEditando({ ...itemEditando, cif: e.target.value })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="CIF"
                    required
                  />
                  <input
                    type="text"
                    value={itemEditando.direccion}
                    onChange={(e) =>
                      setItemEditando({
                        ...itemEditando,
                        direccion: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="Dirección"
                    required
                  />
                  <label className="flex items-center gap-3 p-4 bg-sky-50 border border-sky-100 rounded-xl cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={itemEditando.esProvinciaLocal !== false}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          esProvinciaLocal: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-sky-600 rounded"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">
                        Provincia de Almería (Aplica PVF)
                      </span>
                    </div>
                  </label>
                  <div className="relative mt-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Comisión para la Farmacia
                    </label>
                    <input
                      type="number"
                      value={itemEditando.porcentajeComision || 30}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          porcentajeComision: e.target.value,
                        })
                      }
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full p-3 border rounded-xl"
                    />
                    <span className="absolute right-4 top-10 text-gray-400 font-bold">
                      %
                    </span>
                  </div>
                </>
              )}

              {pestana === "productos" && (
                <>
                  <input
                    type="text"
                    value={itemEditando.nombreProducto}
                    onChange={(e) =>
                      setItemEditando({
                        ...itemEditando,
                        nombreProducto: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-xl"
                    placeholder="Nombre Producto"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={itemEditando.pvf}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          pvf: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-xl"
                      placeholder="PVF"
                      required
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={itemEditando.pvp}
                      onChange={(e) =>
                        setItemEditando({
                          ...itemEditando,
                          pvp: e.target.value,
                        })
                      }
                      className="w-full p-3 border rounded-xl"
                      placeholder="PVP"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-4"
              >
                <Save size={18} /> Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CABECERA Y PESTAÑAS */}
      <div className="flex gap-4 border-b border-gray-200 pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setPestana("nutricionistas")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${pestana === "nutricionistas" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
        >
          <Users size={20} /> Plantilla Nutricionistas
        </button>
        <button
          onClick={() => setPestana("farmacias")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${pestana === "farmacias" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
        >
          <Store size={20} /> Red de Farmacias
        </button>
        <button
          onClick={() => setPestana("productos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${pestana === "productos" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
        >
          <PackagePlus size={20} /> Catálogo Productos
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: LISTADOS */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {pestana === "nutricionistas" && (
              <div className="divide-y divide-gray-100">
                {nutricionistas.length === 0 ? (
                  <p className="p-8 text-center text-gray-400">
                    No hay nutricionistas.
                  </p>
                ) : (
                  nutricionistas.map((n) => (
                    <div
                      key={n.id}
                      className="p-4 flex justify-between items-start md:items-center hover:bg-gray-50 group flex-col md:flex-row gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0">
                          {n.nombre.charAt(0)}
                          {n.apellidos ? n.apellidos.charAt(0) : ""}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {n.nombre} {n.apellidos}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {n.email} • DNI: {n.dni}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {n.asignaciones?.length > 0 ? (
                              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                                {n.asignaciones.length} Farmacias Asignadas
                              </span>
                            ) : (
                              <span className="bg-red-50 text-red-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                                Sin Asignaciones
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end">
                        <button
                          onClick={() => setItemEditando(n)}
                          className="p-2 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleEliminar(n.id, "nutricionista")}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {pestana === "farmacias" && (
              <div className="divide-y divide-gray-100">
                {farmacias.length === 0 ? (
                  <p className="p-8 text-center text-gray-400">
                    No hay farmacias.
                  </p>
                ) : (
                  farmacias.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 flex justify-between items-start md:items-center hover:bg-gray-50 group flex-col md:flex-row gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl shrink-0">
                          <Store size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 flex items-center gap-2">
                            {f.nombre}
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded uppercase font-black ${f.esProvinciaLocal ? "bg-sky-100 text-sky-700" : "bg-purple-100 text-purple-700"}`}
                            >
                              {f.esProvinciaLocal
                                ? "Almería (PVF)"
                                : "Externa (PVP)"}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {f.direccion} • CIF: {f.cif}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end">
                        <button
                          onClick={() => setItemEditando(f)}
                          className="p-2 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleEliminar(f.id, "farmacia")}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {pestana === "productos" && (
              <div className="divide-y divide-gray-100">
                {productos.length === 0 ? (
                  <p className="p-8 text-center text-gray-400">
                    No hay productos.
                  </p>
                ) : (
                  productos.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 flex justify-between items-start md:items-center hover:bg-gray-50 group flex-col md:flex-row gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-sky-100 text-sky-600 p-3 rounded-xl shrink-0">
                          <PackagePlus size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {p.nombreProducto}{" "}
                            <span className="ml-2 text-[10px] bg-gray-200 px-2 rounded">
                              {p.referencia}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PVF: {p.pvf}€ • PVP: {p.pvp}€
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end">
                        <button
                          onClick={() => setItemEditando(p)}
                          className="p-2 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleEliminar(p.id, "producto")}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 👇 INSERTA TODO ESTE BLOQUE AQUÍ 👇 */}
            {/* --- BOTÓN Y LISTADO DEL CEMENTERIO DE BAJAS --- */}
            {(pestana === "nutricionistas" ||
              pestana === "farmacias" ||
              pestana === "productos") && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-6">
                <div className="text-center mb-2">
                  <button
                    onClick={() => setMostrarBajas(!mostrarBajas)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <Archive size={16} />
                    {mostrarBajas
                      ? "Ocultar Archivo Histórico"
                      : "Ver Archivo Histórico"}
                  </button>
                </div>

                {mostrarBajas && (
                  <div className="mt-4 border-t-2 border-dashed border-gray-200 pt-4">
                    <h4 className="text-xs font-black uppercase text-gray-400 mb-4 px-2">
                      Registros Inactivos (Solo Lectura)
                    </h4>
                    {/* Bajas Nutricionistas */}
                    {pestana === "nutricionistas" && (
                      <div className="space-y-2">
                        {nutricionistasBajas.length === 0 ? (
                          <p className="text-sm text-gray-400 italic px-2">
                            No hay historial de bajas.
                          </p>
                        ) : (
                          nutricionistasBajas.map((n) => (
                            <div
                              key={n.id}
                              className="p-3 bg-gray-200/50 rounded-xl flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3 grayscale opacity-75">
                                <div className="bg-gray-300 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                  {n.nombre.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-600 text-sm line-through">
                                    {n.nombre} {n.apellidos}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    {n.email} • DNI: {n.dni}
                                  </p>
                                  <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded w-fit uppercase">
                                    <Archive size={10} />
                                    Baja el{" "}
                                    {new Date(
                                      n.fechaBaja,
                                    ).toLocaleDateString()}{" "}
                                    por {n.borradoPor}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleRestaurar(n.id, "nutricionista")
                                }
                                className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Restaurar / Reactivar"
                              >
                                <RefreshCw size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Haz lo mismo para Bajas Farmacias añadiendo el botón al lado de la información */}
                    {pestana === "farmacias" && (
                      <div className="space-y-2">
                        {farmaciasBajas.length === 0 ? (
                          <p className="text-sm text-gray-400 italic px-2">
                            No hay historial de bajas.
                          </p>
                        ) : (
                          farmaciasBajas.map((f) => (
                            <div
                              key={f.id}
                              className="p-3 bg-gray-200/50 rounded-xl flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3 grayscale opacity-75">
                                <div className="bg-gray-300 text-gray-500 p-2 rounded-lg shrink-0">
                                  <Store size={16} />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-600 text-sm line-through">
                                    {f.nombre}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    {f.email} • CIF: {f.cif}
                                  </p>
                                  <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded w-fit uppercase">
                                    <Archive size={10} />
                                    Baja el{" "}
                                    {new Date(
                                      f.fechaBaja,
                                    ).toLocaleDateString()}{" "}
                                    por {f.borradoPor}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleRestaurar(f.id, "farmacia")
                                }
                                className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Restaurar / Reactivar"
                              >
                                <RefreshCw size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    {/* Bajas Productos */}
                    {pestana === "productos" && (
                      <div className="space-y-2">
                        {productosBajas.length === 0 ? (
                          <p className="text-sm text-gray-400 italic px-2">
                            No hay historial de bajas.
                          </p>
                        ) : (
                          productosBajas.map((p) => (
                            <div
                              key={p.id}
                              className="p-3 bg-gray-200/50 rounded-xl flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-3 grayscale opacity-75">
                                <div className="bg-gray-300 text-gray-500 p-2 rounded-lg shrink-0">
                                  <PackagePlus size={16} />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-600 text-sm line-through">
                                    {p.nombreProducto}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    Ref: {p.referencia} • PVF: {p.pvf}€
                                  </p>
                                  {/* --- NUEVO: INFORMACIÓN DE AUDITORÍA --- */}
                                  <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded w-fit uppercase">
                                    <Archive size={10} />
                                    Baja el{" "}
                                    {new Date(
                                      p.fechaBaja,
                                    ).toLocaleDateString()}{" "}
                                    por {p.borradoPor}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleRestaurar(p.id, "producto")
                                }
                                className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Restaurar / Reactivar"
                              >
                                <RefreshCw size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* 👆 FIN DEL BLOQUE A INSERTAR 👆 */}
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO CREACIÓN */}
        <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl h-fit xl:sticky xl:top-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <Plus size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold">Crear Registro</h3>
          </div>

          <form onSubmit={handleCrear} className="space-y-4">
            {pestana !== "productos" && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase border-b border-gray-700 pb-2">
                  1. Credenciales
                </h4>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Correo electrónico"
                    className="w-full bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Contraseña temporal"
                    className="w-full bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase border-b border-gray-700 pb-2">
                {pestana === "productos"
                  ? "Datos del Producto"
                  : "2. Perfil Laboral"}
              </h4>

              {pestana !== "productos" && (
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder={
                      pestana === "nutricionistas"
                        ? "Nombre de la empleada"
                        : "Nombre de la Farmacia"
                    }
                    className="w-full bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              )}

              {pestana === "nutricionistas" && (
                <>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    placeholder="Apellidos"
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <div className="relative">
                    <FileText
                      size={16}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />
                    <input
                      type="text"
                      name="dni"
                      value={formData.dni}
                      onChange={handleChange}
                      required
                      placeholder="DNI / NIE"
                      className="w-full bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />
                    <input
                      type="number"
                      name="horasContratoMensual"
                      value={formData.horasContratoMensual}
                      onChange={handleChange}
                      required
                      min="1"
                      max="160"
                      placeholder="Horas mensuales"
                      className="w-full bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-3 mt-4">
                    <h4 className="text-xs font-bold text-sky-400 uppercase border-b border-gray-700 pb-2">
                      3. Asignación y Distancia
                    </h4>
                    <div className="max-h-56 overflow-y-auto space-y-2 p-2 bg-gray-800/50 rounded-xl custom-scrollbar border border-gray-700">
                      {farmacias.map((farmacia) => {
                        const asignacionInfo = formData.asignaciones.find(
                          (a) => a.farmaciaId === farmacia.id,
                        );
                        const isChecked = !!asignacionInfo;
                        return (
                          <div
                            key={farmacia.id}
                            className={`flex flex-col p-2 rounded-lg transition-colors ${isChecked ? "bg-gray-700 border border-gray-600" : "bg-transparent border border-transparent"}`}
                          >
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleToggleFarmacia(
                                    farmacia.id,
                                    e.target.checked,
                                    false,
                                  )
                                }
                                className="w-4 h-4 rounded text-sky-500 bg-gray-900 border-gray-600 focus:ring-sky-500"
                              />
                              <span className="text-sm font-medium text-gray-200">
                                {farmacia.nombre}
                              </span>
                            </label>
                            {isChecked && (
                              <div className="mt-2 pl-7 flex items-center gap-2 animate-fade-in">
                                <Car size={14} className="text-gray-400" />
                                <input
                                  type="number"
                                  min="0"
                                  value={asignacionInfo.kilometros}
                                  onChange={(e) =>
                                    handleCambiarKilometros(
                                      farmacia.id,
                                      e.target.value,
                                      false,
                                    )
                                  }
                                  className="w-16 p-1 text-sm bg-gray-900 text-white border border-gray-600 rounded-md focus:ring-sky-500 outline-none text-center"
                                  placeholder="Km"
                                  required
                                />
                                <span className="text-xs text-gray-400 font-bold">
                                  Km totales
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {farmacias.length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          No hay farmacias
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {pestana === "farmacias" && (
                <>
                  <div className="relative">
                    <Building
                      size={16}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />
                    <input
                      type="text"
                      name="cif"
                      value={formData.cif}
                      onChange={handleChange}
                      required
                      placeholder="CIF de la Farmacia"
                      className="w-full bg-gray-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Dirección completa"
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <div className="pt-4">
                    <label className="flex items-center gap-3 p-4 bg-sky-900/30 border border-sky-500/30 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.esProvinciaLocal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            esProvinciaLocal: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded text-sky-500"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-sky-100 flex items-center gap-2">
                          <MapPin size={14} /> Almería (PVF)
                        </span>
                      </div>
                    </label>
                  </div>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      name="porcentajeComision"
                      value={formData.porcentajeComision}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="Comisión para la Farmacia (%)"
                      className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <span className="absolute right-4 top-3.5 text-gray-400 font-bold">
                      %
                    </span>
                  </div>
                </>
              )}

              {pestana === "productos" && (
                <>
                  <input
                    type="text"
                    name="nombreProducto"
                    value={formData.nombreProducto}
                    onChange={handleChange}
                    required
                    placeholder="Nombre (Ej: Batido Vainilla)"
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="acronimo"
                      value={formData.acronimo}
                      onChange={handleChange}
                      required
                      placeholder="Acrónimo"
                      className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white outline-none"
                    />
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="PEQUENO">PEQUEÑO</option>
                      <option value="GRANDE">GRANDE</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleChange}
                    required
                    placeholder="Referencia / SKU"
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      name="pvf"
                      value={formData.pvf}
                      onChange={handleChange}
                      required
                      placeholder="PVF (€)"
                      className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      name="pvp"
                      value={formData.pvp}
                      onChange={handleChange}
                      required
                      placeholder="PVP (€)"
                      className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl mt-4 flex justify-center items-center shadow-lg"
            >
              {enviando ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Registrar Datos"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VistaAdministracion;
