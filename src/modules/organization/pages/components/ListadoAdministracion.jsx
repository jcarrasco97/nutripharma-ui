import React, { useState } from "react";
import {
  Edit, Trash2, Store, PackagePlus, Users, RefreshCw, Archive, Mail,
  UserCheck, UserX,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Switch } from "@/shared/components/ui/Switch";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/Tabs";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";
import {
  Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription,
} from "@/shared/components/ui/Empty";
import { Skeleton } from "@/shared/components/ui/Skeleton";

const ListadoAdministracion = ({
  pestana,
  nutricionistas,
  nutricionistasBajas,
  farmacias,
  farmaciasBajas,
  productos,
  productosBajas,
  admins,
  adminsBajas,
  cargando,
  cargandoAdmins,
  abrirSheetEditar,
  handleEliminar,
  handleRestaurar,
  handleToggleStock,
  abrirModalAsignaciones,
}) => {
  const [vistaActivos, setVistaActivos] = useState("activos");

  const isActivos = vistaActivos === "activos";

  // Selección de datos según pestaña y vista
  const dataNutri = isActivos ? nutricionistas : nutricionistasBajas;
  const dataFarm = isActivos ? farmacias : farmaciasBajas;
  const dataProd = isActivos ? productos : productosBajas;
  const dataAdmins = isActivos ? admins : adminsBajas;

  const totalActivos = pestana === "nutricionistas"
    ? nutricionistas.length
    : pestana === "farmacias"
      ? farmacias.length
      : pestana === "productos"
        ? productos.length
        : admins.length;

  const totalBajas = pestana === "nutricionistas"
    ? nutricionistasBajas.length
    : pestana === "farmacias"
      ? farmaciasBajas.length
      : pestana === "productos"
        ? productosBajas.length
        : adminsBajas.length;

  if (cargando || cargandoAdmins) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const renderAccionesActivos = (item, tipo) => (
    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => abrirSheetEditar(item)}
        className="h-8 w-8 text-primary bg-primary/10 hover:bg-primary/20"
        title="Editar"
      >
        <Edit size={14} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleEliminar(item.id, tipo)}
        className="h-8 w-8 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700"
        title="Dar de baja"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );

  const renderAccionesBajas = (item, tipo) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleRestaurar(item.id, tipo)}
      className="h-8 w-8 text-primary bg-primary/10 hover:bg-primary/20 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
      title="Restaurar"
    >
      <RefreshCw size={14} />
    </Button>
  );

  const isEmpty = () => {
    if (pestana === "nutricionistas") return dataNutri.length === 0;
    if (pestana === "farmacias") return dataFarm.length === 0;
    if (pestana === "productos") return dataProd.length === 0;
    if (pestana === "personal") return dataAdmins.length === 0;
    return true;
  };

  return (
    <div className="space-y-3">
      {/* Toggle Activos / Bajas */}
      <div className="flex items-center justify-between">
        <Tabs value={vistaActivos} onValueChange={setVistaActivos}>
          <TabsList>
            <TabsTrigger value="activos" className="gap-1.5">
              <UserCheck size={14} />
              Activos
              <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black px-1.5 py-0 h-4">
                {totalActivos}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="bajas" className="gap-1.5">
              <Archive size={14} />
              Histórico
              {totalBajas > 0 && (
                <Badge className="bg-neutral/10 text-neutral/60 border-none text-[10px] font-black px-1.5 py-0 h-4">
                  {totalBajas}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lista */}
      <div className="border border-neutral/10 rounded-xl bg-surface overflow-hidden">
        {isEmpty() ? (
          <Empty className="py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                {isActivos ? <UserX size={24} /> : <Archive size={24} />}
              </EmptyMedia>
              <EmptyTitle>
                {isActivos ? "Sin registros activos" : "Sin historial de bajas"}
              </EmptyTitle>
              <EmptyDescription>
                {isActivos
                  ? "Usa el botón Crear para añadir el primer registro."
                  : "No hay registros dados de baja."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="max-h-[520px]">
            <div className="divide-y divide-neutral/5">

              {/* ── NUTRICIONISTAS ── */}
              {pestana === "nutricionistas" && dataNutri.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 flex justify-between items-center hover:bg-neutral/5 group transition-colors ${!isActivos ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActivos ? "bg-secondary text-surface" : "bg-neutral/20 text-neutral/60 grayscale"}`}>
                      {n.nombre.charAt(0)}{n.apellidos?.charAt(0) || ""}
                    </div>
                    <div>
                      <p className={`font-bold text-sm flex items-center gap-2 ${isActivos ? "text-secondary" : "text-neutral/50 line-through"}`}>
                        {n.nombre} {n.apellidos}
                        <Badge className="bg-secondary/10 text-secondary border-none text-[9px] font-black px-1.5">
                          {n.horasContratoMensual}h/mes
                        </Badge>
                      </p>
                      <p className="text-xs text-neutral/60 font-medium">{n.email} • {n.telefono}</p>
                      <button
                        onClick={() => isActivos && abrirModalAsignaciones(n, "nutricionista")}
                        className={`mt-1 text-[10px] font-black px-2 py-0.5 rounded-md uppercase transition-colors w-fit ${n.asignaciones?.length > 0 ? "bg-accent/20 text-primary hover:bg-accent/40 cursor-pointer" : "bg-red-50 text-red-400 cursor-default"}`}
                      >
                        {n.asignaciones?.length > 0 ? `${n.asignaciones.length} Farmacias` : "Sin asignaciones"}
                      </button>
                      {!isActivos && n.fechaBaja && (
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                          <Archive size={10} /> Baja el {new Date(n.fechaBaja).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {isActivos ? renderAccionesActivos(n, "nutricionista") : renderAccionesBajas(n, "nutricionista")}
                </div>
              ))}

              {/* ── FARMACIAS ── */}
              {pestana === "farmacias" && dataFarm.map((f) => {
                const nutrisCount = nutricionistas.filter((n) =>
                  n.asignaciones?.some((a) => a.farmaciaId === f.id)
                ).length;
                return (
                  <div
                    key={f.id}
                    className={`p-4 flex justify-between items-center hover:bg-neutral/5 group transition-colors ${!isActivos ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${isActivos ? "bg-accent/20 text-primary" : "bg-neutral/10 text-neutral/40 grayscale"}`}>
                        <Store size={20} />
                      </div>
                      <div>
                        <p className={`font-bold text-sm flex flex-wrap items-center gap-1.5 ${isActivos ? "text-secondary" : "text-neutral/50 line-through"}`}>
                          {f.nombre}
                          <Badge className={`text-[9px] px-1.5 border-none font-black ${f.esProvinciaLocal ? "bg-secondary/10 text-secondary" : "bg-neutral/10 text-neutral/60"}`}>
                            {f.esProvinciaLocal ? "Almería (PVF)" : "Externa (PVP)"}
                          </Badge>
                          <Badge className="bg-accent/20 text-primary border-none text-[9px] px-1.5 font-black">
                            {f.porcentajeComision}% comisión
                          </Badge>
                        </p>
                        <p className="text-xs text-neutral/60 font-medium">{f.direccion} • CIF: {f.cif}</p>
                        <button
                          onClick={() => isActivos && abrirModalAsignaciones(f, "farmacia")}
                          className={`mt-1 text-[10px] font-black px-2 py-0.5 rounded-md uppercase flex items-center w-fit gap-1 transition-colors ${nutrisCount > 0 ? "bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-pointer" : "bg-neutral/10 text-neutral/40 cursor-default"}`}
                        >
                          <Users size={10} /> {nutrisCount > 0 ? `${nutrisCount} Nutricionistas` : "Sin nutricionistas"}
                        </button>
                        {!isActivos && f.fechaBaja && (
                          <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                            <Archive size={10} /> Baja el {new Date(f.fechaBaja).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {isActivos ? renderAccionesActivos(f, "farmacia") : renderAccionesBajas(f, "farmacia")}
                  </div>
                );
              })}

              {/* ── PRODUCTOS ── */}
              {pestana === "productos" && dataProd.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 flex justify-between items-center hover:bg-neutral/5 group transition-colors ${(!isActivos || !p.hayExistencias) ? "opacity-70" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${p.hayExistencias && isActivos ? "bg-accent/20 text-primary" : "bg-neutral/10 text-neutral/40 grayscale"}`}>
                      <PackagePlus size={20} />
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${isActivos && p.hayExistencias ? "text-secondary" : "text-neutral/50 line-through decoration-neutral/30"}`}>
                        {p.nombreProducto}
                        <Badge className="ml-2 bg-neutral/10 text-neutral/60 border-none text-[9px] px-1.5 font-bold no-underline">
                          {p.referencia}
                        </Badge>
                      </p>
                      <p className="text-xs text-neutral/60 font-medium">PVF: {p.pvf}€ • PVP: {p.pvp}€</p>
                      {!isActivos && p.fechaBaja && (
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                          <Archive size={10} /> Baja el {new Date(p.fechaBaja).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isActivos && (
                      <Switch
                        checked={p.hayExistencias}
                        onCheckedChange={() => handleToggleStock(p.id)}
                        title={p.hayExistencias ? "Marcar sin stock" : "Marcar con stock"}
                      />
                    )}
                    {isActivos ? renderAccionesActivos(p, "producto") : renderAccionesBajas(p, "producto")}
                  </div>
                </div>
              ))}

              {/* ── PERSONAL (SuperAdmin) ── */}
              {pestana === "personal" && dataAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className={`p-4 flex justify-between items-center hover:bg-neutral/5 group transition-colors ${!isActivos ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActivos ? "bg-secondary text-surface" : "bg-neutral/20 text-neutral/50 grayscale"}`}>
                      {admin.nombre.charAt(0)}{admin.apellidos?.charAt(0) || ""}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${isActivos ? "text-secondary" : "text-neutral/50 line-through"}`}>
                        {admin.nombre} {admin.apellidos}
                      </p>
                      <p className="text-xs font-bold text-primary flex items-center gap-1">
                        <Mail size={11} /> {admin.email}
                      </p>
                      {!isActivos && admin.fechaBaja && (
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5">
                          <Archive size={10} /> Baja el {new Date(admin.fechaBaja).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {isActivos ? renderAccionesActivos(admin, "admin") : renderAccionesBajas(admin, "admin")}
                </div>
              ))}

            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ListadoAdministracion;
