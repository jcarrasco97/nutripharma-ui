import React, { useState, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Button } from "@/shared/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
// 👇 Integración de Shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";
import {
  MoreHorizontal,
  Eye,
} from "lucide-react";

const columnHelper = createColumnHelper();

const HistorialValidaciones = ({
  historial = [],
  pestañaActual,
  onVerDetalle,
}) => {
  // ── Solo conservamos el filtro por Mes, DataTable hace el resto ──
  const [filtroMesAno, setFiltroMesAno] = useState("INITIAL");

  // ── Helpers de extracción ──
  const getFecha = (item) =>
    pestañaActual === "suministros"
      ? item.fechaPeticion
      : item.fecha || item.fechaPedido;

  const getResponsable = (item) =>
    pestañaActual === "pedidos"
      ? item.creadoPorNombre || "Sistema"
      : item.nutricionistaNombre || "—";

  // ── Extracción inteligente de meses disponibles ──
  const opciones = useMemo(() => {
    const mesesUnicos = new Set();
    historial.forEach((item) => {
      const rawDate = getFecha(item);
      if (rawDate && typeof rawDate === "string") {
        const parts = rawDate.split("-");
        if (parts.length >= 2) mesesUnicos.add(`${parts[0]}-${parts[1]}`);
      }
    });
    return { meses: Array.from(mesesUnicos).sort((a, b) => b.localeCompare(a)) };
  }, [historial, pestañaActual]);

  const mesActivo =
    filtroMesAno === "INITIAL"
      ? opciones.meses.length > 0
        ? opciones.meses[0]
        : "ALL"
      : filtroMesAno;

  // ── Motor de filtrado (Eliminada la ordenación manual, DataTable se encarga) ──
  const filtrados = useMemo(() => {
    return historial.filter((item) => {
      let pasaFecha = true;
      if (mesActivo !== "ALL") {
        const rawDate = getFecha(item);
        pasaFecha = rawDate && typeof rawDate === "string" && rawDate.startsWith(mesActivo);
      }
      return pasaFecha;
    });
  }, [historial, mesActivo, pestañaActual]);

  const formatoMesCorto = (key) => {
    const [year, month] = key.split("-");
    const nombre = new Date(year, month - 1).toLocaleString("es-ES", { month: "short" });
    return `${nombre.charAt(0).toUpperCase() + nombre.slice(1).replace(".", "")} ${year}`;
  };

  const estadoBadge = (estado) => {
    const e = estado || "";
    let classes = "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap ";
    if (["LIQUIDADA", "LIQUIDADO"].includes(e)) classes += "bg-[#367933] text-white";
    else if (["VALIDADA", "ENVIADO", "APROBADO"].includes(e)) classes += "bg-[#b1cb0c]/20 text-[#367933]";
    else if (["CANCELADA", "CANCELADO", "RECHAZADA"].includes(e)) classes += "bg-red-100 text-red-700";
    else classes += "bg-amber-100 text-amber-700";
    return <span className={classes}>{e.replace("_", " ")}</span>;
  };

  const columns = useMemo(() => {
    const cols = [
      columnHelper.accessor(
        (row) => getFecha(row),
        {
          id: "fecha",
          header: "Fecha",
          enableSorting: true,
          cell: ({ getValue }) => {
            const raw = getValue();
            if (!raw) return <span className="text-neutral/40">—</span>;
            const formatted = pestañaActual === "suministros"
              ? new Date(raw).toLocaleDateString()
              : raw;
            return <span className="text-sm font-medium text-secondary whitespace-nowrap">{formatted}</span>;
          },
        }
      ),
      columnHelper.accessor(
        (row) => getResponsable(row),
        {
          id: "responsable",
          header: "Responsable",
          enableSorting: true,
          cell: ({ getValue }) => (
            <span className="text-sm font-bold text-secondary">{getValue()}</span>
          ),
        }
      ),
    ];

    if (pestañaActual !== "suministros") {
      cols.push(
        columnHelper.accessor("farmaciaNombre", {
          id: "destino",
          header: "Destino",
          enableSorting: true,
          cell: ({ row }) => (
            <span className="text-sm font-medium text-[#367933] whitespace-nowrap">
              📍 {row.original.farmaciaNombre}
            </span>
          ),
        })
      );
    }

    cols.push(
      columnHelper.accessor("estado", {
        id: "estado",
        header: "Estado",
        enableSorting: true,
        cell: ({ getValue }) => estadoBadge(getValue()),
      }),
      columnHelper.display({
        id: "acciones",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-md border-neutral/10 shadow-lg w-40">
                <DropdownMenuItem
                  onClick={() => onVerDetalle(row.original)}
                  className="rounded-md gap-2 text-sm font-medium cursor-pointer"
                >
                  <Eye size={14} /> Ver Informe
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      })
    );
    return cols;
  }, [pestañaActual, onVerDetalle]);

  // ── Toolbar nativa de Shadcn Select ──
  const toolbar = (
    <div className="w-[160px] shrink-0">
      <Select value={mesActivo} onValueChange={setFiltroMesAno}>
        <SelectTrigger className="h-10 bg-surface border-neutral/10 rounded-md text-secondary font-medium outline-none focus:ring-2 focus:ring-primary/30">
          <SelectValue placeholder="Todas las fechas" />
        </SelectTrigger>
        <SelectContent className="rounded-md border-neutral/10">
          <SelectItem value="ALL" className="font-medium">Todas las fechas</SelectItem>
          {opciones.meses.map((m) => (
            <SelectItem key={m} value={m} className="font-medium">
              {formatoMesCorto(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={filtrados}
      searchKey="responsable"
      searchPlaceholder="Buscar responsable..."
      pageSize={10}
      emptyText="No hay registros con estos filtros."
      toolbarStart={toolbar}
    />
  );
};

export default HistorialValidaciones;
