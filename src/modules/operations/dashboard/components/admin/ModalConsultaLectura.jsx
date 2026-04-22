import React from "react";
import { X, Clock, User, Store, ArrowRight, ShieldCheck, Camera, Stethoscope } from "lucide-react";

const ModalConsultaLectura = ({ consulta, onCerrar, onIrAGestionar }) => {
    if (!consulta) return null;

    const totalGenerado = (consulta.nuevas || 0) * 25 + (consulta.revisiones || 0) * 20;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#062e3a]/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">

                {/* CABECERA */}
                <div className="bg-[#062e3a] p-6 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#b1cb0c]/20 p-2 rounded-xl">
                            <ShieldCheck className="text-[#b1cb0c]" size={20} />
                        </div>
                        <h3 className="text-xl font-black italic tracking-tight">Resumen de Jornada</h3>
                    </div>
                    <button onClick={onCerrar} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">

                    {/* 1. NUTRICIONISTA Y FARMACIA */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#f4f7f4] p-4 rounded-2xl border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Nutricionista</p>
                            <p className="font-bold text-[#062e3a] leading-tight">{consulta.nutricionistaNombre}</p>
                        </div>
                        <div className="bg-[#f4f7f4] p-4 rounded-2xl border border-gray-100">
                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Farmacia</p>
                            <p className="font-bold text-[#062e3a] leading-tight">{consulta.farmaciaNombre}</p>
                        </div>
                    </div>

                    {/* 2. BLOQUE DE CONSULTAS (Como antes) */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: "Nuevas", val: consulta.nuevas, color: "text-[#367933]" },
                            { label: "Revisiones", val: consulta.revisiones, color: "text-[#367933]" },
                            { label: "Promociones", val: consulta.promociones, color: "text-amber-600" },
                            { label: "Personal", val: consulta.personalFarmacia, color: "text-blue-600" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-[10px] text-gray-400 uppercase font-black mb-1">{item.label}</p>
                                <p className={`text-xl font-black ${item.color}`}>{item.val || 0}</p>
                            </div>
                        ))}
                    </div>

                    {/* 3. TOTAL GENERADO */}
                    <div className="bg-gradient-to-r from-[#062e3a] to-[#342c1e] p-5 rounded-2xl flex justify-between items-center shadow-lg border border-[#b1cb0c]/20">
                        <div>
                            <p className="text-[10px] font-black text-[#bed000] uppercase tracking-widest">Ingresos Estimados</p>
                            <p className="text-xs text-white/60 font-bold">Basado en nuevas y rev.</p>
                        </div>
                        <p className="text-3xl font-black text-white">{totalGenerado} €</p>
                    </div>

                    {/* 4. EVIDENCIA */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200 flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${consulta.evidenciaUrl ? 'bg-[#367933]/10' : 'bg-gray-200'}`}>
                            <Camera size={20} className={consulta.evidenciaUrl ? "text-[#367933]" : "text-gray-400"} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#062e3a]">
                                {consulta.evidenciaUrl ? "Certificación adjunta" : "Sin evidencia"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium leading-none">
                                {consulta.evidenciaUrl ? "Disponible para revisión en gestión" : "La nutricionista no subió foto"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 5. BOTÓN GESTIONAR (FOOTER) */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
                    <button
                        onClick={() => onIrAGestionar(consulta)}
                        className="w-full py-4 bg-[#367933] text-white font-black rounded-2xl hover:bg-[#006633] flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#367933]/20 active:scale-[0.98]"
                    >
                        IR A GESTIONAR VALIDACIÓN <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConsultaLectura;