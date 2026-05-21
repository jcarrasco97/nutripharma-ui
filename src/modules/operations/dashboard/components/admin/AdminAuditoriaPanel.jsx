import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Search, MapPin, ClipboardList, ShoppingBag } from "lucide-react";
import { nutricionistasService } from "@/modules/organization/nutricionistas";
import { consultasService } from "@/modules/operations/consultas";
import { pedidosService } from "@/modules/sales/pedidos";
import { dashboardService } from "@/modules/operations/dashboard/services/dashboardService";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/Select";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/shared/components/ui/Empty";

const AdminAuditoriaPanel = () => {
  const [nutricionistas, setNutricionistas] = useState([]);
  const [selectedNutri, setSelectedNutri] = useState("");

  // Almacén de datos en bruto (igual que useDashboardNutri)
  const [consultasBruto, setConsultasBruto] = useState([]);
  const [pedidosBruto, setPedidosBruto] = useState([]);
  const [mesesDisponibles, setMesesDisponibles] = useState([]);

  const [mesAuditoria, setMesAuditoria] = useState("");
  const [loading, setLoading] = useState(false);

  // Historial de últimos meses
  const [historialMeses, setHistorialMeses] = useState([]);

  const navigate = useNavigate();

  // 1. Cargar lista maestra de Nutricionistas
  useEffect(() => {
    const fetchNutris = async () => {
      try {
        const lis = await nutricionistasService.listarTodas();
        setNutricionistas(lis);
      } catch (error) {
        console.error("Error al cargar nutricionistas:", error);
      }
    };
    fetchNutris();
  }, []);

  // 2. Autoselección: primera nutricionista con actividad registrada
  useEffect(() => {
    if (nutricionistas.length === 0 || selectedNutri) return;

    const autoselect = async () => {
      for (const n of nutricionistas) {
        try {
          const meses = await dashboardService.obtenerMesesDisponiblesAuditoria(n.id);
          if (Array.isArray(meses) && meses.length > 0) {
            setSelectedNutri(String(n.id));
            return;
          }
        } catch (_) {}
      }
    };

    autoselect();
  }, [nutricionistas, selectedNutri]);

  // 3. Al seleccionar Nutricionista, descargar sus datos y extraer meses
  useEffect(() => {
    if (!selectedNutri) {
      setConsultasBruto([]);
      setPedidosBruto([]);
      setMesesDisponibles([]);
      setMesAuditoria("");
      setHistorialMeses([]);
      return;
    }

    const fetchDatosNutri = async () => {
      setLoading(true);
      try {
        const nutriInfo = nutricionistas.find(n => n.id.toString() === selectedNutri.toString());
        const nombreCompleto = `${nutriInfo.nombre} ${nutriInfo.apellidos}`;
        const asignaciones = nutriInfo?.asignaciones || [];

        // Simulamos la ingesta de Métrica C
        const [todasConsultas, todosPedidos] = await Promise.all([
          consultasService.obtenerTodas(),
          pedidosService.listarTodos()
        ]);

        // Filtramos Consultas válidas de esta nutri
        const misConsultas = todasConsultas.filter(c =>
          c.nutricionistaNombre === nombreCompleto &&
          (c.estado === "VALIDADA" || c.estado === "LIQUIDADA")
        );

        // Filtramos Pedidos válidos donde esta nutri tiene comisión (Reparto)
        const misPedidos = todosPedidos.filter(p =>
          (p.estado === "ENVIADO" || p.estado === "LIQUIDADO") &&
          p.repartos?.some(r => r.nutricionistaId?.toString() === selectedNutri.toString())
        );

        setConsultasBruto(misConsultas);
        setPedidosBruto(misPedidos);

        // Extraer meses únicos de la actividad real
        const mesesSet = new Set([
          ...misConsultas.map(c => c.fecha?.substring(0, 7)),
          ...misPedidos.map(p => p.fechaPedido?.substring(0, 7))
        ].filter(Boolean));

        const mesesArr = [...mesesSet].sort((a, b) => b.localeCompare(a));
        setMesesDisponibles(mesesArr);

        if (mesesArr.length > 0) {
          setMesAuditoria(mesesArr[0]);
        }

        // Calcular historial de últimos 4 meses (sin llamadas adicionales al backend)
        const ultimos4 = mesesArr.slice(0, 4);
        const historial = ultimos4.map(mes => {
          const consultasMes = misConsultas.filter(c => c.fecha?.startsWith(mes));
          const pedidosMes = misPedidos.filter(p => p.fechaPedido?.startsWith(mes));

          let kms = 0;
          let factConsultas = 0;
          consultasMes.forEach(c => {
            factConsultas += (c.nuevas * 25) + (c.revisiones * 20);
            const asig = asignaciones.find(a => a.farmaciaNombre === c.farmaciaNombre);
            if (asig) kms += (asig.kilometros || 0);
          });

          let factProductos = 0;
          pedidosMes.forEach(p => {
            const miReparto = p.repartos?.find(r => r.nutricionistaId?.toString() === selectedNutri.toString());
            if (miReparto) {
              factProductos += p.totalPedido * (miReparto.porcentaje / 100);
            }
          });

          return {
            mes,
            facturacionConsultas: factConsultas,
            facturacionProductos: factProductos,
            totalKilometros: kms,
          };
        });

        setHistorialMeses(historial);
      } catch (error) {
        console.error("Error cargando auditoría:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosNutri();
  }, [selectedNutri, nutricionistas]);

  // 4. El Motor Matemático (Idéntico a la Nutri - Métrica C)
  const auditoriaData = useMemo(() => {
    if (!mesAuditoria || !selectedNutri) return null;

    const nutriInfo = nutricionistas.find(n => n.id.toString() === selectedNutri.toString());
    const asignaciones = nutriInfo?.asignaciones || [];

    // Filtramos los datos brutos por el mes seleccionado
    const consultasMes = consultasBruto.filter(c => c.fecha?.startsWith(mesAuditoria));
    const pedidosMes = pedidosBruto.filter(p => p.fechaPedido?.startsWith(mesAuditoria));

    let kms = 0;
    let factConsultas = 0;

    // Cálculo Consultas + Kilómetros
    consultasMes.forEach(c => {
      factConsultas += (c.nuevas * 25) + (c.revisiones * 20);
      const asig = asignaciones.find(a => a.farmaciaNombre === c.farmaciaNombre);
      if (asig) kms += (asig.kilometros || 0);
    });

    // Cálculo Productos (Aplicando el % de Reparto)
    let factProductos = 0;
    pedidosMes.forEach(p => {
      const miReparto = p.repartos?.find(r => r.nutricionistaId?.toString() === selectedNutri.toString());
      if (miReparto) {
        factProductos += p.totalPedido * (miReparto.porcentaje / 100);
      }
    });

    return {
      totalKilometros: kms,
      totalConsultas: consultasMes.length,
      cantidadPedidos: pedidosMes.length,
      facturacionConsultas: factConsultas,
      facturacionProductos: factProductos
    };
  }, [mesAuditoria, selectedNutri, consultasBruto, pedidosBruto, nutricionistas]);

  // Helper: formatea "2025-03" → "Mar 2025"
  const formatMes = (mesStr) => {
    if (!mesStr) return mesStr;
    const [y, mm] = mesStr.split("-");
    const mName = new Date(y, mm - 1).toLocaleString("es-ES", { month: "short" });
    return mName.charAt(0).toUpperCase() + mName.slice(1) + " " + y;
  };

  return (
    <div className="bg-surface rounded-md border border-neutral/10 p-5 flex flex-col h-full">

      {/* CABECERA */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-primary" />
          <div>
            <h2 className="text-sm font-semibold text-secondary leading-tight">Panel de Auditoría</h2>
            <p className="text-xs text-neutral/50 leading-tight">Revisión de rendimiento por Nutricionista</p>
          </div>
        </div>

        {/* Select de nutricionista */}
        <Select
          value={selectedNutri || "__all__"}
          onValueChange={(val) => setSelectedNutri(val === "__all__" ? "" : val)}
        >
          <SelectTrigger size="default" className="w-[220px]">
            <SelectValue placeholder="Selecciona Nutricionista..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Selecciona Nutricionista...</SelectItem>
            {nutricionistas.map((n) => (
              <SelectItem key={n.id} value={String(n.id)}>
                {n.nombre} {n.apellidos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col justify-center min-h-[300px]">
        {!selectedNutri ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>Selecciona un perfil</EmptyTitle>
              <EmptyDescription>
                Elige un nutricionista para auditar su rendimiento.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : !auditoriaData || (auditoriaData.totalConsultas === 0 && auditoriaData.cantidadPedidos === 0) ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ClipboardList />
              </EmptyMedia>
              <EmptyTitle>Sin actividad registrada</EmptyTitle>
              <EmptyDescription>
                No hay registros validados en el mes seleccionado.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in">

            {/* GRID: Tarjeta Desplazamiento + Tarjeta Ingresos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* TARJETA 1: DESPLAZAMIENTO */}
              <div className="bg-secondary rounded-md p-5 text-white relative overflow-hidden">

                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="text-[#b1cb0c]" size={16} />
                    Desplazamiento
                  </h3>

                  {mesesDisponibles.length > 0 && (
                    <Select
                      value={mesAuditoria}
                      onValueChange={(val) => setMesAuditoria(val)}
                    >
                      <SelectTrigger
                        size="sm"
                        className="h-8 bg-surface/10 border-surface/20 text-surface hover:bg-surface/20 focus-visible:ring-surface/30 w-auto min-w-[110px]"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mesesDisponibles.map(m => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <p className="text-[#b1cb0c] font-bold text-[10px] uppercase tracking-widest">
                  Acumulado de
                  {mesAuditoria && (() => {
                    const [y, mm] = mesAuditoria.split('-');
                    const mName = new Date(y, mm - 1).toLocaleString("es-ES", { month: "long" });
                    return " " + mName.charAt(0).toUpperCase() + mName.slice(1) + " " + y;
                  })()}
                </p>

                <div className="flex items-end gap-2 my-3">
                  <span className="text-5xl font-bold tracking-tighter leading-none">{auditoriaData.totalKilometros}</span>
                  <span className="text-base font-semibold text-[#b1cb0c] mb-0.5">Km Totales</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-surface/70 bg-surface/10 px-2.5 py-1 rounded-md">
                    <ClipboardList size={13} className="text-[#b1cb0c]" />
                    {auditoriaData.totalConsultas} Consultas
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-surface/70 bg-surface/10 px-2.5 py-1 rounded-md">
                    <ShoppingBag size={13} />
                    {auditoriaData.cantidadPedidos} Pedidos
                  </div>
                </div>
              </div>

              {/* TARJETA 2: RENDIMIENTO ECONÓMICO */}
              <div className="bg-surface border border-neutral/10 rounded-md p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral/50 mb-3">
                    Ingreso Real Ponderado (Neto)
                  </h3>

                  <div className="space-y-2">
                    {/* Fila Servicios */}
                    <div className="flex items-center justify-between p-3 rounded-md bg-neutral/[0.02] border border-neutral/10">
                      <div className="flex items-center gap-2.5">
                        <ClipboardList size={15} className="text-primary shrink-0" />
                        <span className="text-sm font-medium text-secondary">Servicios Clínicos</span>
                      </div>
                      <span className="font-bold text-lg text-primary">
                        {(auditoriaData.facturacionConsultas || 0).toFixed(2)}€
                      </span>
                    </div>

                    {/* Fila Comisiones */}
                    <div className="flex items-center justify-between p-3 rounded-md bg-neutral/[0.02] border border-neutral/10">
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag size={15} className="text-secondary shrink-0" />
                        <span className="text-sm font-medium text-secondary">Comisiones de Productos</span>
                      </div>
                      <span className="font-bold text-lg text-secondary">
                        {(auditoriaData.facturacionProductos || 0).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-neutral/10">
                  <p className="text-right text-[10px] font-bold uppercase tracking-wider text-neutral/40 mb-1">
                    Beneficio Operativo Estimado
                  </p>
                  <p className="text-right text-3xl font-bold text-secondary tracking-tighter">
                    {((auditoriaData.facturacionConsultas || 0) + (auditoriaData.facturacionProductos || 0)).toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>

            {/* HISTORIAL DE ÚLTIMOS MESES */}
            {historialMeses.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {historialMeses.map((h) => {
                  const isActive = h.mes === mesAuditoria;
                  const total = (h.facturacionConsultas || 0) + (h.facturacionProductos || 0);
                  return (
                    <button
                      key={h.mes}
                      onClick={() => setMesAuditoria(h.mes)}
                      className={`flex-1 min-w-[120px] text-left border rounded-md p-3 transition-all
                        ${isActive
                          ? "border-primary/30 bg-primary/[0.02]"
                          : "border-neutral/10 bg-surface hover:border-neutral/20 hover:bg-neutral/[0.02]"
                        }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral/50 mb-1">
                        {formatMes(h.mes)}
                      </p>
                      <p className={`text-base font-semibold mb-1 ${isActive ? "text-primary" : "text-secondary"}`}>
                        {total.toFixed(0)}€
                      </p>
                      <p className="text-xs text-neutral/50">
                        Consultas: {(h.facturacionConsultas || 0).toFixed(0)}€
                      </p>
                      <p className="text-xs text-neutral/50">
                        Productos: {(h.facturacionProductos || 0).toFixed(0)}€
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditoriaPanel;