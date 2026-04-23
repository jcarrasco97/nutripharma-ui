import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Search, MapPin, ClipboardList, ShoppingBag } from "lucide-react";
import { nutricionistasService } from "@/modules/organization/nutricionistas";
import { consultasService } from "@/modules/operations/consultas";
import { pedidosService } from "@/modules/sales/pedidos";
import { useNavigate } from "react-router-dom";

const AdminAuditoriaPanel = () => {
  const [nutricionistas, setNutricionistas] = useState([]);
  const [selectedNutri, setSelectedNutri] = useState("");

  // Almacén de datos en bruto (igual que useDashboardNutri)
  const [consultasBruto, setConsultasBruto] = useState([]);
  const [pedidosBruto, setPedidosBruto] = useState([]);
  const [mesesDisponibles, setMesesDisponibles] = useState([]);

  const [mesAuditoria, setMesAuditoria] = useState("");
  const [loading, setLoading] = useState(false);
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

  // 2. Al seleccionar Nutricionista, descargar sus datos y extraer meses
  useEffect(() => {
    if (!selectedNutri) {
      setConsultasBruto([]);
      setPedidosBruto([]);
      setMesesDisponibles([]);
      setMesAuditoria("");
      return;
    }

    const fetchDatosNutri = async () => {
      setLoading(true);
      try {
        const nutriInfo = nutricionistas.find(n => n.id.toString() === selectedNutri.toString());
        const nombreCompleto = `${nutriInfo.nombre} ${nutriInfo.apellidos}`;

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
      } catch (error) {
        console.error("Error cargando auditoría:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosNutri();
  }, [selectedNutri, nutricionistas]);

  // 3. El Motor Matemático (Idéntico a la Nutri - Métrica C)
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

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-full">

      {/* CABECERA PANEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#367933]">
            <Search size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#062e3a]">Panel de Auditoría</h2>
            <p className="text-[#342c1e] font-medium">Revisión de rendimiento por Nutricionista</p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedNutri}
            onChange={(e) => setSelectedNutri(e.target.value)}
            className="w-full md:w-64 bg-[#f4f7f4] border border-gray-200 text-[#062e3a] text-sm rounded-xl px-4 py-3 outline-none focus:border-[#b1cb0c] focus:ring-2 focus:ring-[#b1cb0c]/20 font-bold transition-all"
          >
            <option value="">Selecciona Nutricionista...</option>
            {nutricionistas.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre} {n.apellidos}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col justify-center min-h-[300px]">
        {!selectedNutri ? (
          <div className="text-center text-gray-400 p-8 border-2 border-dashed border-gray-100 rounded-3xl">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold text-lg text-[#062e3a]">Selecciona un perfil</p>
            <p className="text-sm">Elige un nutricionista para auditar su rendimiento.</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-[#367933]" size={48} />
          </div>
        ) : !auditoriaData || (auditoriaData.totalConsultas === 0 && auditoriaData.cantidadPedidos === 0) ? (
          <div className="text-center text-gray-400 p-8 border-2 border-dashed border-gray-100 rounded-3xl">
            <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-bold text-lg text-[#062e3a]">Sin actividad registrada</p>
            <p className="text-sm">No hay registros validados en el mes seleccionado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* TARJETA 1: RESUMEN LOGÍSTICO Y OPERATIVO */}
            <div className="bg-[#062e3a] p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-[#b1cb0c] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <MapPin className="text-[#b1cb0c]" size={20} />
                    Desplazamiento
                  </h3>
                </div>
                {mesesDisponibles.length > 0 && (
                  <select
                    value={mesAuditoria}
                    onChange={(e) => setMesAuditoria(e.target.value)}
                    className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[#b1cb0c] backdrop-blur-sm font-bold"
                  >
                    {mesesDisponibles.map(m => (
                      <option key={m} value={m} className="text-[#062e3a]">{m}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="relative z-10">
                <p className="text-[#b1cb0c] font-black text-xs uppercase tracking-widest">
                  Acumulado de
                  {mesAuditoria && (() => {
                    const [y, mm] = mesAuditoria.split('-');
                    const mName = new Date(y, mm - 1).toLocaleString("es-ES", { month: "long" });
                    return " " + mName.charAt(0).toUpperCase() + mName.slice(1) + " " + y;
                  })()}
                </p>

                <div className="flex items-end gap-3 my-4 mt-2">
                  <span className="text-6xl font-black tracking-tighter leading-none">{auditoriaData.totalKilometros}</span>
                  <span className="text-xl font-bold text-[#b1cb0c] mb-1">Km Totales</span>
                </div>

                <div className="flex flex-wrap gap-3 mb-6 text-sm font-bold opacity-90">
                  <div className="bg-white/10 px-3 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm border border-white/5">
                    <ClipboardList size={16} className="text-[#bed000]" />
                    {auditoriaData.totalConsultas} Consultas
                  </div>
                  <div className="bg-white/10 px-3 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm border border-white/5">
                    <ShoppingBag size={16} className="text-white" />
                    {auditoriaData.cantidadPedidos} Pedidos
                  </div>
                </div>
              </div>
            </div>

            {/* TARJETA 2: RENDIMIENTO ECONÓMICO (Textos unificados) */}
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-[#342c1e] font-black uppercase tracking-wider text-xs mb-4">
                  Ingreso Real Ponderado (Neto)
                </h3>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#b1cb0c]/20 p-2 rounded-lg text-[#367933]">
                        <ClipboardList size={18} />
                      </div>
                      <span className="font-bold text-[#062e3a] text-sm">Servicios Clínicos</span>
                    </div>
                    <span className="font-black text-xl text-[#367933]">{(auditoriaData.facturacionConsultas || 0).toFixed(2)}€</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <ShoppingBag size={18} />
                      </div>
                      <span className="font-bold text-[#062e3a] text-sm">Comisiones de Productos</span>
                    </div>
                    <span className="font-black text-xl text-[#062e3a]">{(auditoriaData.facturacionProductos || 0).toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-right text-[10px] uppercase font-black tracking-widest text-[#342c1e]/60 mb-1">
                  Beneficio Operativo Estimado
                </p>
                <p className="text-right text-4xl font-black text-[#062e3a] tracking-tighter">
                  {((auditoriaData.facturacionConsultas || 0) + (auditoriaData.facturacionProductos || 0)).toFixed(2)}€
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditoriaPanel;