"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Settings2,
  Search,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Table";
import { Button } from "./Button";
import { Input } from "./Input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

export function DataTable({
  columns,
  data,
  searchKey = "nombre",
  searchPlaceholder = "Filtrar resultados...",
  pageSize = 5,
  toolbarStart,
  toolbarExtra,
  emptyText = "No se encontraron resultados.",
  toolbarEnd,
  enableRowSelection = false,
  showColumnsToggle = true,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState(() =>
    columns.reduce((acc, col) => {
      if (col.meta?.defaultHidden) acc[col.id] = false;
      return acc;
    }, {})
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: { pageSize: pageSize },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // ── Lógica compartida para renderizar el Selector de Filas ──
  const selectorFilas = (
    <div className="flex items-center gap-2">
      <p className="text-xs font-medium text-neutral/50">Filas por página</p>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        {/* 👇 AQUÍ EL FIX: Añadimos size="sm" y quitamos el h-8 del className que no hacía nada */}
        <SelectTrigger size="sm" className="w-[70px] bg-surface border-neutral/10 rounded-md focus:ring-primary/30 text-secondary font-bold">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent
          side="top"
          className="rounded-md border-neutral/10"
        >
          {[5, 10, 20, 30, 40, 50].map((size) => (
            <SelectItem
              key={size}
              value={`${size}`}
              className="font-medium text-secondary"
            >
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="w-full space-y-1">
      {/* ── BARRA DE HERRAMIENTAS (Toolbar) ── */}
      <div className="flex flex-col md:flex-row items-center gap-3 py-4">

        {/* 1. Acción inicial */}
        {toolbarStart}

        {/* 2. Buscador */}
        {searchKey && (
          <div className="relative w-full md:flex-1 group">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral/50 group-focus-within:text-primary transition-colors z-10 pointer-events-none"
            />
            <Input
              placeholder={searchPlaceholder}
              value={table.getColumn(searchKey)?.getFilterValue() || ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="w-full pl-10 bg-surface border-neutral/10 focus-visible:border-primary focus-visible:ring-primary/30 text-secondary rounded-md h-10"
            />
          </div>
        )}

        {/* 3. Filtros Extras */}
        {toolbarExtra}

        {/* 4. Selector de Columnas */}
        {showColumnsToggle && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto shrink-0 border-neutral/10 text-secondary bg-surface rounded-md h-10 font-medium"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[180px] rounded-md border-neutral/10"
          >
            <DropdownMenuLabel className="text-xs font-bold text-neutral/50 uppercase tracking-wider">
              Alternar Columnas
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral/10" />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide(),
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize font-medium text-sm text-secondary focus:bg-primary/10 focus:text-primary"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        )}

        {/* 5. Acción final */}
        {toolbarEnd}
      </div>

      {/* ── CUERPO DE LA TABLA ── */}
      <Table>
        <TableHeader className="bg-surface">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent !border-b !border-neutral/10"            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-4">
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <Button
                        variant="ghost"
                        onClick={() =>
                          header.column.toggleSorting(
                            header.column.getIsSorted() === "asc",
                          )
                        }
                        // 👇 CAMBIO: text-secondary -> text-neutral/50
                        className="h-8 px-2 -ml-2 hover:bg-neutral/10 font-bold text-neutral/50 text-xs uppercase tracking-wider transition-colors"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === "desc" ? (
                          <ArrowUpDown className="ml-2 h-3 w-3 text-primary" />
                        ) : header.column.getIsSorted() === "asc" ? (
                          <ArrowUpDown className="ml-2 h-3 w-3 text-primary rotate-180" />
                        ) : (
                          <ArrowUpDown className="ml-2 h-3 w-3 text-neutral/50" />
                        )}
                      </Button>
                    ) : (
                      // 👇 CAMBIO: text-secondary -> text-neutral/50
                      <span className="font-bold text-neutral/50 text-xs uppercase tracking-wider px-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                // 👇 3. Magia absoluta: Al dejar solo "bg-surface", respetamos el border-b 
                // nativo de 1px del componente Table.jsx, el hover gris y el fondo blanco.
                className="bg-surface"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 px-4">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-neutral/60 font-medium"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ── PAGINACIÓN AVANZADA ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 py-4">
        {/* LADO IZQUIERDO: Depende del interruptor "enableRowSelection" */}
        <div className="flex-1 flex items-center justify-center md:justify-start">
          {enableRowSelection ? (
            <span className="text-sm text-neutral/60 font-medium">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
            </span>
          ) : (
            selectorFilas
          )}
        </div>

        {/* LADO DERECHO: Controles de paginación */}
        <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8">
          {/* Si enableRowSelection está encendido, el selector se mueve aquí a la derecha */}
          {enableRowSelection && selectorFilas}

          {/* Indicador de página actual */}
          <div className="flex w-[100px] items-center justify-center text-xs font-medium text-neutral/50">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount() || 1}
          </div>

          {/* Botones de navegación (Flechas) */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex rounded-md bg-surface border-neutral/10 text-secondary hover:bg-neutral/5"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la primera página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md bg-surface border-neutral/10 text-secondary hover:bg-neutral/5"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-md bg-surface border-neutral/10 text-secondary hover:bg-neutral/5"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex rounded-md bg-surface border-neutral/10 text-secondary hover:bg-neutral/5"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
