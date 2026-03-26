import React from "react";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
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

const AdminGraficaFacturacion = ({ anio, setAnio, facturacion }) => (
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

    {/* Altura fija definida para evitar fallos de Recharts */}
    <div className="h-[400px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
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
          <Bar
            dataKey="ingresosConsultas"
            name="Consultas (Servicios)"
            stackId="a"
            fill="#b1cb0c"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="ingresosPedidos"
            name="Venta Productos"
            stackId="a"
            fill="#062e3a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AdminGraficaFacturacion;
