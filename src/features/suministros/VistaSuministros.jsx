import React, { useState, useEffect } from "react";
import {
  Package,
  Send,
  ClipboardList,
  Clock,
  Loader2,
  CheckSquare,
  AlertTriangle,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { suministrosService } from "../../features/suministros/suministrosService";

const VistaSuministros = () => {
  const [materiales, setMateriales] = useState([]);
  const [peticiones, setPeticiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Guardaremos un array con los IDs de los materiales que el usuario marque
  const [seleccionados, setSeleccionados] = useState([]);

  // --- ESTADOS DE FILTRO AÑADIDOS ---
  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datosMat, datosPet] = await Promise.all([
        suministrosService.listarMateriales(),
        suministrosService.obtenerMisPeticiones(), // Usamos la nueva ruta privada
      ]);
      setMateriales(datosMat);
      setPeticiones(datosPet); // Ya viene filtrado y seguro desde el backend
    } catch (error) {
      console.error("Error al cargar suministros:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCheckbox = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSolicitar = async () => {
    if (seleccionados.length === 0)
      return alert("Selecciona al menos un material.");

    setEnviando(true);
    try {
      // El servicio ahora solo espera el array de IDs
      await suministrosService.crearPeticion(seleccionados);
      alert("Petición de suministros enviada correctamente.");
      setSeleccionados([]); // Limpiamos el checklist
      cargarDatos(); // Recargamos para actualizar el Historial y bloquear los materiales recién pedidos
    } catch (error) {
      alert("Error al enviar la petición.");
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  // --- LÓGICA DE FILTRADO Y ORDENACIÓN AÑADIDA ---
  const mesesDisponibles = [
    "Todos",
    ...new Set(peticiones.map((p) => p.fechaPeticion.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  const peticionesFiltradas = peticiones
    .filter(
      (p) => mesFiltro === "Todos" || p.fechaPeticion.startsWith(mesFiltro),
    )
    .filter((p) => estadoFiltro === "Todos" || p.estado === estadoFiltro)
    .sort((a, b) => {
      if (ordenFiltro === "recientes") {
        return new Date(b.fechaPeticion) - new Date(a.fechaPeticion);
      }
      return new Date(a.fechaPeticion) - new Date(b.fechaPeticion);
    });

  if (cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
      {/* IZQUIERDA: CHECKLIST DE MATERIALES */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
            <CheckSquare size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Solicitar Material
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Marca los materiales corporativos que necesitas reponer. La central te
          enviará las cantidades estándar aprobadas.
        </p>

        <div className="space-y-3 mb-6">
          {materiales.length === 0 ? (
            <p className="text-sm text-gray-400">
              No hay materiales en el catálogo.
            </p>
          ) : (
            materiales.map((mat) => (
              <label
                key={mat.id}
                className={`flex items-center p-4 border rounded-xl transition-all ${
                  !mat.disponible
                    ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-75" // Estilo bloqueado Anti-Spam
                    : seleccionados.includes(mat.id)
                      ? "border-sky-500 bg-sky-50 cursor-pointer"
                      : "border-gray-200 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={seleccionados.includes(mat.id)}
                  onChange={() => handleCheckbox(mat.id)}
                  disabled={!mat.disponible} // Bloqueo funcional
                  className="w-5 h-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500 disabled:opacity-50"
                />
                <div className="ml-3 flex-1 flex justify-between items-center">
                  <div>
                    <span className="block font-bold text-gray-800">
                      {mat.nombre}
                    </span>
                    <span className="block text-xs text-gray-500">
                      Cantidad estándar enviada: {mat.cantidadEstandar} uds.
                    </span>
                  </div>

                  {/* Etiqueta visible si el material está bloqueado */}
                  {!mat.disponible && (
                    <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md uppercase flex items-center gap-1">
                      <Clock size={10} /> En curso
                    </span>
                  )}
                </div>
              </label>
            ))
          )}
        </div>

        <button
          onClick={handleSolicitar}
          disabled={seleccionados.length === 0 || enviando}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors shadow-md shadow-sky-100"
        >
          {enviando ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Send size={18} className="mr-2" /> Enviar Petición
            </>
          )}
        </button>
      </div>

      {/* DERECHA: HISTORIAL */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
              <ClipboardList size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Mis Peticiones</h2>
          </div>
        </div>

        {/* --- BLOQUE DE FILTROS AÑADIDO --- */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="relative flex-1 min-w-[120px]">
            <Filter
              size={14}
              className="absolute left-2.5 top-3 text-gray-400"
            />
            <select
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
              className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-sky-500 transition-colors"
            >
              {mesesDisponibles.map((mes) => (
                <option key={mes} value={mes}>
                  {mes === "Todos" ? "Todos los meses" : mes}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <Filter
              size={14}
              className="absolute left-2.5 top-3 text-gray-400"
            />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-sky-500 transition-colors"
            >
              <option value="Todos">Todos los estados</option>
              <option value="SOLICITADO">Solicitados</option>
              <option value="APROBADO">Aprobados</option>
              <option value="CANCELADO">Cancelados</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[120px]">
            <ArrowUpDown
              size={14}
              className="absolute left-2.5 top-3 text-gray-400"
            />
            <select
              value={ordenFiltro}
              onChange={(e) => setOrdenFiltro(e.target.value)}
              className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-sky-500 transition-colors"
            >
              <option value="recientes">Más Recientes</option>
              <option value="antiguos">Más Antiguos</option>
            </select>
          </div>
        </div>

        {/* --- LISTA RENDERIZANDO peticionesFiltradas --- */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {peticionesFiltradas.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No se encontraron peticiones con estos filtros.
            </p>
          ) : (
            peticionesFiltradas.map((pet) => (
              <div
                key={pet.id}
                className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold flex items-center gap-1 text-gray-700">
                    <Clock size={14} /> {pet.fechaPeticion}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
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
                <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <strong className="text-xs uppercase tracking-wider text-gray-400">
                    Materiales solicitados:
                  </strong>
                  <ul className="list-disc pl-5 mt-2 text-xs font-bold text-gray-700 space-y-1">
                    {pet.materiales.map((m, idx) => (
                      <li key={idx}>
                        {m.nombre}{" "}
                        <span className="text-gray-400 font-medium">
                          ({m.cantidadEstandar} uds)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VistaSuministros;
