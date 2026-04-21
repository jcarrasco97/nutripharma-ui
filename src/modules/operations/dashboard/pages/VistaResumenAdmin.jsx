import React, { useState } from "react";
import { Loader2, FileText } from "lucide-react";
import { useResumenAdmin } from "../hooks/useResumenAdmin";
import AdminModalEvento from "../components/admin/AdminModalEvento";
import AdminAuditoriaPanel from "../components/admin/AdminAuditoriaPanel";
import AdminGraficaFacturacion from "../components/admin/AdminGraficaFacturacion";
import AdminCalendarioOperativo from "../components/admin/AdminCalendarioOperativo";
import ModalResumenDiario from "../components/admin/ModalResumenDiario";
import ModalDetalleValidacion from "../../validaciones/components/ModalDetalleValidacion";
import ModalDetallePedido from "../../../sales/pedidos/components/ModalDetallePedido";
import { dashboardService } from "../services/dashboardService";
import ModalGeneradorInformes from "../components/admin/ModalGeneradorInformes";

const VistaResumenAdmin = () => {
  const hook = useResumenAdmin();

  const [isResumenDiarioOpen, setIsResumenDiarioOpen] = useState(false);
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

      {consultaDetalle && (
        <ModalDetalleValidacion
          detalle={consultaDetalle}
          pestañaActual="consultas"
          formEdicion={{
            nuevas: consultaDetalle.nuevas || 0,
            revisiones: consultaDetalle.revisiones || 0,
            promociones: consultaDetalle.promociones || 0,
            personalFarmacia: consultaDetalle.personalFarmacia || 0
          }}
          modoLectura={true}
          setFormEdicion={() => { }}
          enviando={false}
          onCerrar={() => {
            setConsultaDetalle(null);
            setIsResumenDiarioOpen(true);
          }}
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

export default VistaResumenAdmin;
