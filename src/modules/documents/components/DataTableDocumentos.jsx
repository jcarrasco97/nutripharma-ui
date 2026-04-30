import React, { useState, useMemo } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/Select";
import { Download, Loader2, MoreHorizontal, Trash2 } from "lucide-react";

const obtenerLabelAlcance = (row, isAdmin) => {
  switch (row.alcance) {
    case "GLOBAL_TODOS":
      return "Para todos";
    case "GLOBAL_NUTRICIONISTAS":
      return "Solo nutricionistas";
    case "GLOBAL_FARMACIAS":
      return "Solo farmacias";
    case "INDIVIDUAL":
      return isAdmin ? `Para: ${row.propietarioEmail}` : "Personal";
    default:
      return row.alcance;
  }
};

const columnHelper = createColumnHelper();

const DataTableDocumentos = ({
  documentos,
  isAdmin,
  handleBorrar,
  handleDescargar,
  borrandoId,
  descargandoId,
  cargando,
  toolbarStart,
  toolbarEnd,
}) => {
  const [filtroMes, setFiltroMes] = useState("TODOS");

  const mesesDisponibles = useMemo(() => {
    if (!documentos) return [];
    const setMeses = new Set();
    documentos.forEach((d) => {
      if (d.fechaSubida) {
        const fecha = new Date(d.fechaSubida);
        const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
        setMeses.add(key);
      }
    });
    return Array.from(setMeses).sort().reverse();
  }, [documentos]);

  const formatearMes = (yyyyMM) => {
    const [year, month] = yyyyMM.split("-");
    const date = new Date(year, parseInt(month) - 1, 1);
    const nombreMes = date.toLocaleDateString("es-ES", { month: "long" });
    return `${nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} ${year}`;
  };

  const documentosFiltrados = useMemo(() => {
    if (filtroMes === "TODOS") return documentos;
    return documentos.filter((d) => {
      const fecha = new Date(d.fechaSubida);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
      return key === filtroMes;
    });
  }, [documentos, filtroMes]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("nombreOriginal", {
        header: "Documento",
        enableSorting: true,
        cell: ({ getValue }) => (
          <p
            className="font-bold text-secondary text-sm truncate min-w-[250px] max-w-[400px]"
            title={getValue()}
          >
            {getValue()}
          </p>
        ),
      }),
      columnHelper.accessor("alcance", {
        header: "Destinatario",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-sm font-medium text-secondary whitespace-nowrap">
            {obtenerLabelAlcance(row.original, isAdmin)}
          </span>
        ),
      }),
      columnHelper.accessor((row) => row.subidoPor || "admin@nutripharma.com", {
        id: "subidoPor",
        header: "Subido por",
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-secondary whitespace-nowrap">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("fechaSubida", {
        header: "Fecha",
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-neutral/60 whitespace-nowrap">
            {new Date(getValue()).toLocaleDateString("es-ES")}
          </span>
        ),
      }),
      columnHelper.display({
        id: "acciones",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl h-8 w-8"
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-xl shadow-lg border-neutral/10"
                >
                  <DropdownMenuItem
                    onClick={() => handleDescargar(doc.id, doc.nombreOriginal)}
                    className="rounded-lg"
                  >
                    {descargandoId === doc.id ? (
                      <Loader2 size={14} className="animate-spin mr-2" />
                    ) : (
                      <Download size={14} className="mr-2" />
                    )}
                    Descargar
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() => handleBorrar(doc.id)}
                      className="rounded-lg text-red-500 focus:text-red-500 focus:bg-red-50 mt-1"
                    >
                      {borrandoId === doc.id ? (
                        <Loader2 size={14} className="animate-spin mr-2" />
                      ) : (
                        <Trash2 size={14} className="mr-2" />
                      )}
                      Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      }),
    ],
    [isAdmin, borrandoId, descargandoId, handleBorrar, handleDescargar],
  );

  if (cargando) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    );
  }

  // ── Toolbar extra: Selector de Mes Dinámico ──
  const filtroToolbar = (
    <div className="w-full md:w-auto">
      <Select value={filtroMes} onValueChange={setFiltroMes}>
        <SelectTrigger className="w-full md:w-auto min-w-[160px] h-10 border-neutral/10 bg-surface text-secondary text-sm font-medium rounded-xl shadow-sm">
          <SelectValue placeholder="Mes de subida" />
        </SelectTrigger>
        <SelectContent className="rounded-xl shadow-lg border-neutral/10">
          <SelectItem value="TODOS" className="font-medium text-secondary">
            Todos los meses
          </SelectItem>
          {mesesDisponibles.map((m) => (
            <SelectItem
              key={m}
              value={m}
              className="font-medium text-secondary"
            >
              {formatearMes(m)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={documentosFiltrados}
      searchKey="nombreOriginal"
      searchPlaceholder="Buscar documento..."
      pageSize={5}
      emptyText="No se han encontrado documentos."
      toolbarStart={toolbarStart}
      toolbarExtra={filtroToolbar}
      toolbarEnd={toolbarEnd}
    />
  );
};

export default DataTableDocumentos;
