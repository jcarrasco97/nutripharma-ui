import React, { useState } from "react";
import { Shield, ListOrdered, UserCheck, Archive, Plus, Loader2 } from "lucide-react";
import { useAdministracion } from "../hooks/useAdministracion";
import SheetAdministracionForm from "../components/SheetAdministracionForm";
import ModalVerAsignaciones from "../components/ModalVerAsignaciones";
import SheetOrganizarPorDefecto from "../components/SheetOrganizarPorDefecto";
import DataTableNutricionistas from "../components/DataTableNutricionistas";
import DataTableFarmacias from "../components/DataTableFarmacias";
import DataTableProductos from "../components/DataTableProductos";
import DataTablePersonal from "../components/DataTablePersonal";

import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/Tabs";

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
    <TabsList className="h-10 p-1 bg-surface border border-neutral/10 flex w-full md:w-max">
      <TabsTrigger
        value="activos"
        className="flex-1 md:flex-none px-4 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-neutral/50 hover:text-secondary"
      >
        <UserCheck size={15} /> Activos
        <Badge className="border-none text-[10px] font-black px-1.5 py-0 h-4 bg-primary/10 text-primary transition-colors">
          {totalActivos}
        </Badge>
      </TabsTrigger>
      <TabsTrigger
        value="bajas"
        className="flex-1 md:flex-none px-4 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-neutral/50 hover:text-secondary"
      >
        <Archive size={15} /> Histórico
        {totalBajas > 0 && (
          <Badge className="border-none text-[10px] font-black px-1.5 py-0 h-4 bg-neutral/10 text-neutral/60 transition-colors">
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

  // ── Solo los filtros para el toolbarStart ──
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
    <>
      {/* 1. Modales y Sheets FUERA del flujo principal para evitar márgenes fantasma */}
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
      <SheetOrganizarPorDefecto
        abierto={modalRecomendados}
        onClose={() => setModalRecomendados(false)}
        productos={hook.productos}
      />

      {/* 2. Contenedor visual con margen superior negativo (-mt-2 o -mt-4) para acercarlo al header */}
      <div className="space-y-2 animate-fade-in pb-10 -mt-2 md:-mt-4">

        {/* ── Navegación Principal (Estilo Vercel/Notion Underline Minimalista) ── */}
        <div className="flex gap-2">
          {pestanasVisible.map((tab) => {
            const isActive = hook.pestana === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handlePestana(tab.id)}
                className={`pb-2 text-[14px] font-medium transition-colors whitespace-nowrap border-b-2 px-1 outline-none ${isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral/50 hover:text-secondary hover:border-neutral/30"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
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
      </div>
    </>
  );
};

export default AdministracionPage;