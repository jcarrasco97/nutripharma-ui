import React, { useState, useEffect, useRef } from "react";
import {
  Shield, ChevronDown, ChevronUp, GripVertical, Plus, Loader2, X,
  ListOrdered, UserCheck, Archive,
} from "lucide-react";

import { useAdministracion } from "../hooks/useAdministracion";
import SheetAdministracionForm from "../components/SheetAdministracionForm";
import ModalVerAsignaciones from "../components/ModalVerAsignaciones";
import DataTableNutricionistas from "../components/DataTableNutricionistas";
import DataTableFarmacias from "../components/DataTableFarmacias";
import DataTableProductos from "../components/DataTableProductos";
import DataTablePersonal from "../components/DataTablePersonal";

import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/Sheet";
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
              <div className="bg-surface/20 p-2 rounded-md">
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
                className="flex items-center justify-between bg-neutral/5 border border-neutral/10 p-3 rounded-md hover:border-primary/30 transition-colors cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={18} className="text-neutral/40" />
                  <span className="font-bold text-sm text-primary">{i + 1}.</span>
                  <span className="font-semibold text-sm text-secondary">{prod.nombreProducto}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => mover(i, -1)} disabled={i === 0} className="p-1.5 bg-neutral/10 rounded-md text-neutral hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"><ChevronUp size={16} /></button>
                  <button onClick={() => mover(i, 1)} disabled={i === lista.length - 1} className="p-1.5 bg-neutral/10 rounded-md text-neutral hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"><ChevronDown size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="px-6 pb-6 pt-4 border-t border-neutral/10">
          <Button onClick={guardar} className="w-full bg-primary hover:bg-primary-hover text-surface font-bold rounded-md h-10">
            Guardar Posiciones
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// ── Etiquetas de pestañas ──
const PESTANAS = [
  { id: "nutricionistas", label: "Nutricionistas" },
  { id: "farmacias", label: "Farmacias" },
  { id: "productos", label: "Productos" },
];

const NOMBRES_PESTANA = {
  nutricionistas: "Nutricionista",
  farmacias: "Farmacia",
  productos: "Producto",
  personal: "Administrador",
};

// ── Tabs Activos / Histórico (toolbar reutilizable) ──
const TabsActivoHistorico = ({ value, onValueChange, totalActivos, totalBajas }) => (
  <Tabs value={value} onValueChange={onValueChange} className="w-full md:w-auto">
    <TabsList className="h-10 p-1 bg-surface border border-neutral/10 rounded-md w-full md:w-max flex">
      <TabsTrigger
        value="activos"
        className="group flex-1 md:flex-none gap-2 px-4 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-neutral/50 hover:text-secondary"
      >
        <UserCheck size={15} /> Activos
        <Badge className="border-none text-[10px] font-black px-1.5 py-0 h-4 bg-primary/10 text-primary group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary transition-colors">
          {totalActivos}
        </Badge>
      </TabsTrigger>
      <TabsTrigger
        value="bajas"
        className="group flex-1 md:flex-none gap-2 px-4 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-neutral/50 hover:text-secondary"
      >
        <Archive size={15} /> Histórico
        {totalBajas > 0 && (
          <Badge className="border-none text-[10px] font-black px-1.5 py-0 h-4 bg-neutral/10 text-neutral/60 group-data-[state=active]:bg-primary/20 group-data-[state=active]:text-primary transition-colors">
            {totalBajas}
          </Badge>
        )}
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

// ── PÁGINA ORQUESTADORA ──
const AdministracionPage = () => {
  const hook = useAdministracion();
  const [vistaActivos, setVistaActivos] = useState("activos");
  const [modalRecomendados, setModalRecomendados] = useState(false);

  const isActivos = vistaActivos === "activos";

  // Reset vista al cambiar pestaña
  const handlePestana = (val) => {
    hook.setPestana(val);
    setVistaActivos("activos");
  };

  if (hook.cargando && hook.nutricionistas.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // Datos filtrados por vista activos/bajas
  const nutricionistasData = isActivos ? hook.nutricionistas : hook.nutricionistasBajas;
  const farmaciasData = isActivos ? hook.farmacias : hook.farmaciasBajas;
  const productosData = isActivos ? hook.productos : hook.productosBajas;
  const personalData = isActivos ? (hook.admins ?? []) : (hook.adminsBajas ?? []);

  // Totales para los tabs
  const totalActivos =
    hook.pestana === "nutricionistas" ? hook.nutricionistas.length :
      hook.pestana === "farmacias" ? hook.farmacias.length :
        hook.pestana === "productos" ? hook.productos.length :
          (hook.admins ?? []).length;

  const totalBajas =
    hook.pestana === "nutricionistas" ? hook.nutricionistasBajas.length :
      hook.pestana === "farmacias" ? hook.farmaciasBajas.length :
        hook.pestana === "productos" ? hook.productosBajas.length :
          (hook.adminsBajas ?? []).length;

  const pestanasVisible = hook.isSuperAdmin
    ? [...PESTANAS, { id: "personal", label: "Personal", icon: <Shield size={16} /> }]
    : PESTANAS;

  // ── Props del toolbar reutilizables ──
  const tabsToolbar = (
    <TabsActivoHistorico
      value={vistaActivos}
      onValueChange={setVistaActivos}
      totalActivos={totalActivos}
      totalBajas={totalBajas}
    />
  );

  const btnCrear = (
    <Button
      id="btn-crear-principal"
      onClick={hook.abrirSheetCrear}
      className="h-10 bg-primary hover:bg-primary-hover text-surface font-bold gap-2 whitespace-nowrap rounded-md px-5 flex items-center transition-all active:scale-[0.98]"
    >
      <Plus size={16} /> Crear {NOMBRES_PESTANA[hook.pestana]}
    </Button>
  );

  const btnOrganizar = (
    <Button
      variant="outline"
      onClick={() => setModalRecomendados(true)}
      className="h-10 border-neutral/10 text-secondary bg-surface hover:bg-neutral/5 whitespace-nowrap rounded-md px-4 flex items-center gap-2"
    >
      <ListOrdered size={16} /> Organizar
    </Button>
  );

  // toolbarEnd agrupa botones según pestaña
  const toolbarEnd =
    hook.pestana === "productos" ? (
      <div className="flex items-center gap-2">
        {btnOrganizar}
        {btnCrear}
      </div>
    ) : btnCrear;

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

      {/* ── Pestañas principales de navegación (DOMINIO) ── */}
      <div className="border-b border-neutral/10 pb-3 mb-6">
        <Tabs value={hook.pestana} onValueChange={handlePestana} className="w-full overflow-x-auto custom-scrollbar">
          <TabsList className="h-auto w-full flex justify-start gap-1 bg-transparent p-0 border-none">
            {pestanasVisible.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-neutral/60 hover:text-secondary data-[state=active]:bg-neutral/10 data-[state=active]:text-secondary data-[state=active]:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ── DataTable por entidad ── */}

      {hook.pestana === "nutricionistas" && (
        <DataTableNutricionistas
          data={nutricionistasData}
          cargando={hook.cargando}
          isActivos={isActivos}
          abrirSheetEditar={hook.abrirSheetEditar}
          abrirModalAsignaciones={hook.abrirModalAsignaciones}
          handleEliminar={hook.handleEliminar}
          handleRestaurar={hook.handleRestaurar}
          toolbarStart={tabsToolbar}
          toolbarEnd={toolbarEnd}
        />
      )}

      {hook.pestana === "farmacias" && (
        <DataTableFarmacias
          data={farmaciasData}
          nutricionistas={hook.nutricionistas}
          cargando={hook.cargando}
          isActivos={isActivos}
          abrirSheetEditar={hook.abrirSheetEditar}
          abrirModalAsignaciones={hook.abrirModalAsignaciones}
          handleEliminar={hook.handleEliminar}
          handleRestaurar={hook.handleRestaurar}
          toolbarStart={tabsToolbar}
          toolbarEnd={toolbarEnd}
        />
      )}

      {hook.pestana === "productos" && (
        <DataTableProductos
          data={productosData}
          cargando={hook.cargando}
          isActivos={isActivos}
          abrirSheetEditar={hook.abrirSheetEditar}
          handleEliminar={hook.handleEliminar}
          handleRestaurar={hook.handleRestaurar}
          handleToggleStock={hook.handleToggleStock}
          toolbarStart={tabsToolbar}
          toolbarEnd={toolbarEnd}
        />
      )}

      {hook.pestana === "personal" && (
        <DataTablePersonal
          data={personalData}
          cargando={hook.cargandoAdmins}
          isActivos={isActivos}
          abrirSheetEditar={hook.abrirSheetEditar}
          handleEliminar={hook.handleEliminar}
          handleRestaurar={hook.handleRestaurar}
          toolbarStart={tabsToolbar}
          toolbarEnd={toolbarEnd}
        />
      )}
    </div >
  );
};

export default AdministracionPage;