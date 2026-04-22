import React, { useState } from "react";
import { Loader2, FileText } from "lucide-react";
import { useDashboardAdmin } from "../hooks/useDashboardAdmin";
import AdminModalEvento from "../components/admin/AdminModalEvento";
import AdminAuditoriaPanel from "../components/admin/AdminAuditoriaPanel";
import AdminGraficaFacturacion from "../components/admin/AdminGraficaFacturacion";
import AdminCalendarioOperativo from "../components/admin/AdminCalendarioOperativo";
import ModalResumenDiario from "../components/admin/ModalResumenDiario";
// Asegúrate de que estos dos componentes estén exportados en los index.js de sus respectivos módulos
import ModalConsultaLectura from "../components/admin/ModalConsultaLectura";
import { ModalDetallePedido } from "@/modules/sales/pedidos";
import { dashboardService } from "../services/dashboardService";
import ModalGeneradorInformes from "../components/admin/ModalGeneradorInformes";
import { ModalVerEvidencia } from "@/modules/operations/consultas";

const DashboardAdminPage = ({ setVistaActual }) => {
  const hook = useDashboardAdmin();

  const [isResumenDiarioOpen, setIsResumenDiarioOpen] = useState(false);
  const [fotoAVisualizar, setFotoAVisualizar] = useState(null); // 👈 AÑADIDO: Estado para la foto
  const [eventosSeleccionados, setEventosSeleccionados] = useState({ consultas: [], pedidos: [] });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [consultaDetalle, setConsultaDetalle] = useState(null);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [isGeneradorOpen, setIsGeneradorOpen] = useState(false);

  if (hook.cargando && hook.facturacion.length === 0) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <AdminModalEvento
        eventoSeleccionado={hook.eventoSeleccionado}
        setEventoSeleccionado={hook.setEventoSeleccionado}
      />

      <AdminAuditoriaPanel />

      <AdminGraficaFacturacion
        anio={hook.anio}
        setAnio={hook.setAnio}
        facturacion={hook.facturacion}
        listadoFarmacias={hook.listadoFarmacias}
        listadoNutricionistas={hook.listadoNutricionistas}
        filtroFarmacia={hook.filtroFarmacia}
        setFiltroFarmacia={hook.setFiltroFarmacia}
        filtroNutri={hook.filtroNutri}
        setFiltroNutri={hook.setFiltroNutri}
      />

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

      {/* MODAL LIGERO DE CONSULTA (LECTURA) */}
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

      {pedidoDetalle && (
        <ModalDetallePedido
          pedido={pedidoDetalle}
          onCerrar={() => {
            setPedidoDetalle(null);
            setIsResumenDiarioOpen(true);
          }}
        />
      )}

      <div className="flex justify-center mt-8">
        <button onClick={() => setIsGeneradorOpen(true)} className="bg-white border-2 border-gray-200 text-[#062e3a] font-black py-4 px-8 rounded-2xl hover:border-[#367933] hover:text-[#367933] flex items-center gap-3 transition-all shadow-sm active:scale-95">
          <FileText size={24} className="text-[#bed000]" /> Abrir Generador de Informes Avanzados
        </button>
      </div>
      <ModalGeneradorInformes isOpen={isGeneradorOpen} onClose={() => setIsGeneradorOpen(false)} farmacias={hook.listadoFarmacias} nutricionistas={hook.listadoNutricionistas} />
    </div>
  );
};

export default DashboardAdminPage;
