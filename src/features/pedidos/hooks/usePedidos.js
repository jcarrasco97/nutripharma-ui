import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { productosService } from "../services/productosService";
import { pedidosService } from "../services/pedidosService";
import { farmaciaService } from "../../administracion/services/farmaciaService";
import { nutricionistasService } from "../../administracion/services/nutricionistasService";

export const usePedidos = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [esFarmacia, setEsFarmacia] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null);

  const [mesFiltro, setMesFiltro] = useState("INITIAL");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");
  const [carrito, setCarrito] = useState([]);
  const [farmaciaSeleccionada, setFarmaciaSeleccionada] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userRoles = Array.isArray(decoded.roles)
        ? decoded.roles.map((r) => (typeof r === "string" ? r : r.authority))
        : [];

      const soyFarmacia = userRoles.includes("ROLE_FARMACIA");
      const soyAdmin =
        userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_SUPERADMIN");
      setEsFarmacia(soyFarmacia);
      setEsAdmin(soyAdmin);

      const [datosProds, datosPeds] = await Promise.all([
        productosService.listarTodos().catch(() => []),
        soyAdmin
          ? Promise.resolve([])
          : pedidosService.obtenerMisPedidos().catch(() => []),
      ]);
      setProductos(datosProds);
      setPedidos(datosPeds);

      if (soyFarmacia) {
        const miPerfilFarm = await farmaciaService
          .obtenerMiPerfil()
          .catch(() => null);
        if (miPerfilFarm) {
          setPerfil(miPerfilFarm);
          setFarmaciaSeleccionada(miPerfilFarm.id.toString());
        }
      } else if (soyAdmin) {
        const todas = await farmaciaService.listarTodas().catch(() => []);
        setFarmacias(todas);
        if (todas.length > 0) setFarmaciaSeleccionada(todas[0].id.toString());
      } else {
        const [miPerfilNutri, todas] = await Promise.all([
          nutricionistasService.obtenerMiPerfil().catch(() => null),
          farmaciaService.listarTodas().catch(() => []),
        ]);
        if (miPerfilNutri) {
          setPerfil(miPerfilNutri);
          const misFarmacias = todas.filter((f) =>
            miPerfilNutri.asignaciones?.some((a) => a.farmaciaId === f.id),
          );
          setFarmacias(misFarmacias);
          if (misFarmacias.length > 0)
            setFarmaciaSeleccionada(misFarmacias[0].id.toString());
        }
      }
    } catch (error) {
      console.error(error);
      setErrorCarga("Error al sincronizar el entorno de pedidos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    if (!esFarmacia) setCarrito([]);
  }, [farmaciaSeleccionada, esFarmacia]);

  const farmaciaActual = esFarmacia
    ? perfil
    : farmacias.find((f) => f.id?.toString() === farmaciaSeleccionada);

  const getPrecioAplicado = (producto) =>
    !farmaciaActual || farmaciaActual.esProvinciaLocal !== false
      ? producto.pvf
      : producto.pvp;

  const totalReal = carrito
    .filter((i) => !i.pagadoConSaldo)
    .reduce((s, i) => s + i.cantidad * getPrecioAplicado(i.productoInfo), 0);
  const totalVirtual = carrito
    .filter((i) => i.pagadoConSaldo)
    .reduce((s, i) => s + i.cantidad * getPrecioAplicado(i.productoInfo), 0);
  const umbralAlcanzado = totalReal >= 80;
  const saldoRestante = (farmaciaActual?.saldoVirtual || 0) - totalVirtual;

  const agregarAlCarrito = (producto, usarSaldo = false) => {
    if (usarSaldo && !umbralAlcanzado)
      return alert("Mínimo 80€ en compra real para usar saldo.");
    if (usarSaldo && saldoRestante < getPrecioAplicado(producto))
      return alert("Saldo insuficiente.");

    setCarrito((prev) => {
      const idx = prev.findIndex(
        (i) => i.productoId === producto.id && i.pagadoConSaldo === usarSaldo,
      );
      if (idx >= 0) {
        const newC = [...prev];
        const nuevaCantidad = newC[idx].cantidad + 1;
        newC[idx] = {
          ...newC[idx],
          cantidad: nuevaCantidad,
          bonificados: usarSaldo ? 0 : calcularBonificados(nuevaCantidad),
        };
        return newC;
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

  const calcularBonificados = (q) => {
    if (q >= 100) return 20;
    if (q >= 20) return 5;
    if (q >= 10) return 2;
    if (q >= 6) return 1;
    return 0;
  };

  const modificarCantidad = (id, delta, pagadoConSaldo) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (
            item.productoId === id &&
            item.pagadoConSaldo === pagadoConSaldo
          ) {
            if (
              pagadoConSaldo &&
              delta > 0 &&
              saldoRestante < getPrecioAplicado(item.productoInfo)
            )
              return item;
            const newQ = Math.max(0, item.cantidad + delta);
            return {
              ...item,
              cantidad: newQ,
              bonificados: pagadoConSaldo ? 0 : calcularBonificados(newQ),
            };
          }
          return item;
        })
        .filter((i) => i.cantidad > 0),
    );
  };

  const handleRealizarPedido = async () => {
    setEnviando(true);
    try {
      const payload = {
        farmaciaId: Number(farmaciaSeleccionada),
        nutricionistaId: !esFarmacia && !esAdmin && perfil ? perfil.id : null,
        fechaPedido: new Date().toISOString().split("T")[0],
        lineas: carrito.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
          bonificados: i.bonificados,
          pagadoConSaldo: i.pagadoConSaldo,
        })),
      };
      await pedidosService.crear(payload);
      alert(
        esAdmin ? "Pedido Proxy registrado." : "Pedido realizado con éxito.",
      );
      setCarrito([]);
      if (!esAdmin) cargarDatos();
    } catch {
      alert("Error al procesar.");
    } finally {
      setEnviando(false);
    }
  };

  // --- MOTOR DE HISTORIAL ---

  // 1. Extraemos meses únicos de los pedidos (ej. ['2026-04', '2026-03'])
  const mesesDisponibles = [
    ...new Set(
      pedidos.map((p) => p.fechaPedido?.substring(0, 7)).filter(Boolean),
    ),
  ].sort((a, b) => b.localeCompare(a));

  // 2. Lógica para asignar el mes por defecto al cargar (el más reciente)
  const mesActivo =
    mesFiltro === "INITIAL"
      ? mesesDisponibles.length > 0
        ? mesesDisponibles[0]
        : "Todos"
      : mesFiltro;

  // 3. Filtrado y Ordenación Combinada
  const pedidosFiltrados = pedidos
    .filter(
      (p) => mesActivo === "Todos" || p.fechaPedido?.startsWith(mesActivo),
    )
    .filter((p) => {
      // Filtrado extra por Estado
      // Filtrado extra por Estado
      if (ordenFiltro === "pendientes")
        return p.estado === "PENDIENTE_ENVIO" || p.estado === "PENDIENTE";
      if (ordenFiltro === "enviados")
        return p.estado === "ENVIADO" || p.estado === "LIQUIDADO";
      if (ordenFiltro === "cancelados")
        return p.estado === "CANCELADO" || p.estado === "CANCELADA";
      return true;
    })
    .sort((a, b) => {
      // Ordenación matemática
      if (ordenFiltro === "antiguos")
        return new Date(a.fechaPedido) - new Date(b.fechaPedido);
      if (ordenFiltro === "precio_desc")
        return (b.totalPedido || 0) - (a.totalPedido || 0);
      if (ordenFiltro === "precio_asc")
        return (a.totalPedido || 0) - (b.totalPedido || 0);

      // Por defecto y "recientes"
      return new Date(b.fechaPedido) - new Date(a.fechaPedido);
    });

  // Manejador del cambio de mes
  const handleSetMesFiltro = (nuevoMes) => {
    setMesFiltro(nuevoMes);
  };

  return {
    productos,
    pedidosFiltrados,
    farmacias,
    farmaciaActual,
    esFarmacia,
    esAdmin,
    cargando,
    enviando,
    errorCarga,
    carrito,
    farmaciaSeleccionada,
    setFarmaciaSeleccionada,
    pedidoSeleccionado,
    setPedidoSeleccionado,
    totalReal,
    totalVirtual,
    saldoRestante,
    umbralAlcanzado,
    agregarAlCarrito,
    modificarCantidad,
    handleRealizarPedido,
    getPrecioAplicado,
    cargarDatos,
    // Exportamos los datos actualizados del Historial
    mesesDisponibles,
    mesFiltro: mesActivo,
    setMesFiltro: handleSetMesFiltro,
    ordenFiltro,
    setOrdenFiltro,
  };
};
