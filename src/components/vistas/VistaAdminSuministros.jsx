import React, { useState, useEffect } from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Filter,
  Search,
} from "lucide-react";
import { suministrosService } from "../../services/suministrosService";

const VistaAdminSuministros = () => {
  const [peticiones, setPeticiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const cargarPeticiones = async () => {
    setCargando(true);
    try {
      const datos = await suministrosService.listarPeticionesAdmin();
      setPeticiones(datos);
    } catch (error) {
      console.error("Error cargando peticiones admin:", error); // <-- ¡Aquí sí se usa!
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPeticiones();
  }, []);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    if (
      !window.confirm(
        `¿Seguro que quieres marcar esta petición como ${nuevoEstado}?`,
      )
    )
      return;

    try {
      await suministrosService.cambiarEstado(id, nuevoEstado);
      cargarPeticiones();
    } catch (error) {
      console.error("Error al cambiar estado:", error); // <-- SOLUCIONADO
      alert("Error al cambiar el estado.");
    }
  };

  const peticionesFiltradas = peticiones.filter((p) => {
    const matchEstado = estadoFiltro === "Todos" || p.estado === estadoFiltro;
    const matchNombre = p.nutricionistaNombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    return matchEstado && matchNombre;
  });

  if (cargando)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      {/* Cabecera y Filtros */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-lg shadow-indigo-100">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-800">
              Validar Suministros
            </h2>
            <p className="text-gray-500 font-medium">
              Gestiona las peticiones de material de la red.
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar nutricionista..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div className="relative flex-1">
            <Filter size={16} className="absolute left-4 top-4 text-gray-400" />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-indigo-500 appearance-none"
            >
              <option value="Todos">Todos los estados</option>
              <option value="SOLICITADO">Pendientes (Solicitado)</option>
              <option value="APROBADO">Aprobados</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Peticiones */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {peticionesFiltradas.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
            <p className="text-gray-500 font-bold">
              No hay peticiones de suministros con estos filtros.
            </p>
          </div>
        ) : (
          peticionesFiltradas.map((pet) => (
            <div
              key={pet.id}
              className={`bg-white rounded-[2rem] p-6 border-2 transition-all shadow-sm ${
                pet.estado === "SOLICITADO"
                  ? "border-sky-200 hover:shadow-sky-100"
                  : "border-gray-50 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Petición #{pet.id}
                  </span>
                  <h3 className="text-lg font-black text-gray-800">
                    {pet.nutricionistaNombre}
                  </h3>
                  <p className="text-xs text-gray-500 font-bold mt-1 flex items-center gap-1">
                    <Clock size={12} /> {pet.fechaPeticion}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    pet.estado === "SOLICITADO"
                      ? "bg-sky-100 text-sky-700"
                      : pet.estado === "APROBADO"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {pet.estado}
                </span>
              </div>

              <div className="mb-6 min-h-[100px]">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Material Requerido:
                </p>
                <ul className="space-y-1 text-sm font-bold text-gray-700">
                  {pet.materiales.map((mat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      {mat.nombre}{" "}
                      <span className="text-gray-400 font-medium">
                        ({mat.cantidadEstandar} uds)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botones de Acción (Solo si está PENDIENTE) */}
              {pet.estado === "SOLICITADO" && (
                <div className="flex gap-2 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleCambiarEstado(pet.id, "CANCELADO")}
                    className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-black text-xs uppercase tracking-widest rounded-xl transition-colors flex justify-center items-center gap-2"
                  >
                    <XCircle size={16} /> Denegar
                  </button>
                  <button
                    onClick={() => handleCambiarEstado(pet.id, "APROBADO")}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors shadow-md shadow-emerald-200 flex justify-center items-center gap-2"
                  >
                    <CheckCircle size={16} /> Aprobar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VistaAdminSuministros;
