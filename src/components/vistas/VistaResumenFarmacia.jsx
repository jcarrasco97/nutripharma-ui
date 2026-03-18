import React, { useState, useEffect } from "react";
import {
  Wallet,
  ShoppingBag,
  Package,
  Filter,
  ArrowUpDown,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { farmaciaService } from "../../services/farmaciaService";
import { pedidosService } from "../../services/pedidosService";

const VistaResumenFarmacia = ({ cambiarVista }) => {
  const [perfil, setPerfil] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  // Estados del Filtro del Historial
  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");

  const cargarDatos = async () => {
    setCargando(true);
    setError(false);
    try {
      const [miPerfil, misPedidos] = await Promise.all([
        farmaciaService.obtenerMiPerfil(),
        pedidosService.obtenerMisPedidos(),
      ]);
      setPerfil(miPerfil);
      setPedidos(misPedidos);
    } catch (err) {
      console.error("Error al cargar el resumen de farmacia:", err);
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- RENDERIZADO DE CARGA ---
  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  // --- RENDERIZADO DE ERROR (Para evitar carga infinita) ---
  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center flex flex-col items-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-red-800 mb-2">
          Error de conexión
        </h3>
        <p className="text-red-600 mb-6 max-w-md">
          No hemos podido recuperar los datos de tu farmacia. Por favor,
          verifica tu conexión o vuelve a intentarlo.
        </p>
        <button
          onClick={cargarDatos}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-colors"
        >
          <RefreshCcw size={18} /> Reintentar
        </button>
      </div>
    );
  }

  if (!perfil) return null;

  // --- LÓGICA DE FILTROS ---
  const mesesDisponibles = [
    "Todos",
    ...new Set(pedidos.map((p) => p.fechaPedido.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  const pedidosFiltradosYOrdenados = pedidos
    .filter((p) => mesFiltro === "Todos" || p.fechaPedido.startsWith(mesFiltro))
    .sort((a, b) => {
      if (ordenFiltro === "recientes")
        return new Date(b.fechaPedido) - new Date(a.fechaPedido);
      if (ordenFiltro === "antiguos")
        return new Date(a.fechaPedido) - new Date(b.fechaPedido);
      if (ordenFiltro === "precio_desc") return b.totalPedido - a.totalPedido;
      if (ordenFiltro === "precio_asc") return a.totalPedido - b.totalPedido;
      return 0;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. TARJETA DE BIENVENIDA Y SALDO */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="relative z-10 w-full md:w-auto">
          <h2 className="text-2xl font-black mb-1 opacity-90">Bienvenido,</h2>
          <h3 className="text-3xl font-black mb-6">{perfil.nombre}</h3>

          <p className="text-purple-200 text-sm font-bold uppercase tracking-wide mb-1 flex items-center gap-2">
            <Wallet size={16} /> Saldo Virtual Disponible
          </p>
          <p className="text-5xl font-black text-white">
            {(perfil.saldoVirtual || 0).toFixed(2)}€
          </p>
        </div>

        <div className="relative z-10 w-full md:w-auto flex flex-col gap-3">
          <button
            onClick={() => cambiarVista("pedidos")}
            className="bg-white text-purple-700 hover:bg-purple-50 font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-105"
          >
            <ShoppingBag size={24} />
            Hacer Nuevo Pedido
          </button>
          <p className="text-center text-purple-200 text-xs font-medium">
            Supera los 80€ para aplicar tu saldo
          </p>
        </div>

        <Package
          size={250}
          className="absolute -right-10 -bottom-20 text-white opacity-10"
        />
      </div>

      {/* 2. HISTORIAL DE PEDIDOS FILTRABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="text-purple-600" size={24} /> Mi Historial de
              Pedidos
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Consulta tus últimos movimientos y liquidaciones.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-40">
              <Filter
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <select
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {mesesDisponibles.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes === "Todos" ? "Todos los meses" : mes}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 md:w-40">
              <ArrowUpDown
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <select
                value={ordenFiltro}
                onChange={(e) => setOrdenFiltro(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-700 font-medium appearance-none bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="recientes">Más Recientes</option>
                <option value="antiguos">Más Antiguos</option>
                <option value="precio_desc">Mayor Importe</option>
                <option value="precio_asc">Menor Importe</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {pedidosFiltradosYOrdenados.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                No se encontraron pedidos con estos filtros.
              </p>
            </div>
          ) : (
            pedidosFiltradosYOrdenados.map((ped) => {
              const saldoUsado =
                ped.lineas
                  ?.filter((l) => l.pagadoConSaldo)
                  .reduce((acc, l) => {
                    const totalLinea =
                      l.subtotal ||
                      (l.precioUnitario || l.precioAplicado || 0) * l.cantidad;
                    return acc + totalLinea;
                  }, 0) || 0;

              return (
                <div
                  key={ped.id}
                  className="border border-gray-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-gray-800 text-lg">
                        Pedido #{ped.id}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${ped.estado === "LIQUIDADO" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {ped.estado === "LIQUIDADO" && (
                          <CheckCircle2 size={12} />
                        )}
                        {ped.estado.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {ped.fechaPedido} • {ped.lineas?.length || 0} líneas de
                      producto
                    </p>
                  </div>

                  <div className="text-left md:text-right w-full md:w-auto bg-white md:bg-transparent p-3 md:p-0 rounded-xl border md:border-none border-gray-100">
                    <p className="font-black text-2xl text-gray-900">
                      {(ped.totalPedido || 0).toFixed(2)}€
                    </p>
                    {saldoUsado > 0 && (
                      <p className="text-xs text-purple-600 font-bold mt-1 bg-purple-50 inline-block px-2 py-1 rounded-md">
                        Saldo usado: -{saldoUsado.toFixed(2)}€
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default VistaResumenFarmacia;
