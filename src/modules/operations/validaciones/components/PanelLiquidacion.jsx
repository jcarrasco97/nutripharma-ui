import React, { useMemo } from "react";
import { CheckSquare, Square, Calculator, Calendar, Receipt, CheckCircle2, Loader2, BadgeEuro, Eye, ArrowUpDown } from "lucide-react";

const PanelLiquidacion = ({ hook }) => {
    const {
        pendientesLiquidar,
        seleccionadasLiquidacion,
        toggleSeleccionLiquidacion,
        seleccionarTodasLiquidacion,
        handleLiquidarLote,
        listaNutrisGlobal,
        filtroNutriLiquidacion,
        setFiltroNutriLiquidacion,
        filtroMesLiquidacion,
        setFiltroMesLiquidacion,
        ordenLiquidacion,
        setOrdenLiquidacion,
        enviando,
        abrirDetalleConsulta
    } = hook;

    // 1. Opciones de Filtro (Meses únicos de las pendientes)
    const mesesDisponibles = useMemo(() => {
        const meses = new Set();
        pendientesLiquidar.forEach(c => {
            if (c.fecha) meses.add(c.fecha.substring(0, 7)); // YYYY-MM
        });
        return Array.from(meses).sort((a, b) => b.localeCompare(a));
    }, [pendientesLiquidar]);

    // 2. Filtrar Consultas (Aplicar Selectores)
    const consultasFiltradas = useMemo(() => {
        const filtradas = pendientesLiquidar.filter(c => {
            const pasaNutri = filtroNutriLiquidacion ? c.nutricionistaNombre === filtroNutriLiquidacion : true;
            const pasaMes = filtroMesLiquidacion !== "ALL" ? c.fecha?.startsWith(filtroMesLiquidacion) : true;
            return pasaNutri && pasaMes;
        });

        // Aplicar Ordenación
        return filtradas.sort((a, b) => {
            const comisionA = ((a.nuevas || 0) * 25) + ((a.revisiones || 0) * 20);
            const comisionB = ((b.nuevas || 0) * 25) + ((b.revisiones || 0) * 20);
            const fechaA = new Date(a.fecha || 0).getTime();
            const fechaB = new Date(b.fecha || 0).getTime();

            switch (ordenLiquidacion) {
                case "FECHA_ASC": return fechaA - fechaB;
                case "COMISION_ASC": return comisionA - comisionB;
                case "COMISION_DESC": return comisionB - comisionA;
                case "FECHA_DESC":
                default: return fechaB - fechaA;
            }
        });
    }, [pendientesLiquidar, filtroNutriLiquidacion, filtroMesLiquidacion, ordenLiquidacion]);

    // 3. Matemáticas del Carrito
    const desglose = useMemo(() => {
        let nuevas = 0;
        let revisiones = 0;

        consultasFiltradas.forEach(c => {
            if (seleccionadasLiquidacion.includes(c.id)) {
                nuevas += (c.nuevas || 0);
                revisiones += (c.revisiones || 0);
            }
        });

        const totalNuevas = nuevas * 25;
        const totalRevisiones = revisiones * 20;
        const totalEuros = totalNuevas + totalRevisiones;

        return { nuevas, revisiones, totalNuevas, totalRevisiones, totalEuros };
    }, [consultasFiltradas, seleccionadasLiquidacion]);

    const todosSeleccionados = consultasFiltradas.length > 0 && consultasFiltradas.every(c => seleccionadasLiquidacion.includes(c.id));

    const formatMes = (iso) => {
        const [year, month] = iso.split("-");
        const date = new Date(year, month - 1);
        const nombreStr = date.toLocaleDateString("es-ES", { month: "long" });
        return `${nombreStr.charAt(0).toUpperCase() + nombreStr.slice(1)} ${year}`;
    };

    return (
        // 👇 CAMBIO CLAVE 1: flex-col-reverse asegura que en móviles el "Resumen" salga arriba. xl:flex-row en pantallas grandes.
        <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">
            {/* 🟢 PANEL IZQUIERDO: Filtros y Tabla */}
            <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col min-h-[500px] xl:h-[700px]">

                {/* Cabecera de Tabla y Filtros */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 mb-6 border-b border-gray-100 pb-6 shrink-0">
                    <div className="shrink-0">
                        <h3 className="text-xl font-black text-[#062e3a] flex items-center gap-2">
                            <Calculator className="text-[#367933]" /> Cierre de Caja
                        </h3>
                        <p className="text-sm font-bold text-[#342c1e]/60 mt-1">Selecciona las consultas validadas que vas a liquidar hoy.</p>
                    </div>

                    {/* 👇 CAMBIO CLAVE 2: flex-wrap permite que caigan a la siguiente línea. w-auto se adapta al texto. */}
                    <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-start xl:justify-end">
                        <select
                            value={filtroNutriLiquidacion}
                            onChange={(e) => setFiltroNutriLiquidacion(e.target.value)}
                            className="bg-[#f4f7f4] border border-gray-200 text-[#062e3a] text-xs font-bold rounded-xl focus:ring-[#367933] outline-none px-3 py-2.5 w-auto cursor-pointer"
                        >
                            <option value="">Todas las Nutris</option>
                            {listaNutrisGlobal.map(n => (
                                <option key={n.id} value={`${n.nombre} ${n.apellidos}`}>{n.nombre} {n.apellidos}</option>
                            ))}
                        </select>

                        <select
                            value={filtroMesLiquidacion}
                            onChange={(e) => setFiltroMesLiquidacion(e.target.value)}
                            className="bg-[#f4f7f4] border border-gray-200 text-[#062e3a] text-xs font-bold rounded-xl focus:ring-[#367933] outline-none px-3 py-2.5 w-auto cursor-pointer"
                        >
                            <option value="ALL">Todos los Meses</option>
                            {mesesDisponibles.map(m => (
                                <option key={m} value={m}>{formatMes(m)}</option>
                            ))}
                        </select>

                        {/* Selector de Ordenación */}
                        <div className="flex items-center bg-[#f4f7f4] border border-gray-200 rounded-xl px-3 py-2 cursor-pointer w-auto">
                            <ArrowUpDown size={14} className="text-[#062e3a] mr-2 shrink-0" />
                            <select
                                value={ordenLiquidacion}
                                onChange={(e) => setOrdenLiquidacion(e.target.value)}
                                className="bg-transparent text-[#062e3a] text-xs font-bold outline-none w-full cursor-pointer"
                            >
                                <option value="FECHA_DESC">Más recientes</option>
                                <option value="FECHA_ASC">Más antiguos</option>
                                <option value="COMISION_DESC">Mayor Comisión</option>
                                <option value="COMISION_ASC">Menor Comisión</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Listado Interactivo */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative">
                    {consultasFiltradas.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-[#f4f7f4] rounded-3xl border-2 border-dashed border-gray-200 m-2 p-6">
                            <CheckCircle2 size={48} className="text-gray-300 mb-4" />
                            <p className="font-bold text-[#342c1e]/60">No hay consultas pendientes de liquidar con estos filtros.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="sticky top-0 bg-white/90 backdrop-blur-sm pb-2 z-10">
                                <button
                                    onClick={() => seleccionarTodasLiquidacion(consultasFiltradas.map(c => c.id))}
                                    className="flex items-center gap-2 text-xs font-black text-[#367933] uppercase tracking-widest bg-[#b1cb0c]/10 px-4 py-2.5 rounded-xl hover:bg-[#b1cb0c]/20 transition-colors w-fit border border-[#b1cb0c]/30"
                                >
                                    {todosSeleccionados ? <CheckSquare size={16} /> : <Square size={16} />}
                                    {todosSeleccionados ? "Deseleccionar Todo" : "Seleccionar Todo"}
                                </button>
                            </div>

                            {consultasFiltradas.map(c => {
                                const isSelected = seleccionadasLiquidacion.includes(c.id);
                                const totalFila = ((c.nuevas || 0) * 25) + ((c.revisiones || 0) * 20);

                                return (
                                    <div
                                        key={c.id}
                                        onClick={() => toggleSeleccionLiquidacion(c.id)}
                                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? "border-[#b1cb0c] bg-[#b1cb0c]/5 shadow-sm" : "border-gray-100 hover:border-gray-300 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className={`shrink-0 transition-colors ${isSelected ? "text-[#367933]" : "text-gray-300"}`}>
                                                {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                                            </div>
                                            <div>
                                                <p className="font-black text-[#062e3a]">{c.nutricionistaNombre}</p>
                                                <p className="text-xs font-bold text-[#342c1e]/60 flex items-center gap-1 mt-0.5">
                                                    <Calendar size={12} /> {new Date(c.fecha).toLocaleDateString()} | 📍 {c.farmaciaNombre}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 mt-3 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end pl-10 sm:pl-0">
                                            <div className="flex gap-2 text-[11px] font-black tracking-widest uppercase">
                                                {/* Colores Corporativos: Verde claro para Nuevas, Azul oscuro/grisáceo para Revisiones */}
                                                {c.nuevas > 0 && <span className="bg-[#b1cb0c]/20 border border-[#b1cb0c]/50 text-[#367933] px-2 py-1 rounded-md">{c.nuevas} Nuevas</span>}
                                                {c.revisiones > 0 && <span className="bg-[#062e3a]/10 border border-[#062e3a]/20 text-[#062e3a] px-2 py-1 rounded-md">{c.revisiones} Revis.</span>}
                                            </div>
                                            <span className="font-black text-xl text-[#062e3a] min-w-[70px] text-right">
                                                {totalFila.toFixed(2)}€
                                            </span>
                                            {/* Botón Detalles */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que al hacer clic en el ojo, se marque el checkbox sin querer
                                                    abrirDetalleConsulta(c);
                                                }}
                                                className="ml-2 p-2 text-gray-400 hover:text-[#367933] hover:bg-[#b1cb0c]/20 rounded-lg transition-colors"
                                                title="Ver informe detallado"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* 🛒 PANEL DERECHO: El Ticket / Carrito */}
            {/* 👇 CAMBIO CLAVE 3: Ajustado a xl:w-[340px] para emparejarse con el flex padre */}
            <div className="w-full xl:w-[340px] shrink-0">
                <div className="bg-[#062e3a] rounded-[2.5rem] shadow-xl p-8 text-white sticky top-6 border border-[#342c1e]/30">
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                        <div className="bg-[#b1cb0c]/20 p-3 rounded-2xl">
                            <Receipt size={28} className="text-[#bed000]" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">Resumen</h3>
                            <p className="text-[#bed000] text-[10px] font-black uppercase tracking-widest">{seleccionadasLiquidacion.length} consultas marcadas</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-sm font-bold text-white/80">Nuevas (25€)</p>
                                <p className="text-xs text-[#bed000] font-black">{desglose.nuevas} unid.</p>
                            </div>
                            <p className="font-black text-xl">{desglose.totalNuevas.toFixed(2)}€</p>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-sm font-bold text-white/80">Revisiones (20€)</p>
                                <p className="text-xs text-[#bed000] font-black">{desglose.revisiones} unid.</p>
                            </div>
                            <p className="font-black text-xl">{desglose.totalRevisiones.toFixed(2)}€</p>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 mb-8 text-right">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Total a Pagar / Liquidar</p>
                        <p className="text-5xl font-black text-[#bed000] tracking-tight">
                            {desglose.totalEuros.toFixed(2)}€
                        </p>
                    </div>

                    <button
                        onClick={handleLiquidarLote}
                        disabled={seleccionadasLiquidacion.length === 0 || enviando}
                        className="w-full bg-[#367933] hover:bg-[#006633] disabled:bg-gray-600 disabled:text-gray-400 disabled:border-transparent text-white font-black py-4 rounded-2xl flex justify-center items-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-[#367933]/20 border border-[#b1cb0c]/30"
                    >
                        {enviando ? <Loader2 className="animate-spin" size={20} /> : <BadgeEuro size={22} />}
                        Confirmar Cierre
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PanelLiquidacion;