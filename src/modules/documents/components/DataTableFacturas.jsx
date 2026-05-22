import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
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
import { facturasService } from "../services/facturasService";
import { obtenerUltimos6Meses } from "@/shared/utils/mesesHelper";
import { toast } from "sonner";

const columnHelper = createColumnHelper();

const DataTableFacturas = ({ esAdmin, forceUpdate, toolbarEnd }) => {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [borrandoId, setBorrandoId] = useState(null);
  const [filtroMes, setFiltroMes] = useState("TODOS");

  const meses = obtenerUltimos6Meses();

  const cargarListado = useCallback(async () => {
    setCargando(true);
    try {
      const data = esAdmin
        ? await facturasService.obtenerTodas()
        : await facturasService.obtenerMisFacturas();
      setFacturas(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setFacturas([]);
    } finally {
      setCargando(false);
    }
  }, [esAdmin]);

  useEffect(() => {
    cargarListado();
  }, [cargarListado, forceUpdate]);

  const handleBorrarFactura = async (id) => {
    const confirmado = window.confirm(
      "¿Estás seguro de que deseas eliminar esta factura permanentemente?",
    );
    if (!confirmado) return;
    setBorrandoId(id);
    try {
      await facturasService.eliminarFactura(id);
      setFacturas((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Error al intentar borrar la factura.");
    } finally {
      setBorrandoId(null);
    }
  };

  const facturasFiltradas = useMemo(
    () =>
      filtroMes === "TODOS"
        ? facturas
        : facturas.filter((f) => f.mesCorresponde === filtroMes),
    [facturas, filtroMes],
  );

  const columns = useMemo(() => {
    const cols = [
      columnHelper.accessor("nombreArchivo", {
        header: "Facturas",
        enableSorting: true,
        cell: ({ getValue }) => (
          <p
            className="font-bold text-secondary text-sm truncate max-w-[200px]"
            title={getValue()}
          >
            {getValue()}
          </p>
        ),
      }),
    ];

    if (esAdmin) {
      cols.push(
        columnHelper.accessor(
          (row) =>
            row.nutricionista
              ? `${row.nutricionista.nombre} ${row.nutricionista.apellidos}`
              : "—",
          {
            id: "nutricionista",
            header: "Nutricionista",
            enableSorting: true,
            cell: ({ getValue }) => (
              <span className="text-sm font-medium text-secondary whitespace-nowrap">
                {getValue()}
              </span>
            ),
          },
        ),
      );
    }

    cols.push(
      columnHelper.accessor("mesCorresponde", {
        header: "Mes",
        enableSorting: true,
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-secondary whitespace-nowrap">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("fechaSubida", {
        header: "FechaSubida",
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
        enableHiding: false,
        cell: ({ row }) => {
          const factura = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-md h-8 w-8"
                >
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="rounded-md border-neutral/10"
              >
                <DropdownMenuItem
                  onClick={() =>
                    facturasService.descargarFactura(
                      factura.id,
                      factura.nombreArchivo,
                    )
                  }
                  className="rounded-md"
                >
                  <Download size={14} className="mr-2" /> Descargar
                </DropdownMenuItem>
                {esAdmin && (
                  <DropdownMenuItem
                    onClick={() => handleBorrarFactura(factura.id)}
                    className="rounded-md text-red-500 focus:text-red-500 focus:bg-red-50 mt-1"
                  >
                    {borrandoId === factura.id ? (
                      <Loader2 size={14} className="animate-spin mr-2" />
                    ) : (
                      <Trash2 size={14} className="mr-2" />
                    )}{" "}
                    Eliminar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    );
    return cols;
  }, [esAdmin, borrandoId]);

  if (cargando) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-md" />
        <Skeleton className="h-14 w-full rounded-md" />
        <Skeleton className="h-14 w-full rounded-md" />
      </div>
    );
  }

  // ── Toolbar estandarizada a h-10 ──
  const filtroToolbar = (
    <div className="w-full md:w-auto">
      <Select value={filtroMes} onValueChange={setFiltroMes}>
        <SelectTrigger className="w-full md:w-auto min-w-[160px] h-10 border-neutral/10 bg-surface text-secondary text-sm font-medium rounded-md">
          <SelectValue placeholder="Mes de subida" />
        </SelectTrigger>
        <SelectContent className="rounded-md border-neutral/10">
          <SelectItem value="TODOS" className="font-medium text-secondary">
            Todos los meses
          </SelectItem>
          {meses.map((m) => (
            <SelectItem
              key={m}
              value={m}
              className="font-medium text-secondary"
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={facturasFiltradas}
      searchKey="nombreArchivo"
      searchPlaceholder="Buscar archivo..."
      pageSize={5}
      emptyText="No se han encontrado facturas."
      toolbarExtra={filtroToolbar}
      toolbarEnd={toolbarEnd}
    />
  );
};

export default DataTableFacturas;
