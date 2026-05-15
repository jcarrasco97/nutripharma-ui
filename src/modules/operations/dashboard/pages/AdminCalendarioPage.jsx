import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useDashboardAdmin } from "../hooks/useDashboardAdmin";
import AdminCalendarioOperativo from "../components/admin/AdminCalendarioOperativo";
import ModalResumenDiario from "../components/admin/ModalResumenDiario";
import ModalConsultaLectura from "../components/admin/ModalConsultaLectura";
import { dashboardService } from "../services/dashboardService";

const AdminCalendarioPage = ({ setVistaActual }) => {
  const hook = useDashboardAdmin();

  const [isResumenDiarioOpen, setIsResumenDiarioOpen] = useState(false);
  const [eventosSeleccionados, setEventosSeleccionados] = useState({ consultas: [], pedidos: [] });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [consultaDetalle, setConsultaDetalle] = useState(null);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <AdminCalendarioOperativo
        anio={hook.anio}
        mes={hook.mes}
        cambiarMes={hook.cambiarMes}
        diasMes={hook.diasMes}
        offset={hook.offset}
        getEventosDelDia={hook.getEventosDelDia}
        fechaActual={hook.fechaActual}
        onSelectDate={(fecha, eventos) => {
          setFechaSeleccionada(fecha);
          setEventosSeleccionados(eventos);
          setIsResumenDiarioOpen(true);
        }}
      />

      <ModalResumenDiario
        isOpen={isResumenDiarioOpen}
        onClose={() => setIsResumenDiarioOpen(false)}
        fecha={fechaSeleccionada}
        eventos={eventosSeleccionados}
        onVerDetalleConsulta={async (consulta) => {
          try {
            setCargandoDetalle(true);
            const id = consulta.idUnico.split("-")[1];
            const detalleCompleto = await dashboardService.obtenerConsultaDetalle(id);
            setConsultaDetalle(detalleCompleto);
            setIsResumenDiarioOpen(false);
          } catch (error) {
            console.error("Error cargando detalle", error);
            alert("No se pudo descargar la información ampliada de la consulta.");
          } finally {
            setCargandoDetalle(false);
          }
        }}
        onVerDetallePedido={async (pedido) => {
          try {
            setCargandoDetalle(true);
            const id = pedido.idUnico.split("-")[1];
            const detalleCompleto = await dashboardService.obtenerPedidoDetalle(id);
            setPedidoDetalle(detalleCompleto);
            setIsResumenDiarioOpen(false);
          } catch (error) {
            console.error("Error cargando detalle", error);
            alert("No se pudo descargar la información ampliada del pedido.");
          } finally {
            setCargandoDetalle(false);
          }
        }}
      />

      {cargandoDetalle && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
      )}

      {consultaDetalle && (
        <ModalConsultaLectura
          consulta={consultaDetalle}
          onCerrar={() => {
            setConsultaDetalle(null);
            setIsResumenDiarioOpen(true);
          }}
          onIrAGestionar={(c) => hook.handleDeepLinkValidacion(c, setVistaActual)}
        />
      )}
    </div>
  );
};

export default AdminCalendarioPage;
