import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";

const FiltrosDocumentos = ({
  filtroTexto,
  setFiltroTexto,
  filtroMes,
  setFiltroMes,
  mesesDisponibles,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-3 text-neutral/50 z-10" />
        <Input
          type="text"
          placeholder="Buscar por nombre de archivo..."
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="w-full pl-10 text-secondary border-neutral/10 bg-neutral/5 focus-visible:border-accent"
        />
      </div>

      <div className="relative w-full md:w-64">
        <Filter size={16} className="absolute left-3 top-3 text-neutral/50 z-10 pointer-events-none" />
        <Select value={filtroMes} onValueChange={setFiltroMes}>
          <SelectTrigger className="w-full pl-10 text-secondary border-neutral/10 bg-neutral/5 focus:border-accent">
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent>
            {mesesDisponibles.map((mes) => (
              <SelectItem key={mes} value={mes}>
                {mes === "Todos" ? "Todas las fechas" : mes}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FiltrosDocumentos;
