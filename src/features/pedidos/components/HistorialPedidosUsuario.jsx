import React from "react";
import { History, ShieldCheck } from "lucide-react";
import Badge from "../../../core/components/ui/Badge"; // Integración del nuevo componente atómico

const HistorialPedidosUsuario = ({
  esAdmin,
  pedidosFiltrados,
  mesFiltro,
  setMesFiltro,
  ordenFiltro,
  setOrdenFiltro,
  mesesDisponibles,
  setPedidoSeleccionado,
}) => {
  if (esAdmin) {
    return (
      <div className="bg-secondary/5 p-8 rounded-[3rem] border border-secondary/10 text-center">
        <ShieldCheck size={48} className="mx-auto text-accent mb-4" />
        <h3 className="text-xl font-black text-secondary mb-2">
          Modo Admin (Proxy)
        </h3>
        <p className="text-neutral text-sm font-medium">
          Estás creando un pedido para una farmacia. Verás el resultado en{" "}
          <b>Validaciones</b>.
        </p>
      </div>
    );
  }

  // Utilidad para formatear "2026-04" a "Abr 2026"
  const formatoMesCorto = (key) => {
    if (!key || key === "Todos") return "TODOS LOS MESES";
    const [year, month] = key.split("-");
    const nombre = new Date(year, month - 1).toLocaleString("es-ES", {
      month: "short",
    });
    return `${nombre.charAt(0).toUpperCase() + nombre.slice(1).replace(".", "")} ${year}`;
  };

  // Novedad: Formateador para embellecer los estados del Backend
  const embellecerEstado = (estadoRaw) => {
    if (!estadoRaw) return "";
    const est = estadoRaw.toUpperCase();
    if (est === "PENDIENTE_ENVIO") return "ENVÍO PENDIENTE";
    return est;
  };

  // Asignación semántica de colores para el Badge según el estado
  const getBadgeVariant = (estado) => {
    const est = estado?.toUpperCase() || "";
    if (est === "ENVIADO" || est === "LIQUIDADO") return "success";
    if (est === "CANCELADO" || est === "CANCELADA") return "danger";
    if (est === "PENDIENTE_ENVIO" || est === "PENDIENTE") return "warning"; // <-- Corregido aquí también
    return "default";
  };

  return (
    <div className="bg-surface p-8 rounded-[3rem] shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-accent/20 p-2 rounded-xl text-primary">
            <History size={20} />
          </div>
          <h3 className="text-lg font-black text-secondary">Mis pedidos</h3>
        </div>
        <span className="bg-secondary/10 text-secondary text-[10px] font-black px-3 py-1 rounded-full">
          {pedidosFiltrados.length} REG.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <select
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
          className="w-full p-3 bg-background rounded-2xl text-[10px] font-black text-secondary outline-none border border-transparent focus:border-accent cursor-pointer"
        >
          <option value="Todos">TODOS LOS MESES</option>
          {mesesDisponibles.map((m) => (
            <option key={m} value={m}>
              {formatoMesCorto(m)}
            </option>
          ))}
        </select>

        <select
          value={ordenFiltro}
          onChange={(e) => setOrdenFiltro(e.target.value)}
          className="w-full p-3 bg-background rounded-2xl text-[10px] font-black text-secondary outline-none border border-transparent focus:border-accent cursor-pointer"
        >
          <optgroup label="ORDENAR POR">
            <option value="recientes">MÁS RECIENTES</option>
            <option value="antiguos">MÁS ANTIGUOS</option>
            <option value="precio_desc">MAYOR IMPORTE</option>
            <option value="precio_asc">MENOR IMPORTE</option>
          </optgroup>
          <optgroup label="FILTRAR ESTADO">
            <option value="pendientes">SOLO PENDIENTES</option>
            <option value="enviados">SOLO ENVIADOS</option>
            <option value="cancelados">SOLO CANCELADOS</option>
          </optgroup>
        </select>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {pedidosFiltrados.length === 0 ? (
          <p className="text-center py-12 text-neutral/50 text-sm font-bold bg-background rounded-[2rem]">
            Sin resultados
          </p>
        ) : (
          pedidosFiltrados.map((ped) => (
            <div
              key={ped.id}
              className="group bg-background rounded-[1.5rem] p-5 border-2 border-transparent hover:bg-surface hover:border-accent transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-black text-secondary text-sm">
                    Pedido #{ped.id}
                  </p>
                  <p className="text-[10px] font-bold text-neutral/60">
                    {ped.fechaPedido}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <p className="font-black text-secondary">
                    {(ped.totalPedido || 0).toFixed(2)}€
                  </p>
                  <Badge variant={getBadgeVariant(ped.estado)}>
                    {embellecerEstado(ped.estado)}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => setPedidoSeleccionado(ped)}
                className="w-full py-2 bg-surface border border-gray-200 text-neutral rounded-xl text-[10px] font-black uppercase hover:bg-secondary hover:text-white transition-all"
              >
                Ver Detalle
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorialPedidosUsuario;
