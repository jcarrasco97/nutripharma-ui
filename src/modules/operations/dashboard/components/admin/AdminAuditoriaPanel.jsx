import React, { useState, useEffect } from "react";
import { Loader2, Search, MapPin, ClipboardList, ShoppingBag, FileText, ArrowRight } from "lucide-react";
import { nutricionistasService } from "../../../../organization/nutricionistas/services/nutricionistasService";
import { dashboardService } from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";

const AdminAuditoriaPanel = () => {
  const [nutricionistas, setNutricionistas] = useState([]);
  const [selectedNutri, setSelectedNutri] = useState("");
  const [mesesDisponibles, setMesesDisponibles] = useState([]);
  const [mesAuditoria, setMesAuditoria] = useState("");
  const [auditoriaData, setAuditoriaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNutris = async () => {
      try {
        const lis = await nutricionistasService.listarTodas();
        // El backend ya filtra por activo=true vía @SQLRestriction
        setNutricionistas(lis);
      } catch (error) {
        console.error("Error al cargar nutricionistas:", error);
      }
    };
    fetchNutris();
  }, []);

  // Efecto 1: Carga de meses disponibles
  useEffect(() => {
    if (!selectedNutri) {
      setAuditoriaData(null);
      setMesesDisponibles([]);
      setMesAuditoria("");
      return;
    }

    const fetchMeses = async () => {
      try {
        const resultado = await dashboardService.obtenerMesesDisponiblesAuditoria(selectedNutri);
        setMesesDisponibles(resultado);
        if (resultado.length > 0) {
          setMesAuditoria(resultado[0]);
        } else {
          setMesAuditoria("");
          setAuditoriaData(null);
        }
      } catch (error) {
        console.error("Error al cargar meses disponibles:", error);
      }
    };

    fetchMeses();
  }, [selectedNutri]);

  // Efecto 2: Carga de datos de auditoría
  useEffect(() => {
    if (!selectedNutri || !mesAuditoria) {
      setAuditoriaData(null);
      return;
    }

    const fetchAuditoria = async () => {
      setLoading(true);
      try {
        const [anioStr, mesStr] = mesAuditoria.split('-');
        const anioInt = parseInt(anioStr, 10);
        // backend expects mes 1-12, but dashboardService adds +1.
        // so we pass JS offset (0-11)
        const mesJS = parseInt(mesStr, 10) - 1;

        const data = await dashboardService.obtenerAuditoriaNutricionista(selectedNutri, anioInt, mesJS);
        setAuditoriaData(data);
      } catch (error) {
        console.error("Error al cargar auditoria:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, [selectedNutri, mesAuditoria]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-8">
      {/* Selector Area */}
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl text-[#367933]">
            <Search size={28} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#062e3a]">
              Modo Auditoría
            </h2>
            <p className="text-sm md:text-base text-[#342c1e] font-medium">
              Analiza el rendimiento individual cruzado con kilometraje
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedNutri}
            onChange={(e) => setSelectedNutri(e.target.value)}
            className="w-full bg-[#f4f7f4] border border-gray-200 text-[#062e3a] text-sm md:text-base rounded-xl focus:ring-[#367933] focus:border-[#367933] block p-3.5 outline-none font-bold appearance-none cursor-pointer pr-10 hover:border-gray-300 transition-colors"
          >
            <option value="">Selecciona una cuenta profesional...</option>
            {nutricionistas.map((n) => (
              <option key={n.id} value={n.id}>
                {/* 👇 AQUÍ ESTÁ LA MAGIA 👇 */}
                {n.nombre} {n.apellidos} {n.usuarioEmail ? `(${n.usuarioEmail})` : ""}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#367933]">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {selectedNutri && (
          <div className="relative mt-4">
            <select
              value={mesAuditoria}
              onChange={(e) => setMesAuditoria(e.target.value)}
              disabled={mesesDisponibles.length === 0}
              className="w-full bg-[#f4f7f4] border border-gray-200 text-[#062e3a] text-sm md:text-base rounded-xl focus:ring-[#367933] focus:border-[#367933] block p-3.5 outline-none font-bold appearance-none cursor-pointer pr-10 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mesesDisponibles.length === 0 ? (
                <option value="">No hay datos registrados</option>
              ) : (
                mesesDisponibles.map((m) => {
                  const [y, mm] = m.split("-");
                  const nombreMes = new Date(y, mm - 1).toLocaleString("es-ES", { month: "long" });
                  const nombreFinal = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
                  return (
                    <option key={m} value={m}>
                      {nombreFinal} {y}
                    </option>
                  );
                })
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#367933]">
              <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Resultados de Auditoría */}
      <div className="flex-1 xl:max-w-xl">
        {!selectedNutri && (
          <div className="h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 text-gray-400">
            <Search size={32} className="mb-2 opacity-50" />
            <p className="font-bold text-sm text-center">Busca y selecciona una cuenta en el desplegable<br />para auditar su mes en curso.</p>
          </div>
        )}

        {selectedNutri && loading && (
          <div className="h-full min-h-[200px] border border-gray-100 bg-[#f4f7f4] rounded-3xl flex flex-col items-center justify-center p-6">
            <Loader2 className="animate-spin text-[#367933]" size={40} />
          </div>
        )}

        {selectedNutri && !loading && auditoriaData && (
          <div className="bg-gradient-to-br from-[#062e3a] to-[#041d25] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-[#062e3a]/30 border border-[#062e3a]">
            {/* Decoración de fondo */}
            <div className="absolute -right-6 -top-6 text-white/5 rotate-12 pointer-events-none">
              <MapPin size={180} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <p className="text-[#bed000] text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                  <ClipboardList size={14} /> Análisis de {
                    (() => {
                      if (!mesAuditoria) return "";
                      const [y, mm] = mesAuditoria.split('-');
                      const mName = new Date(y, mm - 1).toLocaleString("es-ES", { month: "long" });
                      return mName.charAt(0).toUpperCase() + mName.slice(1) + " " + y;
                    })()
                  }
                </p>

                <div className="flex items-end gap-3 my-4 mt-2">
                  <span className="text-6xl font-black tracking-tighter leading-none">{auditoriaData.totalKilometros}</span>
                  <span className="text-xl font-bold text-[#b1cb0c] mb-1">Km Totales</span>
                </div>

                <div className="flex flex-wrap gap-3 mb-6 text-sm font-bold opacity-90">
                  <div className="bg-white/10 px-3 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm border border-white/5">
                    <ClipboardList size={16} className="text-[#bed000]" />
                    {auditoriaData.totalConsultas} Consultas Validadas
                  </div>
                  <div className="bg-white/10 px-3 py-2 rounded-xl flex items-center gap-2 backdrop-blur-sm border border-white/5">
                    <ShoppingBag size={16} className="text-white" />
                    {auditoriaData.cantidadPedidos} Pedidos Asociados
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditoriaPanel;