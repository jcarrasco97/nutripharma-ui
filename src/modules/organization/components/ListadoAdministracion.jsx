import React, { useState, useEffect } from "react";
import {
  Edit, Trash2, Store, PackagePlus, Users, RefreshCw, Archive, Mail,
  UserX, ChevronLeft, ChevronRight
} from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Switch } from "@/shared/components/ui/Switch";
import {
  Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription,
} from "@/shared/components/ui/Empty";
import { Skeleton } from "@/shared/components/ui/Skeleton";

const ITEMS_POR_PAGINA = 5;

const ListadoAdministracion = ({
  pestana,
  isActivos, // <-- Viene del padre (AdministracionPage)
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
  const [pagina, setPagina] = useState(1);

  // Selección de datos (Todos los items)
  const dataNutri = isActivos ? nutricionistas : nutricionistasBajas;
  const dataFarm = isActivos ? farmacias : farmaciasBajas;
  const dataProd = isActivos ? productos : productosBajas;
  const dataAdmins = isActivos ? admins : adminsBajas;

  let datosActivos = [];
  if (pestana === "nutricionistas") datosActivos = dataNutri;
  else if (pestana === "farmacias") datosActivos = dataFarm;
  else if (pestana === "productos") datosActivos = dataProd;
  else if (pestana === "personal") datosActivos = dataAdmins;

  // Reseteamos a la página 1 si cambiamos de vista o buscamos
  useEffect(() => {
    setPagina(1);
  }, [pestana, isActivos, nutricionistas, farmacias, productos, admins]);

  // Cálculos de Paginación
  const totalPaginas = Math.ceil(datosActivos.length / ITEMS_POR_PAGINA);
  const itemsPagina = datosActivos.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  if (cargando || cargandoAdmins) {
    return (
      <div className="space-y-3 p-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const renderAccionesActivos = (item, tipo) => (
    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon" onClick={() => abrirSheetEditar(item)} className="h-8 w-8 text-primary bg-primary/10 hover:bg-primary/20"><Edit size={14} /></Button>
      <Button variant="ghost" size="icon" onClick={() => handleEliminar(item.id, tipo)} className="h-8 w-8 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700"><Trash2 size={14} /></Button>
    </div>
  );

  const renderAccionesBajas = (item, tipo) => (
    <Button variant="ghost" size="icon" onClick={() => handleRestaurar(item.id, tipo)} className="h-8 w-8 text-primary bg-primary/10 hover:bg-primary/20 opacity-100 md:opacity-0 group-hover:opacity-100"><RefreshCw size={14} /></Button>
  );

  if (datosActivos.length === 0) {
    return (
      <Empty className="py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">{isActivos ? <UserX size={24} /> : <Archive size={24} />}</EmptyMedia>
          <EmptyTitle>{isActivos ? "Sin registros activos" : "Sin historial de bajas"}</EmptyTitle>
          <EmptyDescription>{isActivos ? "Usa el botón Crear para añadir un registro." : "No hay registros dados de baja."}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="divide-y divide-neutral/10 flex-1">
        {/* ── NUTRICIONISTAS ── */}
        {pestana === "nutricionistas" && itemsPagina.map((n) => (
          <div key={n.id} className={`p-4 flex justify-between items-center hover:bg-neutral/5 group transition-colors ${!isActivos ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActivos ? "bg-secondary text-surface" : "bg-neutral/20 text-neutral/60 grayscale"}`}>
                {n.nombre.charAt(0)}{n.apellidos?.charAt(0) || ""}
              </div>
              <div>
                <p className={`font-bold text-sm flex items-center gap-2 ${isActivos ? "text-secondary" : "text-neutral/50 line-through"}`}>
                  {n.nombre} {n.apellidos}
                  <Badge className="bg-secondary/10 text-secondary border-none text-[9px] font-black px-1.5">{n.horasContratoMensual}h/mes</Badge>
                </p>
                <p className="text-xs text-neutral/60 font-medium">{n.email} • {n.telefono}</p>
                <button onClick={() => isActivos && abrirModalAsignaciones(n, "nutricionista")} className={`mt-1 text-[10px] font-black px-2 py-0.5 rounded-md uppercase transition-colors w-fit ${n.asignaciones?.length > 0 ? "bg-accent/20 text-primary hover:bg-accent/40 cursor-pointer" : "bg-red-50 text-red-400 cursor-default"}`}>
                  {n.asignaciones?.length > 0 ? `${n.asignaciones.length} Farmacias` : "Sin asignaciones"}
                </button>
                {!isActivos && n.fechaBaja && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5"><Archive size={10} /> Baja el {new Date(n.fechaBaja).toLocaleDateString()}</p>}
              </div>
            </div>
            {isActivos ? renderAccionesActivos(n, "nutricionista") : renderAccionesBajas(n, "nutricionista")}
          </div>
        ))}

        {/* ── FARMACIAS ── */}
        {pestana === "farmacias" && itemsPagina.map((f) => {
          const nutrisCount = nutricionistas.filter((n) => n.asignaciones?.some((a) => a.farmaciaId === f.id)).length;
          return (
            <div key={f.id} className={`p-4 flex justify-between items-center hover:bg-neutral/5 group transition-colors ${!isActivos ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${isActivos ? "bg-accent/20 text-primary" : "bg-neutral/10 text-neutral/40 grayscale"}`}><Store size={20} /></div>
                <div>
                  <p className={`font-bold text-sm flex flex-wrap items-center gap-1.5 ${isActivos ? "text-secondary" : "text-neutral/50 line-through"}`}>
                    {f.nombre}
                    <Badge className={`text-[9px] px-1.5 border-none font-black ${f.esProvinciaLocal ? "bg-secondary/10 text-secondary" : "bg-neutral/10 text-neutral/60"}`}>{f.esProvinciaLocal ? "Almería (PVF)" : "Externa (PVP)"}</Badge>
                    <Badge className="bg-accent/20 text-primary border-none text-[9px] px-1.5 font-black">{f.porcentajeComision}% comisión</Badge>
                  </p>
                  <p className="text-xs text-neutral/60 font-medium">{f.direccion} • CIF: {f.cif}</p>
                  <button onClick={() => isActivos && abrirModalAsignaciones(f, "farmacia")} className={`mt-1 text-[10px] font-black px-2 py-0.5 rounded-md uppercase flex items-center w-fit gap-1 transition-colors ${nutrisCount > 0 ? "bg-secondary/10 text-secondary hover:bg-secondary/20 cursor-pointer" : "bg-neutral/10 text-neutral/40 cursor-default"}`}>
                    <Users size={10} /> {nutrisCount > 0 ? `${nutrisCount} Nutricionistas` : "Sin nutricionistas"}
                  </button>
                  {!isActivos && f.fechaBaja && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5"><Archive size={10} /> Baja el {new Date(f.fechaBaja).toLocaleDateString()}</p>}
                </div>
              </div>
              {isActivos ? renderAccionesActivos(f, "farmacia") : renderAccionesBajas(f, "farmacia")}
            </div>
          );
        })}

        {/* ── PRODUCTOS ── */}
        {pestana === "productos" && itemsPagina.map((p) => (
          <div key={p.id} className={`p-4 flex justify-between items-center hover:bg-neutral/5 group transition-colors ${(!isActivos || !p.hayExistencias) ? "opacity-70" : ""}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${p.hayExistencias && isActivos ? "bg-accent/20 text-primary" : "bg-neutral/10 text-neutral/40 grayscale"}`}><PackagePlus size={20} /></div>
              <div>
                <p className={`font-bold text-sm ${isActivos && p.hayExistencias ? "text-secondary" : "text-neutral/50 line-through decoration-neutral/30"}`}>
                  {p.nombreProducto} <Badge className="ml-2 bg-neutral/10 text-neutral/60 border-none text-[9px] px-1.5 font-bold no-underline">{p.referencia}</Badge>
                </p>
                <p className="text-xs text-neutral/60 font-medium">PVF: {p.pvf}€ • PVP: {p.pvp}€</p>
                {!isActivos && p.fechaBaja && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5"><Archive size={10} /> Baja el {new Date(p.fechaBaja).toLocaleDateString()}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isActivos && <Switch checked={p.hayExistencias} onCheckedChange={() => handleToggleStock(p.id)} title={p.hayExistencias ? "Marcar sin stock" : "Marcar con stock"} />}
              {isActivos ? renderAccionesActivos(p, "producto") : renderAccionesBajas(p, "producto")}
            </div>
          </div>
        ))}

        {/* ── PERSONAL ── */}
        {pestana === "personal" && itemsPagina.map((admin) => (
          <div key={admin.id} className={`p-4 flex justify-between items-center hover:bg-neutral/5 group transition-colors ${!isActivos ? "opacity-60" : ""}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isActivos ? "bg-secondary text-surface" : "bg-neutral/20 text-neutral/50 grayscale"}`}>
                {admin.nombre.charAt(0)}{admin.apellidos?.charAt(0) || ""}
              </div>
              <div>
                <p className={`font-bold text-sm ${isActivos ? "text-secondary" : "text-neutral/50 line-through"}`}>{admin.nombre} {admin.apellidos}</p>
                <p className="text-xs font-bold text-primary flex items-center gap-1"><Mail size={11} /> {admin.email}</p>
                {!isActivos && admin.fechaBaja && <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-0.5"><Archive size={10} /> Baja el {new Date(admin.fechaBaja).toLocaleDateString()}</p>}
              </div>
            </div>
            {isActivos ? renderAccionesActivos(admin, "admin") : renderAccionesBajas(admin, "admin")}
          </div>
        ))}
      </div>

      {/* CONTROLES PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-neutral/10 bg-neutral/5/50 mt-auto">
          <span className="text-xs text-neutral/50 font-medium">
            Mostrando {(pagina - 1) * ITEMS_POR_PAGINA + 1}–{Math.min(pagina * ITEMS_POR_PAGINA, datosActivos.length)} de {datosActivos.length}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} className="rounded-lg h-7 w-7 bg-surface shadow-sm border border-neutral/10"><ChevronLeft size={14} /></Button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <Button key={n} variant={n === pagina ? "outline" : "ghost"} size="icon" onClick={() => setPagina(n)} className={`rounded-lg h-7 w-7 text-xs font-bold shadow-sm ${n === pagina ? "bg-surface border-neutral/20 text-primary" : ""}`}>{n}</Button>
            ))}
            <Button variant="ghost" size="icon" onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="rounded-lg h-7 w-7 bg-surface shadow-sm border border-neutral/10"><ChevronRight size={14} /></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListadoAdministracion;