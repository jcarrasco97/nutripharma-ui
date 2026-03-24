import React, { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Loader2,
  Mail,
  Lock,
  User,
  Trash2,
  Archive,
} from "lucide-react";
import { personalInternoService } from "./personalInternoService";

const VistaPersonalInterno = () => {
  const [admins, setAdmins] = useState([]);
  const [adminsBajas, setAdminsBajas] = useState([]); // <-- Estado para el cementerio
  const [mostrarBajas, setMostrarBajas] = useState(false); // <-- Toggle visual
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellidos: "",
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datosAdmins, datosBajas] = await Promise.all([
        personalInternoService.listarAdmins(),
        personalInternoService.listarBajas().catch(() => []), // Atrapamos el error si no hay bajas
      ]);
      setAdmins(datosAdmins);
      setAdminsBajas(datosBajas);
    } catch (error) {
      console.error("Error al cargar administradores:", error);
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

  const handleCrear = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await personalInternoService.crearAdmin(formData);
      alert("Administrador creado con éxito. Ya puede iniciar sesión.");
      setFormData({ email: "", password: "", nombre: "", apellidos: "" });
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

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-indigo-900 p-8 rounded-[2.5rem] shadow-lg text-white flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="bg-indigo-800 p-4 rounded-3xl shadow-inner">
          <Shield size={40} className="text-indigo-300" />
        </div>
        <div>
          <h2 className="text-3xl font-black">Centro de Mando (SuperAdmin)</h2>
          <p className="text-indigo-200 font-medium mt-2">
            Gestión exclusiva de credenciales con privilegios globales. Los
            usuarios aquí listados tienen acceso total a la plataforma.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: LISTADO */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">
                Administradores Activos
              </h3>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-1 rounded-full">
                {admins.length} Usuarios
              </span>
            </div>

            {cargando ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-md shrink-0">
                        {admin.nombre.charAt(0)}
                        {admin.apellidos ? admin.apellidos.charAt(0) : ""}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-lg">
                          {admin.nombre} {admin.apellidos}
                        </p>
                        <p className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                          <Mail size={14} /> {admin.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEliminar(admin.id)}
                      className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                      title="Revocar Acceso"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 👇 BOTÓN Y LISTADO DEL CEMENTERIO 👇 */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-4 mt-6">
            <div className="text-center mb-2">
              <button
                onClick={() => setMostrarBajas(!mostrarBajas)}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
              >
                <Archive size={16} />
                {mostrarBajas
                  ? "Ocultar Historial de Bajas"
                  : "Ver Historial de Bajas"}
              </button>
            </div>

            {mostrarBajas && (
              <div className="mt-4 border-t-2 border-dashed border-gray-200 pt-4">
                <h4 className="text-xs font-black uppercase text-gray-400 mb-4 px-2">
                  Administradores Inactivos (Solo Lectura)
                </h4>
                <div className="space-y-2">
                  {adminsBajas.length === 0 ? (
                    <p className="text-sm text-gray-400 italic px-2">
                      No hay historial de bajas.
                    </p>
                  ) : (
                    adminsBajas.map((admin) => (
                      <div
                        key={admin.id}
                        className="p-4 bg-gray-200/50 rounded-2xl flex items-center gap-4 grayscale opacity-75"
                      >
                        <div className="bg-gray-300 text-gray-500 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-inner shrink-0">
                          {admin.nombre.charAt(0)}
                          {admin.apellidos ? admin.apellidos.charAt(0) : ""}
                        </div>
                        <div>
                          <p className="font-bold text-gray-600 text-base line-through">
                            {admin.nombre} {admin.apellidos}
                          </p>
                          <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
                            <Mail size={12} /> {admin.email}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm h-fit xl:sticky xl:top-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="bg-indigo-50 p-2 rounded-xl">
              <Plus size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-black text-gray-800">
              Dar de Alta Admin
            </h3>
          </div>

          <form onSubmit={handleCrear} className="space-y-4">
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-4 top-3.5 text-gray-400"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Correo corporativo"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-4 top-3.5 text-gray-400"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Contraseña inicial"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="relative">
              <User
                size={16}
                className="absolute left-4 top-3.5 text-gray-400"
              />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Nombre"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              placeholder="Apellidos"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-xl mt-6 flex justify-center items-center shadow-lg transition-transform hover:scale-[1.02]"
            >
              {enviando ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Generar Credenciales"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VistaPersonalInterno;
