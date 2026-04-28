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
  toolbarExtra,
  emptyText = "No se encontraron resultados.",
  // ── NUEVO INTERRUPTOR (PROP) ──
  enableRowSelection = false,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
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
      <p className="text-sm font-medium text-secondary">Filas por página</p>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="h-8 w-[70px] bg-surface border-neutral/10 rounded-xl shadow-sm focus:ring-primary/30 text-secondary font-bold">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent
          side="top"
          className="rounded-xl shadow-lg border-neutral/10"
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
    <div className="w-full space-y-4">
      {/* ── BARRA DE HERRAMIENTAS (Toolbar) ── */}
      <div className="flex flex-col md:flex-row items-center gap-3 py-4">
        {/* 1. Buscador Principal (Se expande con flex-1) */}
        {searchKey && (
          <div className="relative w-full md:flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary z-10 pointer-events-none"
            />
            <Input
              placeholder={searchPlaceholder}
              value={table.getColumn(searchKey)?.getFilterValue() || ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="w-full pl-10 bg-surface border-neutral/10 focus-visible:border-primary focus-visible:ring-primary/30 text-secondary rounded-xl shadow-sm h-11"
            />
          </div>
        )}

        {/* 2. Filtros Extras (Ej. Selector de Meses) */}
        {toolbarExtra}

        {/* 3. Selector de Columnas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-auto shrink-0 border-neutral/10 text-secondary bg-surface rounded-xl h-11 shadow-sm font-medium"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[180px] rounded-xl border-neutral/10 shadow-lg"
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
      </div>

      {/* ── CUERPO DE LA TABLA ── */}
      <div className="rounded-xl border border-neutral/10 overflow-hidden bg-surface shadow-sm">
        <Table>
          <TableHeader className="bg-neutral/5 border-b border-neutral/10">
            {" "}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-none"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-3 px-4">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          onClick={() =>
                            header.column.toggleSorting(
                              header.column.getIsSorted() === "asc",
                            )
                          }
                          className="h-8 px-2 -ml-2 hover:bg-neutral/10 font-bold text-secondary text-xs uppercase tracking-wider transition-colors"
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
                        <span className="font-bold text-secondary text-xs uppercase tracking-wider px-2">
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
                  // 👇 AQUÍ LA MAGIA: Quitamos el Javascript y usamos even: y odd: de Tailwind
                  className="transition-colors border-b border-neutral/5 last:border-none data-[state=selected]:bg-primary/5 hover:bg-primary/10 even:bg-neutral/5 odd:bg-surface"
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
      </div>

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
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-secondary">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount() || 1}
          </div>

          {/* Botones de navegación (Flechas) */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex rounded-xl bg-surface border-neutral/10 shadow-sm text-secondary hover:bg-neutral/5"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la primera página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl bg-surface border-neutral/10 shadow-sm text-secondary hover:bg-neutral/5"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-xl bg-surface border-neutral/10 shadow-sm text-secondary hover:bg-neutral/5"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex rounded-xl bg-surface border-neutral/10 shadow-sm text-secondary hover:bg-neutral/5"
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
