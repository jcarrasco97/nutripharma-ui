import React, { useState, useEffect, useRef } from "react";
import { Users, Store, Loader2, PackagePlus, Search, ChevronDown, ListOrdered, ChevronUp, X, GripVertical } from "lucide-react";

// 1. Importamos el Hook Orquestador (Ruta relativa directa)
import { useAdministracion } from "./hooks/useAdministracion";

// 2. Importamos los Componentes desde el "Refugio Seguro" (Ruta relativa directa)
import FormularioAdministracion from "./components/FormularioAdministracion";
import ModalEdicionAdministracion from "./components/ModalEdicionAdministracion";
import ListadoAdministracion from "./components/ListadoAdministracion";
import ArchivoAdministracion from "./components/ArchivoAdministracion";
import ModalVerAsignaciones from "./components/ModalVerAsignaciones";
const ModalOrganizarRecomendados = ({ abierto, onClose, productos }) => {
  const [lista, setLista] = useState([]);
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    if (abierto) {
      const saved = JSON.parse(localStorage.getItem("orden_recomendados_nutripharma") || "[]");
      const activos = productos.filter(p => !p.fechaBaja);

      const ordenados = [...activos].sort((a, b) => {
        const idxA = saved.indexOf(a.id);
        const idxB = saved.indexOf(b.id);
        if (idxA === -1 && idxB === -1) return (a.nombreProducto || "").localeCompare(b.nombreProducto || "");
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
      });
      setLista(ordenados);
    }
  }, [abierto, productos]);

  if (!abierto) return null;

  const mover = (index, dir) => {
    if (index + dir < 0 || index + dir >= lista.length) return;
    const nueva = [...lista];
    const temp = nueva[index];
    nueva[index] = nueva[index + dir];
    nueva[index + dir] = temp;
    setLista(nueva);
  };

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDrop = () => {
    const copia = [...lista];
    const item = copia[dragItem.current];
    copia.splice(dragItem.current, 1);
    copia.splice(dragOverItem.current, 0, item);
    dragItem.current = null;
    dragOverItem.current = null;
    setLista(copia);
  };

  const guardar = () => {
    const ids = lista.map(p => p.id);
    localStorage.setItem("orden_recomendados_nutripharma", JSON.stringify(ids));
    alert("Orden de recomendados guardado.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in text-left">
      <div className="bg-[#062e3a] p-6 md:p-8 rounded-[2.5rem] text-white w-full max-w-xl shadow-2xl relative max-h-[85vh] flex flex-col">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#b1cb0c]/20 p-2 rounded-xl text-[#bed000]">
            <ListOrdered size={24} />
          </div>
          <h2 className="text-2xl font-black">Organizar Recomendados</h2>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Utiliza las flechas para subir o bajar los productos de la lista. Las modificaciones surtirán efecto en la pestaña de Pedidos al guardar.
        </p>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar p-2 bg-white/5 rounded-2xl border border-white/10">
          {lista.map((prod, i) => (
            <div
              key={prod.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, i)}
              onDragEnter={(e) => handleDragEnter(e, i)}
              onDragEnd={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex items-center justify-between bg-[#062e3a]/50 p-4 rounded-xl border border-white/10 hover:border-[#b1cb0c]/50 transition-colors cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center">
                <GripVertical size={20} className="text-gray-400 mr-2" />
                <span className="font-bold text-sm text-[#bed000]">
                  {i + 1}. <span className="text-white">{prod.nombreProducto}</span>
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => mover(i, -1)} disabled={i === 0} className="p-2 bg-white/10 rounded-lg text-white hover:bg-[#b1cb0c] hover:text-[#062e3a] transition-all disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white cursor-pointer disabled:cursor-not-allowed">
                  <ChevronUp size={18} />
                </button>
                <button onClick={() => mover(i, 1)} disabled={i === lista.length - 1} className="p-2 bg-white/10 rounded-lg text-white hover:bg-[#b1cb0c] hover:text-[#062e3a] transition-all disabled:opacity-30 disabled:hover:bg-white/10 disabled:hover:text-white cursor-pointer disabled:cursor-not-allowed">
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={guardar} className="mt-6 font-bold py-4 rounded-xl flex justify-center items-center shadow-lg transition-all active:scale-[0.98] w-full bg-[#367933] hover:bg-[#006633] text-white shadow-[#367933]/20">
          Guardar Posiciones
        </button>
      </div>
    </div>
  );
};

const AdministracionPage = () => {
  const hook = useAdministracion();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [ordenAlfabetico, setOrdenAlfabetico] = useState("asc");
  const [modalRecomendados, setModalRecomendados] = useState(false);

  if (hook.cargando && hook.nutricionistas.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#367933]" size={48} />
      </div>
    );
  }

  const term = terminoBusqueda.toLowerCase();

  const matchesNutri = (n) =>
    !term ||
    n.nombre?.toLowerCase().includes(term) ||
    n.apellidos?.toLowerCase().includes(term) ||
    n.email?.toLowerCase().includes(term);

  const matchesFarm = (f) =>
    !term ||
    f.nombre?.toLowerCase().includes(term) ||
    f.email?.toLowerCase().includes(term) ||
    f.cif?.toLowerCase().includes(term);

  const matchesProd = (p) =>
    !term ||
    p.nombreProducto?.toLowerCase().includes(term) ||
    p.acronimo?.toLowerCase().includes(term) ||
    p.referencia?.toLowerCase().includes(term);

  const sortNutriFarm = (a, b) => {
    const cmp = (a.nombre || "").localeCompare(b.nombre || "");
    return ordenAlfabetico === "asc" ? cmp : -cmp;
  };

  const sortProd = (a, b) => {
    const cmp = (a.nombreProducto || "").localeCompare(b.nombreProducto || "");
    return ordenAlfabetico === "asc" ? cmp : -cmp;
  };

  const hookFiltrado = {
    ...hook,
    nutricionistas: hook.nutricionistas.filter(matchesNutri).sort(sortNutriFarm),
    nutricionistasBajas: hook.nutricionistasBajas.filter(matchesNutri).sort(sortNutriFarm),
    farmacias: hook.farmacias.filter(matchesFarm).sort(sortNutriFarm),
    farmaciasBajas: hook.farmaciasBajas.filter(matchesFarm).sort(sortNutriFarm),
    productos: hook.productos.filter(matchesProd).sort(sortProd),
    productosBajas: hook.productosBajas.filter(matchesProd).sort(sortProd),
  };


  return (
    <div className="space-y-8 animate-fade-in pb-10 relative">
      <ModalOrganizarRecomendados abierto={modalRecomendados} onClose={() => setModalRecomendados(false)} productos={hook.productos} />
      <ModalEdicionAdministracion {...hook} />
      <ModalVerAsignaciones
        modalAsignaciones={hook.modalAsignaciones}
        cerrarModalAsignaciones={hook.cerrarModalAsignaciones}
        nutricionistas={hook.nutricionistas}
      />

      <div className="flex gap-4 border-b border-gray-200 pb-4 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => hook.setPestana("nutricionistas")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${hook.pestana === "nutricionistas" ? "bg-[#367933] text-white shadow-md" : "bg-gray-50 text-[#342c1e]/70 hover:bg-gray-100 hover:text-[#062e3a]"}`}
        >
          <Users size={20} /> Plantilla Nutricionistas
        </button>
        <button
          onClick={() => hook.setPestana("farmacias")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${hook.pestana === "farmacias" ? "bg-[#367933] text-white shadow-md" : "bg-gray-50 text-[#342c1e]/70 hover:bg-gray-100 hover:text-[#062e3a]"}`}
        >
          <Store size={20} /> Red de Farmacias
        </button>
        <button
          onClick={() => hook.setPestana("productos")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${hook.pestana === "productos" ? "bg-[#367933] text-white shadow-md" : "bg-gray-50 text-[#342c1e]/70 hover:bg-gray-100 hover:text-[#062e3a]"}`}
        >
          <PackagePlus size={20} /> Catálogo Productos
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-3.5 text-[#367933]" />
          <input
            type="text"
            placeholder={`Buscar ${hook.pestana === "productos" ? "productos" : hook.pestana === "farmacias" ? "farmacias" : "nutricionistas"}...`}
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-[#062e3a] font-bold focus:ring-2 focus:ring-[#367933] outline-none shadow-sm transition-all hover:border-[#367933]/50"
          />
        </div>
        {hook.pestana === "productos" && (
          <button
            onClick={() => setModalRecomendados(true)}
            className="w-full md:w-auto px-6 bg-[#062e3a] text-white hover:bg-[#041d25] font-bold rounded-2xl py-3 flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
          >
            <ListOrdered size={18} /> <span className="whitespace-nowrap">Organizar Recomendados</span>
          </button>
        )}
        <div className="relative w-full md:w-48">
          <select
            value={ordenAlfabetico}
            onChange={(e) => setOrdenAlfabetico(e.target.value)}
            // 1. Añadimos appearance-none para ocultar la flecha nativa
            // 2. Cambiamos px-4 por pl-4 y pr-10 para dejar hueco a nuestro icono
            className="w-full appearance-none bg-white border border-gray-200 rounded-2xl pl-4 pr-10 py-3 text-sm text-[#062e3a] font-bold focus:ring-2 focus:ring-[#367933] outline-none shadow-sm transition-all hover:border-[#367933]/50 cursor-pointer"
          >
            <option value="asc">Nombre (A - Z)</option>
            <option value="desc">Nombre (Z - A)</option>
          </select>
          {/* 3. Nuestro icono personalizado, con right-4 para que tenga un respiro perfecto */}
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <ListadoAdministracion {...hookFiltrado} />
          <ArchivoAdministracion {...hookFiltrado} />
        </div>

        <FormularioAdministracion {...hook} />
      </div>
    </div>
  );
};

export default AdministracionPage;
