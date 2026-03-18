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
} from "lucide-react";
import { farmaciaService } from "../../services/farmaciaService";
import { nutricionistasService } from "../../services/nutricionistasService";

const VistaEmpleados = () => {
  const [pestana, setPestana] = useState("nutricionistas");
  const [nutricionistas, setNutricionistas] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Formulario adaptado a tus NutricionistaRequest y FarmaciaRequest
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellidos: "",
    dni: "",
    horasContratoMensual: "", // Para Nutricionistas
    cif: "",
    direccion: "",
    telefono: "", // Para Farmacias
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datosNutris, datosFarms] = await Promise.all([
        nutricionistasService.listarTodas(),
        farmaciaService.listarTodas(),
      ]);
      setNutricionistas(datosNutris);
      setFarmacias(datosFarms);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
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

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      if (pestana === "nutricionistas") {
        await nutricionistasService.crear({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          dni: formData.dni, // Requisito de tu BD
          horasContratoMensual: Number(formData.horasContratoMensual), // Requisito de tu BD
        });
        alert("Nutricionista creada con éxito.");
      } else {
        await farmaciaService.crear({
          email: formData.email,
          password: formData.password,
          nombre: formData.nombre,
          cif: formData.cif,
          direccion: formData.direccion,
          // Añadimos telefono si tu FarmaciaRequest lo requiere, si no, se ignorará
        });
        alert("Farmacia registrada con éxito.");
      }

      // Limpiar formulario y recargar
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
      });
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || "Error al crear el usuario.");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-fade-in">
      {/* COLUMNA IZQUIERDA: LISTADO */}
      <div className="xl:col-span-2 space-y-6">
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
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {pestana === "nutricionistas" ? (
            <div className="divide-y divide-gray-100">
              {nutricionistas.length === 0 ? (
                <p className="p-8 text-center text-gray-400">
                  No hay nutricionistas registradas.
                </p>
              ) : (
                nutricionistas.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
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
                    <div className="text-right">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-md mb-1 inline-block">
                        <Clock size={12} className="inline mr-1" />
                        {n.horasContratoMensual}h/mes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {farmacias.length === 0 ? (
                <p className="p-8 text-center text-gray-400">
                  No hay farmacias registradas.
                </p>
              ) : (
                farmacias.map((f) => (
                  <div
                    key={f.id}
                    className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
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
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                        Saldo Virtual
                      </p>
                      <span className="bg-purple-100 text-purple-700 text-sm font-black px-3 py-1 rounded-lg">
                        {f.saldoVirtual ? f.saldoVirtual.toFixed(2) : "0.00"}€
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* COLUMNA DERECHA: FORMULARIO ALTA */}
      <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl h-fit sticky top-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <Plus size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold">Dar de Alta</h3>
        </div>

        <form onSubmit={handleCrearUsuario} className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700 pb-2">
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

          <div className="space-y-3 pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700 pb-2">
              2. Perfil Laboral
            </h4>

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
                    placeholder="Horas mensuales de contrato"
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
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl mt-4 transition-colors flex justify-center items-center shadow-lg shadow-indigo-500/30"
          >
            {enviando ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              `Registrar ${pestana === "nutricionistas" ? "Nutricionista" : "Farmacia"}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VistaEmpleados;
