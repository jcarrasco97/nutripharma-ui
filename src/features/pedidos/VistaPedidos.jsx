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
  Wallet,
  Banknote,
  Filter,
  ArrowUpDown,
  FileText,
  X,
  Info,
  ChevronRight,
  History,
} from "lucide-react";
import { productosService } from "../../features/pedidos/productosService";
import { pedidosService } from "../../features/pedidos/pedidosService";
import { farmaciaService } from "../admin/farmaciaService";
import { nutricionistasService } from "../admin/nutricionistasService";
import { jwtDecode } from "jwt-decode";

const VistaPedidos = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [perfil, setPerfil] = useState(null);

  const [esFarmacia, setEsFarmacia] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mesFiltro, setMesFiltro] = useState("Todos");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [farmaciaSeleccionada, setFarmaciaSeleccionada] = useState("");

  const cargarDatos = async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const roles = decoded.roles || [];
      const soyFarmacia = roles.includes("ROLE_FARMACIA");
      setEsFarmacia(soyFarmacia);

      const [datosProds, datosPeds] = await Promise.all([
        productosService.listarTodos(),
        pedidosService.obtenerMisPedidos(),
      ]);
      setProductos(datosProds);
      setPedidos(datosPeds);

      if (soyFarmacia) {
        const miPerfilFarm = await farmaciaService.obtenerMiPerfil();
        setPerfil(miPerfilFarm);
        setFarmaciaSeleccionada(miPerfilFarm.id.toString());
      } else {
        const [miPerfilNutri, todasLasFarmacias] = await Promise.all([
          nutricionistasService.obtenerMiPerfil(),
          farmaciaService.listarTodas(),
        ]);
        setPerfil(miPerfilNutri);

        // --- NUEVA LÓGICA DE AISLAMIENTO (N:M) ---
        const misFarmacias = todasLasFarmacias.filter((f) =>
          miPerfilNutri.asignaciones?.some(
            (asignacion) => asignacion.farmaciaId === f.id,
          ),
        );
        setFarmacias(misFarmacias);

        if (misFarmacias.length > 0) {
          setFarmaciaSeleccionada(misFarmacias[0].id.toString());
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setErrorCarga(
        "No se pudieron cargar los datos. Por favor, revisa tu conexión.",
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Limpiar carrito si una Nutricionista cambia de Farmacia destino (Evita problemas de cálculo de precios cruzados)
  useEffect(() => {
    if (!esFarmacia) {
      setCarrito([]);
    }
  }, [farmaciaSeleccionada, esFarmacia]);

  // Identificamos la farmacia destino seleccionada
  const farmaciaActual = esFarmacia
    ? perfil
    : farmacias.find((f) => f.id.toString() === farmaciaSeleccionada);

  // --- MOTOR DE PRECIOS GEOGRÁFICOS ---
  // Retorna PVF si es de Almería, o PVP si es de fuera.
  const getPrecioAplicado = (producto) => {
    if (!farmaciaActual || farmaciaActual.esProvinciaLocal !== false) {
      return producto.pvf;
    }
    return producto.pvp;
  };

  const saldoDisponibleInicial = farmaciaActual?.saldoVirtual || 0;

  // Los totales ahora se calculan usando el Motor de Precios Dinámico
  const totalReal = carrito
    .filter((item) => !item.pagadoConSaldo)
    .reduce(
      (sum, item) => sum + item.cantidad * getPrecioAplicado(item.productoInfo),
      0,
    );

  const totalVirtual = carrito
    .filter((item) => item.pagadoConSaldo)
    .reduce(
      (sum, item) => sum + item.cantidad * getPrecioAplicado(item.productoInfo),
      0,
    );

  const saldoRestante = saldoDisponibleInicial - totalVirtual;
  const umbralAlcanzado = totalReal >= 80;

  const mesesDisponibles = [
    "Todos",
    ...new Set(pedidos.map((p) => p.fechaPedido.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  const pedidosFiltradosYOrdenados = pedidos
    .filter((p) => mesFiltro === "Todos" || p.fechaPedido.startsWith(mesFiltro))
    .sort((a, b) => {
      if (ordenFiltro === "recientes")
        return new Date(b.fechaPedido) - new Date(a.fechaPedido);
      if (ordenFiltro === "antiguos")
        return new Date(a.fechaPedido) - new Date(b.fechaPedido);
      if (ordenFiltro === "precio_desc")
        return (b.totalPedido || 0) - (a.totalPedido || 0);
      if (ordenFiltro === "precio_asc")
        return (a.totalPedido || 0) - (b.totalPedido || 0);
      return 0;
    });

  const calcularBonificados = (cantidad) => {
    if (cantidad >= 100) return 20; // Corregido: antes tenías 30 en tu código original, el PRD dice 20
    if (cantidad >= 20) return 5;
    if (cantidad >= 10) return 2;
    if (cantidad >= 6) return 1;
    return 0;
  };

  const agregarAlCarrito = (producto, usarSaldo = false) => {
    if (usarSaldo && !umbralAlcanzado) {
      return alert(
        "Debes alcanzar los 80€ en dinero real antes de usar el saldo virtual.",
      );
    }
    if (usarSaldo && saldoRestante < getPrecioAplicado(producto)) {
      return alert("Saldo virtual insuficiente para este producto.");
    }

    setCarrito((prev) => {
      const existeIndex = prev.findIndex(
        (item) =>
          item.productoId === producto.id && item.pagadoConSaldo === usarSaldo,
      );

      if (existeIndex >= 0) {
        const nuevoCarrito = [...prev];
        const nuevaCant = nuevoCarrito[existeIndex].cantidad + 1;
        nuevoCarrito[existeIndex] = {
          ...nuevoCarrito[existeIndex],
          cantidad: nuevaCant,
          bonificados: usarSaldo ? 0 : calcularBonificados(nuevaCant),
        };
        return nuevoCarrito;
      }

      return [
        ...prev,
        {
          productoId: producto.id,
          cantidad: 1,
          bonificados: usarSaldo ? 0 : calcularBonificados(1),
          productoInfo: producto,
          pagadoConSaldo: usarSaldo,
        },
      ];
    });
  };

  const modificarCantidad = (id, delta, pagadoConSaldo) => {
    setCarrito((prev) => {
      const nuevoCarrito = prev.map((item) => {
        if (item.productoId === id && item.pagadoConSaldo === pagadoConSaldo) {
          if (
            pagadoConSaldo &&
            delta > 0 &&
            saldoRestante < getPrecioAplicado(item.productoInfo)
          ) {
            alert("No queda saldo virtual suficiente.");
            return item;
          }
          const nuevoValor = Math.max(0, item.cantidad + delta);
          const itemActualizado = { ...item, cantidad: nuevoValor };
          if (!pagadoConSaldo) {
            itemActualizado.bonificados = calcularBonificados(nuevoValor);
          }
          return itemActualizado;
        }
        return item;
      });
      return nuevoCarrito.filter((item) => item.cantidad > 0);
    });
  };

  const handleRealizarPedido = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");
    if (!farmaciaSeleccionada)
      return alert("Selecciona una farmacia de destino");

    setEnviando(true);
    try {
      const payload = {
        farmaciaId: Number(farmaciaSeleccionada),
        nutricionistaId: esFarmacia ? null : perfil.id,
        fechaPedido: new Date().toISOString().split("T")[0],
        lineas: carrito.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          bonificados: item.bonificados,
          pagadoConSaldo: item.pagadoConSaldo,
        })),
        creadoPorAdmin: false, // Desde esta vista, no es el admin haciendo de proxy
      };
      await pedidosService.crear(payload);
      alert("¡Pedido realizado con éxito!");
      setCarrito([]);
      cargarDatos();
    } catch (e) {
      alert(e.response?.data?.message || "Error al procesar el pedido.");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-sky-500" size={60} />
        <p className="text-gray-500 font-bold animate-pulse">
          Cargando catálogo y pedidos...
        </p>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-10 text-center max-w-2xl mx-auto">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-800">Error de carga</h3>
        <p className="text-red-600 mt-2">{errorCarga}</p>
        <button
          onClick={cargarDatos}
          className="mt-6 bg-red-600 text-white px-6 py-2 rounded-xl font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in relative pb-10">
      {/* MODAL DETALLES DEL PEDIDO */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-8 text-white flex justify-between items-center">
              <div>
                <span className="bg-white/20 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Detalle de Operación
                </span>
                <h3 className="text-2xl font-black mt-2">
                  Pedido #{pedidoSeleccionado.id}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sky-100 text-sm">
                  <p className="flex items-center gap-1">
                    <Package size={14} />{" "}
                    {pedidoSeleccionado.lineas?.length || 0} líneas
                  </p>
                  <span>•</span>
                  <p className="flex items-center gap-1">
                    <History size={14} /> {pedidoSeleccionado.fechaPedido}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-8 max-h-[65vh] overflow-y-auto">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-sky-500 rounded-full"></div>
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                  Resumen de Cesta
                </h4>
              </div>

              <div className="space-y-4">
                {pedidoSeleccionado.lineas?.map((linea) => {
                  const precioUnidad =
                    linea.precioUnitario || linea.precioAplicado || 0;
                  const subtotalCalculado =
                    linea.subtotal || precioUnidad * linea.cantidad;

                  return (
                    <div
                      key={linea.id}
                      className="group bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-transparent hover:border-sky-100 hover:bg-white transition-all"
                    >
                      <div className="flex gap-4 items-center">
                        <div
                          className={`p-3 rounded-xl ${linea.pagadoConSaldo ? "bg-purple-100 text-purple-600" : "bg-sky-100 text-sky-600"}`}
                        >
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {linea.productoNombre}
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mt-0.5">
                            <span>{linea.cantidad} unidades</span>
                            <span>•</span>
                            <span>{precioUnidad.toFixed(2)}€/ud</span>
                          </div>
                          {linea.bonificados > 0 && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-md mt-2 font-black">
                              🎁 +{linea.bonificados} BONIFICADOS (GRATIS)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {linea.pagadoConSaldo ? (
                          <div className="text-right">
                            <p className="text-purple-700 font-black text-lg">
                              {subtotalCalculado.toFixed(2)}€
                            </p>
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-tighter">
                              Liquidado con Saldo
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-900 font-black text-lg">
                            {subtotalCalculado.toFixed(2)}€
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-sky-400 text-xs font-black uppercase tracking-[0.2em] mb-1">
                      Total abonado real
                    </p>
                    <p className="text-4xl font-black">
                      {(pedidoSeleccionado.totalPedido || 0).toFixed(2)}
                      <span className="text-xl ml-1 text-sky-300">€</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs font-bold mb-1">
                      Estado de Pago
                    </p>
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${pedidoSeleccionado.estado === "LIQUIDADO" ? "bg-emerald-500" : "bg-amber-500"}`}
                    >
                      {pedidoSeleccionado.estado?.replace("_", " ") ||
                        "PENDIENTE"}
                    </span>
                  </div>
                </div>
                <ShoppingCart
                  size={150}
                  className="absolute -right-10 -bottom-10 opacity-5"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-600 font-black rounded-2xl hover:bg-gray-100 transition-colors"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATÁLOGO DE PRODUCTOS */}
      <div className="xl:col-span-7 space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-sky-600 p-4 rounded-3xl text-white shadow-lg shadow-sky-200">
                <ShoppingBag size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                  Hacer Pedido
                </h2>
                <p className="text-gray-500 font-medium mt-1">
                  Catálogo para{" "}
                  <span className="text-sky-600 font-black">
                    {farmaciaActual?.nombre || "..."}
                  </span>
                </p>
              </div>
            </div>

            {!esFarmacia && (
              <div className="w-full md:w-auto">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">
                  Seleccionar Destino
                </label>
                {farmacias.length === 0 ? (
                  <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold flex items-center gap-2">
                    <AlertCircle size={16} /> Sin farmacias asignadas
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={farmaciaSeleccionada}
                      onChange={(e) => setFarmaciaSeleccionada(e.target.value)}
                      className="w-full md:w-64 pl-4 pr-10 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 appearance-none focus:border-sky-500 focus:ring-0 transition-all outline-none"
                    >
                      {farmacias.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.nombre}
                        </option>
                      ))}
                    </select>
                    <ChevronRight
                      size={18}
                      className="absolute right-4 top-4.5 text-gray-400 rotate-90"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TARJETA MONEDERO */}
        <div
          className={`relative overflow-hidden rounded-[2.5rem] p-8 text-white transition-all duration-500 shadow-xl ${umbralAlcanzado ? "bg-gradient-to-br from-purple-600 to-indigo-800" : "bg-gradient-to-br from-gray-700 to-gray-900 opacity-90"}`}
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-[1.5rem] backdrop-blur-md">
                <Wallet size={36} />
              </div>
              <div>
                <p className="text-purple-100 text-xs font-black uppercase tracking-[0.2em] mb-1">
                  Monedero Farmacia
                </p>
                <p className="text-5xl font-black tracking-tighter">
                  {saldoRestante.toFixed(2)}
                  <span className="text-2xl ml-1 opacity-60">€</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end">
              {umbralAlcanzado ? (
                <div className="bg-emerald-500/20 border border-emerald-400/30 px-6 py-3 rounded-2xl backdrop-blur-sm flex items-center gap-3">
                  <div className="bg-emerald-500 p-1 rounded-full">
                    <Check size={14} />
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest text-emerald-300">
                    Saldo Desbloqueado
                  </p>
                </div>
              ) : (
                <div className="text-center md:text-right">
                  <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm mb-2">
                    <p className="text-xs font-bold text-purple-100">
                      Faltan{" "}
                      <span className="text-white font-black text-lg">
                        {(80 - totalReal).toFixed(2)}€
                      </span>{" "}
                      para usar saldo
                    </p>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2">
                    <div
                      className="bg-sky-400 h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, (totalReal / 80) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Banknote
            size={200}
            className="absolute -right-10 -bottom-20 opacity-10 rotate-12"
          />
        </div>

        {/* REJILLA PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="group bg-white border-2 border-gray-50 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:border-sky-100 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-sky-50 text-sky-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {prod.acronimo}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-500">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
                    En Stock
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-800 leading-tight group-hover:text-sky-600 transition-colors">
                  {prod.nombreProducto}
                </h3>
                <p className="text-xs font-bold text-gray-400 mt-2 flex items-center gap-1">
                  REF: <span className="text-gray-600">{prod.referencia}</span>
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  {/* NUEVO: Mostramos el precio dinámicamente según la ubicación de la farmacia */}
                  <span className="text-3xl font-black text-gray-900">
                    {getPrecioAplicado(prod).toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-gray-400">€</span>
                  <span className="ml-2 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">
                    {farmaciaActual?.esProvinciaLocal !== false
                      ? "Tarifa Local"
                      : "Tarifa Externa"}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => agregarAlCarrito(prod, false)}
                  disabled={!farmaciaSeleccionada}
                  className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white py-4 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-gray-200"
                >
                  <Plus size={18} /> Añadir a Cesta Real
                </button>

                {umbralAlcanzado && (
                  <button
                    onClick={() => agregarAlCarrito(prod, true)}
                    disabled={saldoRestante < getPrecioAplicado(prod)}
                    className="w-full bg-purple-50 text-purple-700 border-2 border-purple-100 py-4 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-3 transition-all hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Wallet size={18} /> Comprar con Saldo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CARRITO Y RESUMEN FINANCIERO */}
      <div className="xl:col-span-5 space-y-8">
        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-8 sticky top-6">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-sky-100 p-3 rounded-2xl text-sky-600">
                <ShoppingCart size={24} />
              </div>
              <h3 className="text-xl font-black text-gray-800">
                Mi Doble Cesta
              </h3>
            </div>
            <span className="bg-gray-900 text-white text-xs font-black px-4 py-1.5 rounded-full">
              {carrito.length} artículos
            </span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 mb-8 custom-scrollbar">
            {carrito.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <ShoppingCart size={48} className="text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold">
                  Tu cesta está vacía.
                  <br />
                  Selecciona productos.
                </p>
              </div>
            ) : (
              carrito.map((item) => (
                <div
                  key={`${item.productoId}-${item.pagadoConSaldo}`}
                  className={`relative p-5 rounded-[1.5rem] border-2 transition-all ${item.pagadoConSaldo ? "bg-purple-50/50 border-purple-100" : "bg-gray-50/50 border-gray-100"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                      <p className="font-black text-gray-800 leading-tight">
                        {item.productoInfo.nombreProducto}
                      </p>
                      {item.pagadoConSaldo && (
                        <span className="inline-block bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md mt-1 uppercase tracking-tighter">
                          Pago con Monedero
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-black text-lg ${item.pagadoConSaldo ? "text-purple-700" : "text-gray-900"}`}
                    >
                      {(
                        item.cantidad * getPrecioAplicado(item.productoInfo)
                      ).toFixed(2)}
                      €
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                      <button
                        onClick={() =>
                          modificarCantidad(
                            item.productoId,
                            -1,
                            item.pagadoConSaldo,
                          )
                        }
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-10 text-center font-black text-gray-700">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() =>
                          modificarCantidad(
                            item.productoId,
                            1,
                            item.pagadoConSaldo,
                          )
                        }
                        className="p-2 text-gray-400 hover:text-sky-600 transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {!item.pagadoConSaldo && item.bonificados > 0 && (
                      <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-xl animate-bounce-subtle">
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          Bonificación: +{item.bonificados}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-gray-50 rounded-[2rem] p-6 space-y-4 mb-8">
            {totalVirtual > 0 && (
              <div className="flex justify-between items-center text-purple-700 px-2">
                <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Wallet size={14} /> Saldo a descontar
                </p>
                <p className="font-black">-{totalVirtual.toFixed(2)}€</p>
              </div>
            )}
            <div className="flex justify-between items-end border-t border-gray-200 pt-4 px-2">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Total a pagar real
                </p>
                {!umbralAlcanzado && totalReal > 0 && (
                  <p className="text-[10px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                    <Info size={10} /> Falta para el mínimo
                  </p>
                )}
              </div>
              <p
                className={`text-4xl font-black tracking-tighter ${umbralAlcanzado ? "text-sky-600" : "text-gray-800"}`}
              >
                {totalReal.toFixed(2)}
                <span className="text-xl ml-1">€</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleRealizarPedido}
            disabled={
              carrito.length === 0 ||
              enviando ||
              (!umbralAlcanzado && totalVirtual > 0) ||
              !farmaciaSeleccionada
            }
            className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-sky-100 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
          >
            {enviando ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <ShoppingBag size={24} /> Confirmar Pedido
              </>
            )}
          </button>
        </div>

        {/* HISTORIAL DE PEDIDOS */}
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <History size={20} />
              </div>
              <h3 className="text-lg font-black text-gray-800">
                Mis últimos pedidos
              </h3>
            </div>
            <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {pedidosFiltradosYOrdenados.length} Registros
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="relative">
              <Filter
                size={14}
                className="absolute left-3.5 top-3.5 text-gray-400"
              />
              <select
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-[11px] font-black text-gray-600 appearance-none focus:bg-white focus:border-sky-500 transition-all outline-none"
              >
                {mesesDisponibles.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes === "Todos" ? "TODOS LOS MESES" : mes}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <ArrowUpDown
                size={14}
                className="absolute left-3.5 top-3.5 text-gray-400"
              />
              <select
                value={ordenFiltro}
                onChange={(e) => setOrdenFiltro(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-[11px] font-black text-gray-600 appearance-none focus:bg-white focus:border-sky-500 transition-all outline-none"
              >
                <option value="recientes">MÁS RECIENTES</option>
                <option value="antiguos">MÁS ANTIGUOS</option>
                <option value="precio_desc">MAYOR IMPORTE</option>
                <option value="precio_asc">MENOR IMPORTE</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {pedidosFiltradosYOrdenados.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold text-sm">
                  No hay resultados para este filtro
                </p>
              </div>
            ) : (
              pedidosFiltradosYOrdenados.map((ped) => (
                <div
                  key={ped.id}
                  className="group bg-gray-50 rounded-[1.5rem] p-5 border-2 border-transparent hover:bg-white hover:border-amber-100 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-gray-800">
                        Pedido #{ped.id}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        {ped.fechaPedido}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-lg">
                        {(ped.totalPedido || 0).toFixed(2)}€
                      </p>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${ped.estado === "LIQUIDADO" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {ped.estado?.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPedidoSeleccionado(ped)}
                    className="w-full py-3 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all"
                  >
                    Ver Informe Detallado
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaPedidos;
