import React, { useState } from "react";
import { TrendingUp, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminGraficaFacturacion = ({
  anio,
  setAnio,
  facturacion,
  listadoFarmacias = [],
  listadoNutricionistas = [],
  filtroFarmacia,
  setFiltroFarmacia,
  filtroNutri,
  setFiltroNutri,
}) => {
  const [showConsultas, setShowConsultas] = useState(true);
  const [showPedidos, setShowPedidos] = useState(true);

  return (
  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-[#062e3a]/10 p-3 rounded-2xl text-[#062e3a]">
          <TrendingUp size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#062e3a]">
            Facturación Global
          </h2>
          <p className="text-[#342c1e] font-medium">
            Ingresos por Consultas y Venta de Productos
          </p>
        </div>
      </div>
      
      {/* Zona de Súper Filtros */}
      <div className="flex gap-3 my-4 md:my-0 flex-1 md:mx-6 items-center">
        <select
          value={filtroFarmacia}
          onChange={(e) => setFiltroFarmacia(e.target.value)}
          className="flex-1 bg-[#f4f7f4] border border-gray-200 text-[#062e3a] text-xs font-bold rounded-xl focus:ring-[#367933] focus:border-[#367933] block p-2 outline-none appearance-none"
        >
          <option value="">Todas las Famacias</option>
          {listadoFarmacias.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nombre}
            </option>
          ))}
        </select>

        <select
          value={filtroNutri}
          onChange={(e) => setFiltroNutri(e.target.value)}
          className="flex-1 bg-[#f4f7f4] border border-gray-200 text-[#062e3a] text-xs font-bold rounded-xl focus:ring-[#367933] focus:border-[#367933] block p-2 outline-none appearance-none"
        >
          <option value="">Todas las Nutricionistas</option>
          {listadoNutricionistas.map((n) => (
            <option key={n.id} value={n.id}>
              {n.nombre} {n.apellidos}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 w-full md:w-auto">
        {/* Toggles Interactivas */}
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
          <button
            onClick={() => setShowConsultas(!showConsultas)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2
              ${showConsultas ? "bg-[#b1cb0c]/20 text-[#367933]" : "text-gray-400 hover:bg-gray-100"}
            `}
          >
            <div className={`w-2 h-2 rounded-full ${showConsultas ? "bg-[#b1cb0c]" : "bg-gray-400"}`}></div>
            Consultas
          </button>
          
          <button
            onClick={() => setShowPedidos(!showPedidos)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2
              ${showPedidos ? "bg-[#062e3a]/10 text-[#062e3a]" : "text-gray-400 hover:bg-gray-100"}
            `}
          >
            <div className={`w-2 h-2 rounded-full ${showPedidos ? "bg-[#062e3a]" : "bg-gray-400"}`}></div>
            Productos
          </button>
        </div>

        <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-4 border border-gray-200">
          <button
            onClick={() => setAnio(anio - 1)}
            className="hover:text-[#367933] text-[#062e3a] font-bold"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-black text-lg text-[#062e3a]">{anio}</span>
          <button
            onClick={() => setAnio(anio + 1)}
            className="hover:text-[#367933] text-[#062e3a] font-bold"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>

    {/* Altura fija definida para evitar fallos de Recharts */}
    <div className="h-[400px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={100}>
        <BarChart
          data={facturacion}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f3f4f6"
          />
          <XAxis
            dataKey="mesTexto"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#342c1e", fontWeight: "bold" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#342c1e", fontWeight: "bold" }}
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip
            cursor={{ fill: "#f4f7f4" }}
            contentStyle={{
              borderRadius: "1rem",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value) => [`${value} €`]}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontWeight: "bold",
              color: "#062e3a",
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontWeight: "bold",
              color: "#062e3a",
            }}
          />
          {showConsultas && (
            <Bar
              dataKey="ingresosConsultas"
              name="Consultas (Servicios)"
              stackId="a"
              fill="#b1cb0c"
              radius={showPedidos ? [0, 0, 4, 4] : [4, 4, 4, 4]}
            />
          )}
          {showPedidos && (
            <Bar
              dataKey="ingresosPedidos"
              name="Venta Productos"
              stackId="a"
              fill="#062e3a"
              radius={showConsultas ? [4, 4, 0, 0] : [4, 4, 4, 4]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
  );
};

export default AdminGraficaFacturacion;
