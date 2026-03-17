import React, { useState, useEffect } from "react";
import {
  Package,
  Send,
  ClipboardList,
  Clock,
  Loader2,
  CheckSquare,
} from "lucide-react";
import { suministrosService } from "../../services/suministrosService";

const VistaSuministros = () => {
  const [materiales, setMateriales] = useState([]);
  const [peticiones, setPeticiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Guardaremos un array con los IDs de los materiales que el usuario marque
  const [seleccionados, setSeleccionados] = useState([]);

  const NUTRICIONISTA_ID = 1; // ID temporal de Laura

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datosMat, datosPet] = await Promise.all([
        suministrosService.listarMateriales(),
        suministrosService.listarPeticiones(),
      ]);
      setMateriales(datosMat);

      // Filtramos en el frontend para mostrar solo las de este nutricionista (en el futuro lo hará el backend por token)
      const misPeticiones = datosPet.filter(
        (p) => p.nutricionistaNombre === "Laura",
      );
      setPeticiones(misPeticiones);
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
      await suministrosService.crearPeticion({
        nutricionistaId: NUTRICIONISTA_ID,
        materialIds: seleccionados,
      });
      alert("Petición de suministros enviada.");
      setSeleccionados([]); // Limpiamos el checklist
      cargarDatos();
    } catch {
      alert("Error al enviar la petición.");
    } finally {
      setEnviando(false);
    }
  };

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
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${seleccionados.includes(mat.id) ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="checkbox"
                  checked={seleccionados.includes(mat.id)}
                  onChange={() => handleCheckbox(mat.id)}
                  className="w-5 h-5 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
                />
                <div className="ml-3 flex-1">
                  <span className="block font-bold text-gray-800">
                    {mat.nombre}
                  </span>
                  <span className="block text-xs text-gray-500">
                    Cantidad estándar enviada: {mat.cantidadEstandar} uds.
                  </span>
                </div>
              </label>
            ))
          )}
        </div>

        <button
          onClick={handleSolicitar}
          disabled={seleccionados.length === 0 || enviando}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors"
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
            <ClipboardList size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Mis Peticiones</h2>
        </div>

        <div className="space-y-4">
          {peticiones.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No has solicitado suministros aún.
            </p>
          ) : (
            peticiones.map((pet) => (
              <div
                key={pet.id}
                className="border border-gray-100 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold flex items-center gap-1 text-gray-700">
                    <Clock size={14} /> {pet.fechaPeticion}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${pet.estado === "PENDIENTE" ? "bg-amber-100 text-amber-700" : pet.estado === "ENVIADA" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {pet.estado}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Materiales solicitados:</strong>
                  <ul className="list-disc pl-5 mt-1 text-xs text-gray-500">
                    {pet.materiales.map((m, idx) => (
                      <li key={idx}>
                        {m.nombre} ({m.cantidadEstandar} uds)
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
