import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  Loader2,
  AlertCircle,
  Check,
  Car, // <-- NUEVO ICONO PARA KILÓMETROS
} from "lucide-react";
import { consultasService } from "../consultas/consultasService";
import { pedidosService } from "../pedidos/pedidosService";
import { nutricionistasService } from "../admin/nutricionistasService";

const VistaResumen = () => {
  const [datosResumen, setDatosResumen] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorBackend, setErrorBackend] = useState(null);

  const METAS_BASE = {
    OB1: { facturacion: 5000, productos: 800, incentivo: 200, exceso: 0 },
    OB2: { facturacion: 6800, productos: 1000, incentivo: 400, exceso: 0.05 },
    OB3: { facturacion: 8700, productos: 1200, incentivo: 600, exceso: 0.1 },
  };

  const cargarDatos = async () => {
    try {
      const [miPerfil, misConsultas, misPedidos] = await Promise.all([
        nutricionistasService.obtenerMiPerfil(),
        consultasService.obtenerMisConsultas(),
        pedidosService.obtenerMisPedidos(),
      ]);
      setPerfil(miPerfil);

      const mesActual = new Date().toISOString().substring(0, 7);

      // POR ESTO (El filtro Anti-Trampas):
      const consultasMes = misConsultas.filter(
        (c) => c.fecha.startsWith(mesActual) && c.estado === "VALIDADA",
        // Nota: Si en tu backend el estado de validación se llama distinto
        // (ej. "APROBADA"), cámbialo aquí.
      );

      const pedidosMes = misPedidos.filter(
        (p) =>
          p.fechaPedido.startsWith(mesActual) &&
          (p.estado === "ENVIADO" || p.estado === "LIQUIDADO"),
      );

      // 1. Cálculos de Consultas
      const totalNuevas = consultasMes.reduce((sum, c) => sum + c.nuevas, 0);
      const totalRevisiones = consultasMes.reduce(
        (sum, c) => sum + c.revisiones,
        0,
      );
      const facturacionConsultas = totalNuevas * 25 + totalRevisiones * 20;

      // 2. Cálculos de Pedidos
      const facturacionProductos = pedidosMes.reduce(
        (sum, p) => sum + p.totalPedido,
        0,
      );

      // 3. Totales Globales
      const facturacionTotal = facturacionConsultas + facturacionProductos;

      // 4. --- NUEVO: CÁLCULO DE KILOMETRAJE MENSUAL ---
      const totalKilometros = consultasMes.reduce((sum, consulta) => {
        // Buscamos la asignación coincidiendo por ID (asegurando que ambos son números) o por el Nombre de la Farmacia
        const asignacion = miPerfil.asignaciones?.find(
          (a) =>
            Number(a.farmaciaId) === Number(consulta.farmaciaId) ||
            a.farmaciaNombre === consulta.farmaciaNombre,
        );
        const kmViaje = asignacion ? asignacion.kilometros : 0;
        return sum + kmViaje;
      }, 0);

      setDatosResumen({
        mes: mesActual,
        totalNuevas,
        totalRevisiones,
        facturacionConsultas,
        facturacionProductos,
        facturacionTotal,
        totalKilometros, // <-- Guardamos la nueva métrica
      });
    } catch (error) {
      console.error("Error al cargar resumen:", error);
      setErrorBackend(
        "No se pudieron cargar tus datos. Asegúrate de tener permisos.",
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );
  }

  if (errorBackend) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-2xl border border-red-100 p-8 text-center animate-fade-in">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-red-800 mb-2">Error de Acceso</h3>
        <p className="text-red-600">{errorBackend}</p>
      </div>
    );
  }

  if (!datosResumen || !perfil) return null;

  const horasContrato = perfil.horasContratoMensual || 40;
  const factorJornada = horasContrato / 40;

  const METAS = {
    OB1: {
      facturacion: METAS_BASE.OB1.facturacion * factorJornada,
      productos: METAS_BASE.OB1.productos * factorJornada,
      incentivo: METAS_BASE.OB1.incentivo * factorJornada,
      exceso: METAS_BASE.OB1.exceso,
    },
    OB2: {
      facturacion: METAS_BASE.OB2.facturacion * factorJornada,
      productos: METAS_BASE.OB2.productos * factorJornada,
      incentivo: METAS_BASE.OB2.incentivo * factorJornada,
      exceso: METAS_BASE.OB2.exceso,
    },
    OB3: {
      facturacion: METAS_BASE.OB3.facturacion * factorJornada,
      productos: METAS_BASE.OB3.productos * factorJornada,
      incentivo: METAS_BASE.OB3.incentivo * factorJornada,
      exceso: METAS_BASE.OB3.exceso,
    },
  };

  const { facturacionTotal, facturacionProductos } = datosResumen;

  let nivelAlcanzado = "Ninguno";
  let incentivoBase = 0;
  let porcentajeExceso = 0;
  let umbralExceso = 0;
  let proximoObjetivo = METAS.OB1;
  let nombreProximoObj = "OB1";

  if (
    facturacionTotal >= METAS.OB3.facturacion &&
    facturacionProductos >= METAS.OB3.productos
  ) {
    nivelAlcanzado = "OB3";
    incentivoBase = METAS.OB3.incentivo;
    porcentajeExceso = METAS.OB3.exceso;
    umbralExceso = METAS.OB3.facturacion;
    proximoObjetivo = null;
  } else if (
    facturacionTotal >= METAS.OB2.facturacion &&
    facturacionProductos >= METAS.OB2.productos
  ) {
    nivelAlcanzado = "OB2";
    incentivoBase = METAS.OB2.incentivo;
    porcentajeExceso = METAS.OB2.exceso;
    umbralExceso = METAS.OB2.facturacion;
    proximoObjetivo = METAS.OB3;
    nombreProximoObj = "OB3";
  } else if (
    facturacionTotal >= METAS.OB1.facturacion &&
    facturacionProductos >= METAS.OB1.productos
  ) {
    nivelAlcanzado = "OB1";
    incentivoBase = METAS.OB1.incentivo;
    proximoObjetivo = METAS.OB2;
    nombreProximoObj = "OB2";
  }

  const dineroExceso =
    umbralExceso > 0 && facturacionTotal > umbralExceso
      ? facturacionTotal - umbralExceso
      : 0;
  const bonoExceso = dineroExceso * porcentajeExceso;
  const comisionFinal = incentivoBase + bonoExceso;

  const metaProgreso = proximoObjetivo
    ? proximoObjetivo.facturacion
    : METAS.OB3.facturacion;
  const porcentajeLogrado = Math.min(
    (facturacionTotal / metaProgreso) * 100,
    100,
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* CABECERA Y RESUMEN RÁPIDO */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              <TrendingUp size={32} /> Hola, {perfil.nombre}
            </h2>
            <p className="text-sky-100 font-medium mb-8">
              Tu rendimiento acumulado en {datosResumen.mes} (Contrato:{" "}
              {horasContrato}h/semana)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-sky-200 text-xs font-bold uppercase tracking-wide mb-1">
                  Nuevas
                </p>
                <p className="text-3xl font-black">
                  {datosResumen.totalNuevas}
                </p>
              </div>
              <div>
                <p className="text-sky-200 text-xs font-bold uppercase tracking-wide mb-1">
                  Revisiones
                </p>
                <p className="text-3xl font-black">
                  {datosResumen.totalRevisiones}
                </p>
              </div>
              <div>
                <p className="text-sky-200 text-xs font-bold uppercase tracking-wide mb-1">
                  Servicios
                </p>
                <p className="text-3xl font-black">
                  {datosResumen.facturacionConsultas.toFixed(2)}€
                </p>
              </div>
              <div>
                <p className="text-sky-200 text-xs font-bold uppercase tracking-wide mb-1">
                  Productos
                </p>
                <p className="text-3xl font-black text-emerald-300">
                  {datosResumen.facturacionProductos.toFixed(2)}€
                </p>
              </div>

              {/* --- NUEVA TARJETA DE KILOMETRAJE --- */}
              <div className="bg-white/10 p-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                <p className="text-sky-100 text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Car size={14} /> Distancia
                </p>
                <p className="text-3xl font-black text-white">
                  {datosResumen.totalKilometros}{" "}
                  <span className="text-lg font-bold opacity-70">km</span>
                </p>
              </div>
            </div>
          </div>
          <Target
            size={200}
            className="absolute -right-10 -bottom-10 text-white opacity-10"
          />
        </div>
      </div>

      {/* PANEL DE INCENTIVOS */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Tus Objetivos y Comisiones
            </h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 font-bold">
              Comisión Estimada (Mes)
            </p>
            <p className="text-3xl font-black text-amber-600">
              {comisionFinal.toFixed(2)}€
            </p>
          </div>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ESTADO ACTUAL */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
              Estado Actual
            </h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-700">
                    Facturación Total Generada
                  </span>
                  <span className="font-black text-gray-900">
                    {facturacionTotal.toFixed(2)}€
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${nivelAlcanzado !== "Ninguno" ? "bg-amber-500" : "bg-sky-500"}`}
                    style={{ width: `${porcentajeLogrado}%` }}
                  ></div>
                </div>
                {proximoObjetivo && (
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    Meta para {nombreProximoObj}:{" "}
                    {proximoObjetivo.facturacion.toFixed(2)}€
                  </p>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Requisitos Mínimos (Doble Condición)
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      {proximoObjetivo &&
                      facturacionTotal >= proximoObjetivo.facturacion ? (
                        <Check size={16} className="text-emerald-500" />
                      ) : (
                        <Clock size={16} className="text-amber-500" />
                      )}
                      Facturación Total
                    </span>
                    <span className="font-bold text-sm">
                      {facturacionTotal.toFixed(0)}€ /{" "}
                      {proximoObjetivo
                        ? proximoObjetivo.facturacion.toFixed(0)
                        : METAS.OB3.facturacion.toFixed(0)}
                      €
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      {proximoObjetivo &&
                      facturacionProductos >= proximoObjetivo.productos ? (
                        <Check size={16} className="text-emerald-500" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-500" />
                      )}
                      Venta de Productos
                    </span>
                    <span className="font-bold text-sm">
                      {facturacionProductos.toFixed(0)}€ /{" "}
                      {proximoObjetivo
                        ? proximoObjetivo.productos.toFixed(0)
                        : METAS.OB3.productos.toFixed(0)}
                      €
                    </span>
                  </div>
                </div>

                {proximoObjetivo &&
                  facturacionTotal >= proximoObjetivo.facturacion &&
                  facturacionProductos < proximoObjetivo.productos && (
                    <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-xl text-xs font-bold border border-red-100">
                      ⚠️ Has alcanzado la facturación total para el{" "}
                      {nombreProximoObj}, pero te faltan{" "}
                      {(
                        proximoObjetivo.productos - facturacionProductos
                      ).toFixed(2)}
                      € en venta de productos para desbloquear el incentivo.
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* TRAMOS */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
              Tramos de Incentivos
            </h4>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border-2 transition-all ${nivelAlcanzado === "OB1" ? "border-amber-400 bg-amber-50" : nivelAlcanzado === "OB2" || nivelAlcanzado === "OB3" ? "border-emerald-200 bg-emerald-50 opacity-60" : "border-gray-100 bg-white opacity-50"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-lg">Objetivo 1</span>
                  <span className="font-black text-lg text-amber-600">
                    +{METAS.OB1.incentivo.toFixed(2)}€
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-500">
                  Global: {METAS.OB1.facturacion.toFixed(0)}€ • Productos:{" "}
                  {METAS.OB1.productos.toFixed(0)}€
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border-2 transition-all ${nivelAlcanzado === "OB2" ? "border-amber-400 bg-amber-50" : nivelAlcanzado === "OB3" ? "border-emerald-200 bg-emerald-50 opacity-60" : "border-gray-100 bg-white opacity-50"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-lg">Objetivo 2</span>
                  <span className="font-black text-lg text-amber-600">
                    +{METAS.OB2.incentivo.toFixed(2)}€
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-500">
                  Global: {METAS.OB2.facturacion.toFixed(0)}€ • Productos:{" "}
                  {METAS.OB2.productos.toFixed(0)}€
                </p>
                <p className="text-xs font-bold text-emerald-600 mt-1">
                  + {METAS.OB2.exceso * 100}% de comisión sobre el exceso
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border-2 transition-all ${nivelAlcanzado === "OB3" ? "border-amber-400 bg-amber-50 shadow-md" : "border-gray-100 bg-white opacity-50"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black text-lg flex items-center gap-2">
                    Objetivo 3 <Award size={18} className="text-amber-500" />
                  </span>
                  <span className="font-black text-lg text-amber-600">
                    +{METAS.OB3.incentivo.toFixed(2)}€
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-500">
                  Global: {METAS.OB3.facturacion.toFixed(0)}€ • Productos:{" "}
                  {METAS.OB3.productos.toFixed(0)}€
                </p>
                <p className="text-xs font-bold text-emerald-600 mt-1">
                  + {METAS.OB3.exceso * 100}% de comisión sobre el exceso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaResumen;
