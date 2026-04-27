import React, { useState, useEffect, useRef } from "react";
import {
  Users, Store, PackagePlus, Shield, Search, ListOrdered,
  ChevronDown, ChevronUp, GripVertical, Plus, Loader2, X,
} from "lucide-react";

import { useAdministracion } from "./hooks/useAdministracion";
import SheetAdministracionForm from "./components/SheetAdministracionForm";
import ListadoAdministracion from "./components/ListadoAdministracion";
import ModalVerAsignaciones from "./components/ModalVerAsignaciones";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/shared/components/ui/Sheet";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";

// ── Modal Organizar Recomendados (migrado a semántico) ──
const ModalOrganizarRecomendados = ({ abierto, onClose, productos }) => {
  const [lista, setLista] = useState([]);
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    if (abierto) {
      const saved = JSON.parse(localStorage.getItem("orden_recomendados_nutripharma") || "[]");
      const activos = productos.filter((p) => !p.fechaBaja);
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

  const mover = (index, dir) => {
    if (index + dir < 0 || index + dir >= lista.length) return;
    const nueva = [...lista];
    const temp = nueva[index];
    nueva[index] = nueva[index + dir];
    nueva[index + dir] = temp;
    setLista(nueva);
  };

  const handleDragStart = (e, position) => { dragItem.current = position; };
  const handleDragEnter = (e, position) => { dragOverItem.current = position; };
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
    localStorage.setItem("orden_recomendados_nutripharma", JSON.stringify(lista.map((p) => p.id)));
    alert("Orden de recomendados guardado.");
    onClose();
  };

  return (
    <Sheet open={abierto} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-md flex flex-col p-0">
        <SheetHeader className="bg-secondary text-surface px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-surface/20 p-2 rounded-xl">
                <ListOrdered size={18} className="text-surface" />
              </div>
              <SheetTitle className="text-surface">Organizar Recomendados</SheetTitle>
            </div>
            <button onClick={onClose} className="text-surface/70 hover:text-surface transition-colors">
              <X size={20} />
            </button>
          </div>
          <p className="text-surface/70 text-xs mt-2">
            Arrastra o usa las flechas para reordenar los productos recomendados.
          </p>
        </SheetHeader>
        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-2">
            {lista.map((prod, i) => (
              <div
                key={prod.id}
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragEnter={(e) => handleDragEnter(e, i)}
                onDragEnd={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center justify-between bg-neutral/5 border border-neutral/10 p-3 rounded-xl hover:border-primary/30 transition-colors cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={18} className="text-neutral/40" />
                  <span className="font-bold text-sm text-primary">{i + 1}.</span>
                  <span className="font-semibold text-sm text-secondary">{prod.nombreProducto}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => mover(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 bg-neutral/10 rounded-lg text-neutral hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => mover(i, 1)}
                    disabled={i === lista.length - 1}
                    className="p-1.5 bg-neutral/10 rounded-lg text-neutral hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="px-6 pb-6 pt-4 border-t border-neutral/10">
          <Button onClick={guardar} className="w-full bg-primary hover:bg-primary-hover text-surface font-bold">
            Guardar Posiciones
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// ── Etiquetas de pestañas ──
const PESTANAS = [
  { id: "nutricionistas", label: "Nutricionistas", icon: <Users size={16} /> },
  { id: "farmacias", label: "Red de Farmacias", icon: <Store size={16} /> },
  { id: "productos", label: "Catálogo Productos", icon: <PackagePlus size={16} /> },
];

const NOMBRES_PESTANA = {
  nutricionistas: "Nutricionista",
  farmacias: "Farmacia",
  productos: "Producto",
  personal: "Administrador",
};

// ── PÁGINA ORQUESTADORA ──
const AdministracionPage = () => {
  const hook = useAdministracion();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [ordenAlfabetico, setOrdenAlfabetico] = useState("asc");
  const [modalRecomendados, setModalRecomendados] = useState(false);

  if (hook.cargando && hook.nutricionistas.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
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

  const matchesAdmin = (a) =>
    !term ||
    a.nombre?.toLowerCase().includes(term) ||
    a.apellidos?.toLowerCase().includes(term) ||
    a.email?.toLowerCase().includes(term);

  const sortNF = (a, b) => {
    const cmp = (a.nombre || "").localeCompare(b.nombre || "");
    return ordenAlfabetico === "asc" ? cmp : -cmp;
  };

  const sortP = (a, b) => {
    const cmp = (a.nombreProducto || "").localeCompare(b.nombreProducto || "");
    return ordenAlfabetico === "asc" ? cmp : -cmp;
  };

  const hookFiltrado = {
    ...hook,
    nutricionistas: hook.nutricionistas.filter(matchesNutri).sort(sortNF),
    nutricionistasBajas: hook.nutricionistasBajas.filter(matchesNutri).sort(sortNF),
    farmacias: hook.farmacias.filter(matchesFarm).sort(sortNF),
    farmaciasBajas: hook.farmaciasBajas.filter(matchesFarm).sort(sortNF),
    productos: hook.productos.filter(matchesProd).sort(sortP),
    productosBajas: hook.productosBajas.filter(matchesProd).sort(sortP),
    admins: (hook.admins || []).filter(matchesAdmin).sort(sortNF),
    adminsBajas: (hook.adminsBajas || []).filter(matchesAdmin).sort(sortNF),
  };

  const pestanasVisible = hook.isSuperAdmin
    ? [...PESTANAS, { id: "personal", label: "Personal (SuperAdmin)", icon: <Shield size={16} /> }]
    : PESTANAS;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Sheets */}
      <SheetAdministracionForm
        open={hook.sheetAbierto}
        onOpenChange={(v) => { if (!v) hook.cerrarSheet(); }}
        pestana={hook.pestana}
        itemEditando={hook.itemEditando}
        setItemEditando={hook.setItemEditando}
        formData={hook.formData}
        setFormData={hook.setFormData}
        farmacias={hook.farmacias}
        enviando={hook.enviando}
        handleChange={hook.handleChange}
        handleCrear={hook.handleCrear}
        handleActualizar={hook.handleActualizar}
        handleToggleFarmacia={hook.handleToggleFarmacia}
        handleCambiarKilometros={hook.handleCambiarKilometros}
        formDataAdmin={hook.formDataAdmin}
        handleChangeAdmin={hook.handleChangeAdmin}
        handleCrearAdmin={hook.handleCrearAdmin}
        enviandoAdmin={hook.enviandoAdmin}
      />

      <ModalVerAsignaciones
        modalAsignaciones={hook.modalAsignaciones}
        cerrarModalAsignaciones={hook.cerrarModalAsignaciones}
        nutricionistas={hook.nutricionistas}
      />

      <ModalOrganizarRecomendados
        abierto={modalRecomendados}
        onClose={() => setModalRecomendados(false)}
        productos={hook.productos}
      />

      {/* ── Pestañas superiores ── */}
      <div className="flex gap-2 border-b border-neutral/10 pb-4 overflow-x-auto">
        {pestanasVisible.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => { hook.setPestana(tab.id); setTerminoBusqueda(""); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${hook.pestana === tab.id
              ? "bg-primary text-surface border-primary shadow-sm shadow-primary/20"
              : "bg-surface text-neutral/70 border-neutral/10 hover:bg-neutral/5 hover:text-secondary hover:border-neutral/20"}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Header: Buscador + Acciones ── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
          <input
            type="text"
            placeholder={`Buscar ${hook.pestana === "productos" ? "productos" : hook.pestana === "farmacias" ? "farmacias" : hook.pestana === "personal" ? "administradores" : "nutricionistas"}...`}
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="w-full bg-surface border border-neutral/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-secondary font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          />
        </div>

        {hook.pestana === "productos" && (
          <Button
            variant="outline"
            onClick={() => setModalRecomendados(true)}
            className="flex items-center gap-2 border-neutral/10 text-secondary hover:bg-neutral/5"
          >
            <ListOrdered size={16} /> Organizar Recomendados
          </Button>
        )}

        <div className="relative w-full md:w-44">
          <Select value={ordenAlfabetico} onValueChange={setOrdenAlfabetico}>
            <SelectTrigger className="w-full border-neutral/10 bg-surface text-secondary text-sm font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Nombre (A → Z)</SelectItem>
              <SelectItem value="desc">Nombre (Z → A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          id="btn-crear-principal"
          onClick={hook.abrirSheetCrear}
          className="bg-primary hover:bg-primary-hover text-surface font-bold gap-2 whitespace-nowrap"
        >
          <Plus size={16} /> Crear {NOMBRES_PESTANA[hook.pestana]}
        </Button>
      </div>

      {/* ── Listado (100% ancho) ── */}
      <ListadoAdministracion
        {...hookFiltrado}
        cargando={hook.cargando}
        cargandoAdmins={hook.cargandoAdmins}
        abrirSheetEditar={hook.abrirSheetEditar}
        abrirModalAsignaciones={hook.abrirModalAsignaciones}
      />
    </div>
  );
};

export default AdministracionPage;
