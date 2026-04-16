import React from "react";
import { Loader2, AlertCircle } from "lucide-react";

import { usePedidos } from "../hooks/usePedidos";
import CatalogoProductos from "../components/CatalogoProductos";
import CestaPedidos from "../components/CestaPedidos";
import ModalDetallePedido from "../components/ModalDetallePedido";
import HistorialPedidosUsuario from "../components/HistorialPedidosUsuario";

const VistaPedidos = () => {
  const hook = usePedidos();

  if (hook.cargando) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-[#367933]" size={60} />
        <p className="text-[#342c1e]/60 font-bold animate-pulse">
          Cargando catálogo y entorno...
        </p>
      </div>
    );
  }

  if (hook.errorCarga) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-10 text-center max-w-2xl mx-auto">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-800">Error de carga</h3>
        <p className="text-red-600 mt-2">{hook.errorCarga}</p>
        <button
          onClick={hook.cargarDatos}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-xl font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in relative pb-10 h-full">
      <ModalDetallePedido
        pedido={hook.pedidoSeleccionado}
        onCerrar={() => hook.setPedidoSeleccionado(null)}
      />

      {/* COLUMNA IZQUIERDA: Catálogo y Monedero Integrado */}
      <div className="xl:col-span-7">
        <CatalogoProductos
          productos={hook.productos}
          ordenProductos={hook.ordenProductos}
          setOrdenProductos={hook.setOrdenProductos}
          farmaciaActual={hook.farmaciaActual}
          esAdmin={hook.esAdmin}
          esFarmacia={hook.esFarmacia}
          farmacias={hook.farmacias}
          farmaciaSeleccionada={hook.farmaciaSeleccionada}
          setFarmaciaSeleccionada={hook.setFarmaciaSeleccionada}
          agregarAlCarrito={hook.agregarAlCarrito}
          umbralAlcanzado={hook.umbralAlcanzado}
          saldoRestante={hook.saldoRestante}
          getPrecioAplicado={hook.getPrecioAplicado}
          totalReal={hook.totalReal}
        />
      </div>

      {/* COLUMNA DERECHA: Cesta e Historial */}
      <div className="xl:col-span-5 space-y-8">
        <CestaPedidos
          carrito={hook.carrito}
          modificarCantidad={hook.modificarCantidad}
          totalReal={hook.totalReal}
          totalVirtual={hook.totalVirtual}
          umbralAlcanzado={hook.umbralAlcanzado}
          farmaciaSeleccionada={hook.farmaciaSeleccionada}
          enviando={hook.enviando}
          handleRealizarPedido={hook.handleRealizarPedido}
          esAdmin={hook.esAdmin}
          getPrecioAplicado={hook.getPrecioAplicado}
        />
        <HistorialPedidosUsuario
          esAdmin={hook.esAdmin}
          esNutricionista={hook.esNutricionista}
          pedidosFiltrados={hook.pedidosFiltrados}
          mesFiltro={hook.mesFiltro}
          setMesFiltro={hook.setMesFiltro}
          ordenFiltro={hook.ordenFiltro}
          setOrdenFiltro={hook.setOrdenFiltro}
          mesesDisponibles={hook.mesesDisponibles || []}
          setPedidoSeleccionado={hook.setPedidoSeleccionado}
        />
      </div>
    </div>
  );
};

export default VistaPedidos;
