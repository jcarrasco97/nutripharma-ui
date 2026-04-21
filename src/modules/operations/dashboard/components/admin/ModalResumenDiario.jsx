import React from 'react';
import { X, Calendar, ClipboardList, ShoppingBag, ArrowRight, Clock, User } from 'lucide-react';

const ModalResumenDiario = ({ isOpen, onClose, fecha, eventos, onVerDetalleConsulta, onVerDetallePedido }) => {
    if (!isOpen) return null;

    const { consultas = [], pedidos = [] } = eventos;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">

                {/* CABECERA */}
                <div className="bg-[#062e3a] p-6 text-white relative">
                    <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-[#bed000]" size={20} />
                        <h2 className="text-xl font-black">Resumen Operativo</h2>
                    </div>
                    <p className="text-gray-300 font-bold uppercase tracking-wider text-sm">
                        {new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                {/* CONTENIDO SCROLLABLE */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                    {/* SECCIÓN CONSULTAS */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                            <ClipboardList size={18} className="text-[#367933]" />
                            <h3 className="font-black text-[#062e3a] uppercase text-xs tracking-widest">Consultas del Día ({consultas.length})</h3>
                        </div>
                        <div className="space-y-3">
                            {consultas.length > 0 ? consultas.map((c, idx) => (
                                <div key={c.idUnico || idx} className="group bg-[#f4f7f4] p-4 rounded-2xl flex items-center justify-between hover:bg-[#367933]/5 transition-all border border-transparent hover:border-[#367933]/20">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-xl shadow-sm text-[#367933]">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#062e3a] text-sm">{c.titulo}</p>
                                            <p className="text-xs text-gray-500 font-bold">{c.detalles}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onVerDetalleConsulta(c)}
                                        className="p-2 bg-white rounded-xl text-[#367933] hover:bg-[#367933] hover:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-black"
                                    >
                                        DETALLES <ArrowRight size={14} />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-gray-400 text-sm font-medium italic italic">No hay consultas programadas.</p>
                            )}
                        </div>
                    </div>

                    {/* SECCIÓN PEDIDOS */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                            <ShoppingBag size={18} className="text-[#b1cb0c]" />
                            <h3 className="font-black text-[#062e3a] uppercase text-xs tracking-widest">Pedidos Realizados ({pedidos.length})</h3>
                        </div>
                        <div className="space-y-3">
                            {pedidos.length > 0 ? pedidos.map((p, idx) => (
                                <div key={p.idUnico || idx} className="group bg-gray-50 p-4 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-xl shadow-sm text-[#b1cb0c]">
                                            <ShoppingBag size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#062e3a] text-sm">{p.idUnico}</p>
                                            <p className="text-xs text-gray-500 font-bold">{p.titulo} • {p.detalles}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onVerDetallePedido(p)}
                                        className="p-2 bg-white rounded-xl text-[#062e3a] hover:bg-[#062e3a] hover:text-white transition-all shadow-sm flex items-center gap-2 text-xs font-black"
                                    >
                                        VER PEDIDO <ArrowRight size={14} />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-gray-400 text-sm font-medium italic">No se realizaron pedidos este día.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-8 py-3 bg-[#062e3a] text-white font-black rounded-xl hover:bg-[#041d25] transition-all shadow-lg shadow-[#062e3a]/20">
                        Cerrar Vista
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalResumenDiario;