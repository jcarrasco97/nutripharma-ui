import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  ShoppingCart,
  Check,
  Package,
  Loader2,
  AlertCircle,
  Banknote,
} from "lucide-react";
import { productosService } from "../../services/productosService";
import { pedidosService } from "../../services/pedidosService";
import { farmaciaService } from "../../services/farmaciaService";

const VistaPedidos = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // El carrito es un array de objetos: { productoId, cantidad, bonificados, productoInfo }
  const [carrito, setCarrito] = useState([]);
  const [farmaciaSeleccionada, setFarmaciaSeleccionada] = useState("");

  const NUTRICIONISTA_ID = 1; // ID temporal de Laura

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [datosProds, datosPeds, datosFarms] = await Promise.all([
        productosService.listarTodos(),
        pedidosService.listarTodos(),
        farmaciaService.listarTodas(),
      ]);
      setProductos(datosProds);
      setPedidos(datosPeds);
      setFarmacias(datosFarms);
      if (datosFarms.length > 0) setFarmaciaSeleccionada(datosFarms[0].id);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- LÓGICA DEL CARRITO ---
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.productoId === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.productoId === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          productoId: producto.id,
          cantidad: 1,
          bonificados: 0,
          productoInfo: producto,
        },
      ];
    });
  };

  const modificarCantidad = (id, delta, tipo = "cantidad") => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.productoId === id) {
            const nuevoValor = Math.max(0, item[tipo] + delta);
            return { ...item, [tipo]: nuevoValor };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0 || item.bonificados > 0),
    );
  };

  const totalCarrito = carrito.reduce(
    (sum, item) => sum + item.cantidad * item.productoInfo.pvf,
    0,
  );

  // --- ENVIAR PEDIDO ---
  const handleRealizarPedido = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");

    setEnviando(true);
    try {
      const payload = {
        farmaciaId: Number(farmaciaSeleccionada),
        nutricionistaId: NUTRICIONISTA_ID,
        fechaPedido: new Date().toISOString().split("T")[0],
        lineas: carrito.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          bonificados: item.bonificados,
        })),
      };

      await pedidosService.crear(payload);
      alert("Pedido realizado con éxito.");
      setCarrito([]);
      cargarDatos();
    } catch {
      // CORREGIDO: ESLint ya no se quejará
      alert("Error al enviar el pedido.");
    } finally {
      setEnviando(false);
    }
  };

  // --- LIQUIDAR PEDIDO ---
  const handleLiquidar = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres liquidar este pedido?"))
      return;
    try {
      await pedidosService.liquidar(id);
      alert("Pedido liquidado correctamente.");
      cargarDatos(); // Refrescar lista para ver el cambio de estado
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error al liquidar el pedido. Asegúrate de que supera los 80€.",
      );
    }
  };

  if (cargando)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-sky-500" size={48} />
      </div>
    );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in">
      {/* IZQUIERDA: CATÁLOGO */}
      <div className="xl:col-span-7 space-y-4">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
            <Package size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Catálogo de Productos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-bold">
                    {prod.acronimo}
                  </span>
                  {prod.hayExistencias ? (
                    <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                      <Check size={12} /> En Stock
                    </span>
                  ) : (
                    <span className="text-red-500 text-xs font-bold flex items-center gap-1">
                      <AlertCircle size={12} /> Sin Stock
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-800 line-clamp-2">
                  {prod.nombreProducto}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ref: {prod.referencia}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    PVF (Farmacia)
                  </p>
                  <p className="text-lg font-black text-sky-600">
                    {prod.pvf.toFixed(2)}€
                  </p>
                </div>
                <button
                  onClick={() => agregarAlCarrito(prod)}
                  disabled={!prod.hayExistencias}
                  className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white p-2 rounded-xl transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DERECHA: CARRITO Y HISTORIAL */}
      <div className="xl:col-span-5 space-y-6">
        {/* CARRITO */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart size={20} /> Carrito Actual
            </h3>
            <span className="bg-sky-100 text-sky-700 font-bold px-3 py-1 rounded-full text-sm">
              {carrito.length} items
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 mb-1">
              Destino (Farmacia)
            </label>
            <select
              value={farmaciaSeleccionada}
              onChange={(e) => setFarmaciaSeleccionada(e.target.value)}
              className="w-full border-gray-200 rounded-xl text-sm"
            >
              {farmacias.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          {carrito.length === 0 ? (
            <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-100 rounded-xl">
              Añade productos del catálogo
            </div>
          ) : (
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
              {carrito.map((item) => (
                <div
                  key={item.productoId}
                  className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm"
                >
                  <p className="font-bold text-gray-800 mb-2 truncate">
                    {item.productoInfo.nombreProducto}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                      <button
                        onClick={() =>
                          modificarCantidad(item.productoId, -1, "cantidad")
                        }
                        className="p-1 text-gray-500 hover:text-sky-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-700">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          modificarCantidad(item.productoId, 1, "cantidad")
                        }
                        className="p-1 text-gray-500 hover:text-sky-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex items-center bg-emerald-50 border border-emerald-100 rounded-lg">
                      <button
                        onClick={() =>
                          modificarCantidad(item.productoId, -1, "bonificados")
                        }
                        className="p-1 text-emerald-600 hover:text-emerald-800"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-emerald-700">
                        {item.bonificados}B
                      </span>
                      <button
                        onClick={() =>
                          modificarCantidad(item.productoId, 1, "bonificados")
                        }
                        className="p-1 text-emerald-600 hover:text-emerald-800"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="font-bold text-gray-800 w-16 text-right">
                      {(item.cantidad * item.productoInfo.pvf).toFixed(2)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 mb-4 flex justify-between items-center">
            <span className="text-gray-500 font-bold">Total Estimado</span>
            <span className="text-2xl font-black text-gray-800">
              {totalCarrito.toFixed(2)}€
            </span>
          </div>

          {totalCarrito > 0 && totalCarrito < 80 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-4 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <p>
                <strong>Aviso:</strong> Este pedido no alcanzará los 80€ mínimos
                para ser liquidado.
              </p>
            </div>
          )}

          <button
            onClick={handleRealizarPedido}
            disabled={carrito.length === 0 || enviando}
            className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors shadow-md shadow-sky-200"
          >
            {enviando ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <ShoppingBag size={18} className="mr-2" /> Realizar Pedido
              </>
            )}
          </button>
        </div>

        {/* HISTORIAL DE PEDIDOS RECIENTES */}
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 pl-2">
            Historial Reciente
          </h3>
          <div className="space-y-3">
            {pedidos.slice(0, 5).map((ped) => (
              <div
                key={ped.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">
                      {ped.farmaciaNombre}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ped.fechaPedido} • {ped.lineas.length} líneas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-800">
                      {ped.totalPedido.toFixed(2)}€
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${ped.estado === "LIQUIDADO" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {ped.estado.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* BOTÓN DE LIQUIDAR */}
                {ped.estado === "PENDIENTE_LIQUIDAR" &&
                  ped.totalPedido >= 80 && (
                    <button
                      onClick={() => handleLiquidar(ped.id)}
                      className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Banknote size={16} /> Liquidar Pedido
                    </button>
                  )}
              </div>
            ))}
            {pedidos.length === 0 && (
              <p className="text-sm text-gray-400 pl-2">
                No hay pedidos recientes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaPedidos;
