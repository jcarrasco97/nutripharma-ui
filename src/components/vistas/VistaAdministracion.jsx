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
} from "lucide-react";
import { farmaciaService } from "../../services/farmaciaService";
import { nutricionistasService } from "../../services/nutricionistasService";
import { productosService } from "../../services/productosService";

const VistaAdministracion = () => {
  const [pestana, setPestana] = useState("nutricionistas");
  const [nutricionistas, setNutricionistas] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // --- ESTADO DEL MODAL DE EDICIÓN ---
  const [itemEditando, setItemEditando] = useState(null);

  // Formulario para altas
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
    // Campos de Producto
    nombreProducto: "",
    acronimo: "",
    categoria: "PEQUENO",
    referencia: "",
    pvf: "",
    pvp: "",
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datosNutris, datosFarms, datosProds] = await Promise.all([
        nutricionistasService.listarTodas(),
        farmaciaService.listarTodas(),
        productosService.listarTodos(),
      ]);
      setNutricionistas(datosNutris);
      setFarmacias(datosFarms);
      setProductos(datosProds);
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

  // --- LÓGICA DE CREACIÓN ---
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
        });
        alert("Nutricionista creada con éxito.");
      } else if (pestana === "farmacias") {
        await farmaciaService.crear({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          cif: formData.cif,
          direccion: formData.direccion,
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
      });
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || "Error al realizar la operación.");
    } finally {
      setEnviando(false);
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
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
      console.error(`Error al eliminar ${tipo}:`, error); // <-- AQUÍ USAMOS LA VARIABLE
      alert("Error al eliminar. Puede que tenga datos asociados.");
    }
  };

  // --- LÓGICA DE ACTUALIZACIÓN ---
  const handleActualizar = async (e) => {
    e.preventDefault();
    try {
      if (pestana === "nutricionistas")
        await nutricionistasService.actualizar(itemEditando.id, itemEditando);
      if (pestana === "farmacias")
        await farmaciaService.actualizar(itemEditando.id, itemEditando);
      if (pestana === "productos")
        await productosService.actualizar(itemEditando.id, itemEditando);

      alert("Datos actualizados correctamente.");
      setItemEditando(null);
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar:", error); // <-- AQUÍ USAMOS LA VARIABLE
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
      {/* MODAL DE EDICIÓN FLOTANTE */}
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
            <form onSubmit={handleActualizar} className="p-6 space-y-4">
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Save size={18} /> Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CABECERA Y PESTAÑAS */}
      <div className="flex gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => setPestana("nutricionistas")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${pestana === "nutricionistas" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
        >
          <Users size={20} /> Plantilla Nutricionistas
        </button>
        <button
          onClick={() => setPestana("farmacias")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${pestana === "farmacias" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
        >
          <Store size={20} /> Red de Farmacias
        </button>
        <button
          onClick={() => setPestana("productos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${pestana === "productos" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
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
                      className="p-4 flex justify-between items-center hover:bg-gray-50 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                          {n.nombre.charAt(0)}
                          {n.apellidos ? n.apellidos.charAt(0) : ""}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {n.nombre} {n.apellidos}
                          </p>
                          <p className="text-xs text-gray-500">
                            {n.email} • DNI: {n.dni}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
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
                      className="p-4 flex justify-between items-center hover:bg-gray-50 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                          <Store size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{f.nombre}</p>
                          <p className="text-xs text-gray-500">
                            {f.direccion} • CIF: {f.cif}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
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
                      className="p-4 flex justify-between items-center hover:bg-gray-50 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-sky-100 text-sky-600 p-2 rounded-lg">
                          <PackagePlus size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {p.nombreProducto}{" "}
                            <span className="ml-2 text-[10px] bg-gray-200 px-2 rounded">
                              {p.referencia}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            PVF: {p.pvf}€ • PVP: {p.pvp}€
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
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
          </div>
        </div>

        {/* COLUMNA DERECHA: EL FORMULARIO ORIGINAL (Adaptado a productos) */}
        <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl h-fit sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <Plus size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold">Crear Registro</h3>
          </div>

          <form onSubmit={handleCrear} className="space-y-4">
            {/* Si NO son productos, pedimos las credenciales de Usuario */}
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

              {/* CAMPOS COMUNES NUTRI/FARMACIA */}
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
                </>
              )}

              {/* CAMPOS DE PRODUCTO */}
              {pestana === "productos" && (
                <>
                  <input
                    type="text"
                    name="nombreProducto"
                    value={formData.nombreProducto}
                    onChange={handleChange}
                    required
                    placeholder="Nombre (Ej: Batido Vainilla)"
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="acronimo"
                      value={formData.acronimo}
                      onChange={handleChange}
                      required
                      placeholder="Acrónimo"
                      className="w-1/2 bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-1/2 bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
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
                    placeholder="Referencia / SKU (Única)"
                    className="w-full bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
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
                      className="w-1/2 bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      name="pvp"
                      value={formData.pvp}
                      onChange={handleChange}
                      required
                      placeholder="PVP (€)"
                      className="w-1/2 bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl mt-4 transition-colors flex justify-center items-center shadow-lg shadow-indigo-500/30"
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
