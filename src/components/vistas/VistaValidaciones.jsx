import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Banknote,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
} from "lucide-react";
import { pedidosService } from "../../services/pedidosService";
import { consultasService } from "../../services/consultasService";

const VistaValidaciones = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [todosPedidos, todasConsultas] = await Promise.all([
        pedidosService.listarTodos(),
        consultasService.listarTodas(),
      ]);
      setPedidosPendientes(
        todosPedidos.filter((p) => p.estado === "PENDIENTE_LIQUIDAR"),
      );
      setIncidencias(
        todasConsultas.filter((c) => c.estado === "CON_INCIDENCIA"),
      );
    } catch (error) {
      console.error("Error al cargar validaciones:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleLiquidarManual = async (id) => {
    if (
      !window.confirm(
        "¿Confirmas que este pedido ha sido revisado y pagado? Se pasará a estado LIQUIDADO.",
      )
    )
      return;
    try {
      await pedidosService.liquidar(id);
      cargarDatos();
    } catch (error) {
      alert(error.response?.data?.message || "Error al liquidar el pedido.");
    }
  };

  if (cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Centro de Validaciones</h2>
          <p className="text-indigo-100">
            Supervisa las operaciones financieras y las incidencias del
            personal.
          </p>
        </div>
        <ShieldCheck
          size={48}
          className="text-indigo-300 opacity-50 hidden md:block"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* PEDIDOS PENDIENTES */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <Banknote size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Pendientes de Liquidar
              </h3>
            </div>
            <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-sm">
              {pedidosPendientes.length}
            </span>
          </div>

          <div className="space-y-4">
            {pedidosPendientes.length === 0 ? (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                <CheckCircle
                  size={32}
                  className="mx-auto mb-2 text-emerald-300"
                />
                <p>Todos los pedidos están liquidados.</p>
              </div>
            ) : (
              pedidosPendientes.map((ped) => (
                <div
                  key={ped.id}
                  className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">
                        {ped.farmaciaNombre}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock size={12} /> {ped.fechaPedido} •{" "}
                        {ped.lineas.length} productos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-gray-800">
                        {ped.totalPedido.toFixed(2)}€
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLiquidarManual(ped.id)}
                    className="w-full mt-2 bg-gray-900 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Forzar Liquidación
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* INCIDENCIAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg text-red-600">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Incidencias Activas
              </h3>
            </div>
            <span className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full text-sm">
              {incidencias.length}
            </span>
          </div>

          <div className="space-y-4">
            {incidencias.length === 0 ? (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                <ShieldCheck
                  size={32}
                  className="mx-auto mb-2 text-indigo-300"
                />
                <p>No hay incidencias reportadas.</p>
              </div>
            ) : (
              incidencias.map((inc) => (
                <div
                  key={inc.id}
                  className="border border-red-100 bg-red-50/30 rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md uppercase">
                      Urgente
                    </span>
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                      <MapPin size={14} /> {inc.farmaciaNombre}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <p className="mb-1">
                      <strong className="text-gray-800">Fecha:</strong>{" "}
                      {inc.fecha} ({inc.tipoTurno})
                    </p>
                    <div className="bg-white border border-red-100 p-3 rounded-lg text-red-800">
                      <strong>Mensaje:</strong> "{inc.mensajeIncidencia}"
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaValidaciones;
