import React, { useState, useEffect, useRef } from "react";
import {
  Users, Store, PackagePlus, Shield, Search, ListOrdered,
  ChevronDown, ChevronUp, GripVertical, Plus, Loader2, X,
  UserCheck, Archive
} from "lucide-react";

import { useAdministracion } from "../hooks/useAdministracion";
import SheetAdministracionForm from "../components/SheetAdministracionForm";
import ModalVerAsignaciones from "../components/ModalVerAsignaciones";
import ListadoAdministracion from "../components/ListadoAdministracion";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input"; // <-- IMPORTACIÓN SHADCN INPUT
import { Badge } from "@/shared/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/shared/components/ui/Sheet";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/Tabs";

// ── Modal Organizar Recomendados ──
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
                  <button onClick={() => mover(i, -1)} disabled={i === 0} className="p-1.5 bg-neutral/10 rounded-lg text-neutral hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"><ChevronUp size={16} /></button>
                  <button onClick={() => mover(i, 1)} disabled={i === lista.length - 1} className="p-1.5 bg-neutral/10 rounded-lg text-neutral hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"><ChevronDown size={16} /></button>
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
  { id: "farmacias", label: "Farmacias", icon: <Store size={16} /> },
  { id: "productos", label: "Productos", icon: <PackagePlus size={16} /> },
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
  const [vistaActivos, setVistaActivos] = useState("activos");

  if (hook.cargando && hook.nutricionistas.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const term = terminoBusqueda.toLowerCase();

  const matchesNutri = (n) => !term || n.nombre?.toLowerCase().includes(term) || n.apellidos?.toLowerCase().includes(term) || n.email?.toLowerCase().includes(term);
  const matchesFarm = (f) => !term || f.nombre?.toLowerCase().includes(term) || f.email?.toLowerCase().includes(term) || f.cif?.toLowerCase().includes(term);
  const matchesProd = (p) => !term || p.nombreProducto?.toLowerCase().includes(term) || p.acronimo?.toLowerCase().includes(term) || p.referencia?.toLowerCase().includes(term);
  const matchesAdmin = (a) => !term || a.nombre?.toLowerCase().includes(term) || a.apellidos?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term);

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

  const totalActivos = hook.pestana === "nutricionistas" ? hookFiltrado.nutricionistas.length :
    hook.pestana === "farmacias" ? hookFiltrado.farmacias.length :
      hook.pestana === "productos" ? hookFiltrado.productos.length :
        hookFiltrado.admins.length;

  const totalBajas = hook.pestana === "nutricionistas" ? hookFiltrado.nutricionistasBajas.length :
    hook.pestana === "farmacias" ? hookFiltrado.farmaciasBajas.length :
      hook.pestana === "productos" ? hookFiltrado.productosBajas.length :
        hookFiltrado.adminsBajas.length;

  const pestanasVisible = hook.isSuperAdmin ? [...PESTANAS, { id: "personal", label: "Personal", icon: <Shield size={16} /> }] : PESTANAS;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
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

      <ModalVerAsignaciones modalAsignaciones={hook.modalAsignaciones} cerrarModalAsignaciones={hook.cerrarModalAsignaciones} nutricionistas={hook.nutricionistas} />
      <ModalOrganizarRecomendados abierto={modalRecomendados} onClose={() => setModalRecomendados(false)} productos={hook.productos} />

      {/* ── Pestañas principales de navegación (DOMINIO) ── */}
      <div className="border-b border-neutral/10 pb-4">
        <Tabs value={hook.pestana} onValueChange={(val) => { hook.setPestana(val); setTerminoBusqueda(""); setVistaActivos("activos"); }} className="w-full overflow-x-auto custom-scrollbar pb-1">
          <TabsList className="h-11 p-1 bg-neutral/5 border border-neutral/10 rounded-xl w-max flex">
            {pestanasVisible.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2 px-5 text-sm font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-surface data-[state=active]:shadow-sm">
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── CONTENEDOR UNIFICADO TIPO REPOSITORIO (Card) ── */}
      <Card className="overflow-hidden shadow-sm border-neutral/10">
        <CardContent className="p-0">

          {/* ── BARRA DE HERRAMIENTAS (Totalmente estandarizada a h-11) ── */}
          <div className="p-4 border-b border-neutral/10 grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-row gap-3 items-center bg-neutral/5/30">

            {/* 1. Tabs Activos / Histórico */}
            <Tabs value={vistaActivos} onValueChange={setVistaActivos} className="w-full xl:w-auto">
              <TabsList className="h-11 p-1 bg-neutral/5 border border-neutral/10 rounded-xl w-full xl:w-max flex shadow-sm">
                <TabsTrigger value="activos" className="group flex-1 xl:flex-none gap-2 px-4 text-sm font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-surface data-[state=active]:shadow-sm">
                  <UserCheck size={16} /> Activos <Badge className="border-none text-[10px] font-black px-1.5 py-0 h-4 bg-primary/10 text-primary group-data-[state=active]:bg-surface/20 group-data-[state=active]:text-surface transition-colors">{totalActivos}</Badge>
                </TabsTrigger>
                <TabsTrigger value="bajas" className="group flex-1 xl:flex-none gap-2 px-4 text-sm font-bold rounded-lg transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-surface data-[state=active]:shadow-sm">
                  <Archive size={16} /> Histórico {totalBajas > 0 && <Badge className="border-none text-[10px] font-black px-1.5 py-0 h-4 bg-neutral/10 text-neutral/60 group-data-[state=active]:bg-surface/20 group-data-[state=active]:text-surface transition-colors">{totalBajas}</Badge>}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 2. Buscador (Estandarizado a h-11) */}
            <div className="relative w-full xl:flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary z-10 pointer-events-none" />
              <Input
                type="text"
                placeholder={`Buscar ${NOMBRES_PESTANA[hook.pestana].toLowerCase()}...`}
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="w-full h-11 pl-10 bg-surface border-neutral/10 rounded-xl text-sm text-secondary font-medium shadow-sm focus-visible:ring-primary/30 transition-all"
              />
            </div>

            {/* 3. Selector de Orden (Estandarizado con !h-11) */}
            <div className="w-full xl:w-auto">
              <Select value={ordenAlfabetico} onValueChange={setOrdenAlfabetico}>
                <SelectTrigger className="w-full xl:w-auto min-w-[160px] !h-11 border-neutral/10 bg-surface text-secondary text-sm font-medium rounded-xl shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Nombre (A → Z)</SelectItem>
                  <SelectItem value="desc">Nombre (Z → A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Botón Organizar (Estandarizado a h-11) */}
            {hook.pestana === "productos" && (
              <Button variant="outline" onClick={() => setModalRecomendados(true)} className="w-full xl:w-auto h-11 flex items-center justify-center gap-2 border-neutral/10 text-secondary bg-surface hover:bg-neutral/5 whitespace-nowrap rounded-xl shadow-sm px-4">
                <ListOrdered size={16} /> Organizar
              </Button>
            )}

            {/* 5. Botón Crear (Estandarizado a h-11) */}
            <Button id="btn-crear-principal" onClick={hook.abrirSheetCrear} className="w-full xl:w-auto h-11 bg-primary hover:bg-primary-hover text-surface font-bold gap-2 whitespace-nowrap rounded-xl shadow-sm px-5 flex items-center justify-center transition-all active:scale-[0.98]">
              <Plus size={16} /> Crear {NOMBRES_PESTANA[hook.pestana]}
            </Button>

          </div>

          {/* ── Listado Paginado ── */}
          <ListadoAdministracion
            {...hookFiltrado}
            isActivos={vistaActivos === "activos"}
            cargando={hook.cargando}
            cargandoAdmins={hook.cargandoAdmins}
            abrirSheetEditar={hook.abrirSheetEditar}
            abrirModalAsignaciones={hook.abrirModalAsignaciones}
          />

        </CardContent>
      </Card>
    </div>
  );
};

export default AdministracionPage;