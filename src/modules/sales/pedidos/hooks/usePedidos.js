import { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { pedidosService } from "../services/pedidosService";
import { configuracionService } from "../services/configuracionService";
// Consumimos el resto a través de las APIs públicas de cada módulo
import { productosService } from "@/modules/sales/catalogo";
import { farmaciaService } from "@/modules/organization/farmacias";
import { nutricionistasService } from "@/modules/organization/nutricionistas";

export const usePedidos = () => {
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [esFarmacia, setEsFarmacia] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [esNutricionista, setEsNutricionista] = useState(false);
  const [miEmail, setMiEmail] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errorCarga, setErrorCarga] = useState(null);
  const [limiteMonedero, setLimiteMonedero] = useState(80);

  const [mesFiltro, setMesFiltro] = useState("INITIAL");
  const [ordenFiltro, setOrdenFiltro] = useState("recientes");
  const [ordenProductos, setOrdenProductos] = useState("por_defecto");
  const [idsRecomendados, setIdsRecomendados] = useState([]);
  const [idsMasVendidos, setIdsMasVendidos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [farmaciaSeleccionada, setFarmaciaSeleccionada] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [observacionesPedido, setObservacionesPedido] = useState("");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setErrorCarga(null);
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      setMiEmail(decoded.sub || decoded.email || null);
      const userRoles = Array.isArray(decoded.roles)
        ? decoded.roles.map((r) => (typeof r === "string" ? r : r.authority))
        : [];

      const soyFarmacia = userRoles.includes("ROLE_FARMACIA");
      const soyAdmin =
        userRoles.includes("ROLE_ADMIN") ||
        userRoles.includes("ROLE_SUPERADMIN");
      const soyNutricionista = !soyFarmacia && !soyAdmin;
      setEsFarmacia(soyFarmacia);
      setEsAdmin(soyAdmin);
      setEsNutricionista(soyNutricionista);

      const [datosProds, datosPeds, datosTopVentas, configData] = await Promise.all([
        productosService.listarTodos().catch(() => []),
        soyAdmin
          ? Promise.resolve([])
          : pedidosService.obtenerMisPedidos().catch(() => []),
        productosService.obtenerTopVentasGlobal().catch(() => []),
        configuracionService.obtenerConfiguracion().catch(() => ({ limiteMonedero: 80 })),
      ]);
      setProductos(datosProds);
      setPedidos(datosPeds);
      setIdsMasVendidos(datosTopVentas);
      if (configData?.limiteMonedero) {
        setLimiteMonedero(configData.limiteMonedero);
      }

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

  useEffect(() => {
    if (!farmaciaSeleccionada) return;
    productosService
      .obtenerRecomendadosFarmacia(farmaciaSeleccionada)
      .then(setIdsRecomendados)
      .catch(() => setIdsRecomendados([]));
  }, [farmaciaSeleccionada]);

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
  const umbralAlcanzado = totalReal >= limiteMonedero;
  const saldoRestante = (farmaciaActual?.saldoVirtual || 0) - totalVirtual;

  const agregarAlCarrito = (producto, usarSaldo = false) => {
    if (usarSaldo && !umbralAlcanzado)
      return alert(`Mínimo ${limiteMonedero}€ en compra real para usar saldo.`);
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

  const calcularBonificados = (cantidad) => {
    let q = cantidad; // Copiamos la cantidad para ir restándole
    let totalRegalos = 0;

    // Tramo 1: Grupos de 100
    const tramo100 = Math.floor(q / 100);
    totalRegalos += tramo100 * 25;
    q = q % 100; // Nos quedamos con el resto

    // Tramo 2: Grupos de 20
    const tramo20 = Math.floor(q / 20);
    totalRegalos += tramo20 * 5;
    q = q % 20;

    // Tramo 3: Grupos de 10
    const tramo10 = Math.floor(q / 10);
    totalRegalos += tramo10 * 2;
    q = q % 10;

    // Tramo 4: Grupos de 6
    const tramo6 = Math.floor(q / 6);
    totalRegalos += tramo6 * 1;

    return totalRegalos;
  };

  const modificarCantidad = (id, delta, pagadoConSaldo) => {
    setCarrito((prev) => {
      const carritoActualizado = prev
        .map((item) => {
          if (
            item.productoId === id &&
            item.pagadoConSaldo === pagadoConSaldo
          ) {
            let deltaFinal = delta;

            // 🛡️ BLINDAJE: Si intentan sumar cajas usando saldo virtual
            if (pagadoConSaldo && deltaFinal > 0) {
              const precio = getPrecioAplicado(item.productoInfo);
              const costeTotalDeseado = deltaFinal * precio;

              // Si lo que intenta añadir cuesta más del saldo que le queda...
              if (costeTotalDeseado > saldoRestante) {
                // Calculamos cuántas cajas SÍ puede permitirse con el saldo actual
                deltaFinal = Math.floor(saldoRestante / precio);

                // Si no le llega ni para una caja, cancelamos la acción
                if (deltaFinal <= 0) return item;
              }
            }

            const newQ = Math.max(0, item.cantidad + deltaFinal);
            return {
              ...item,
              cantidad: newQ,
              bonificados: pagadoConSaldo ? 0 : calcularBonificados(newQ),
            };
          }
          return item;
        })
        .filter((i) => i.cantidad > 0);

      const nuevoTotalReal = carritoActualizado
        .filter((i) => !i.pagadoConSaldo)
        .reduce((s, i) => s + i.cantidad * getPrecioAplicado(i.productoInfo), 0);

      if (nuevoTotalReal < limiteMonedero) {
        return carritoActualizado.filter((i) => !i.pagadoConSaldo);
      }

      return carritoActualizado;
    });
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
        observaciones: observacionesPedido || null,
      };
      await pedidosService.crear(payload);
      alert(
        esAdmin ? "Pedido Proxy registrado." : "Pedido realizado con éxito.",
      );
      setCarrito([]);
      setObservacionesPedido("");
      if (!esAdmin) cargarDatos();
    } catch {
      alert("Error al procesar.");
    } finally {
      setEnviando(false);
    }
  };

  // --- MOTOR DE HISTORIAL ---

  const productosFiltrados = [...productos].sort((a, b) => {
    // Modo 1: Merchandising del Admin (campo `orden` del backend — tabla orden_por_defecto_producto)
    if (ordenProductos === "por_defecto") {
      return (a.orden ?? 999) - (b.orden ?? 999) || (a.nombreProducto || "").localeCompare(b.nombreProducto || "");
    }
    // Modo 2: Recomendados por histórico de compras de la farmacia
    if (ordenProductos === "recomendados") {
      const idxA = idsRecomendados.indexOf(a.id);
      const idxB = idsRecomendados.indexOf(b.id);
      if (idxA === -1 && idxB === -1) return (a.nombreProducto || "").localeCompare(b.nombreProducto || "");
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    }
    // Modo 3: Más Vendidos Global
    if (ordenProductos === "mas_vendidos") {
      const idxA = idsMasVendidos.indexOf(a.id);
      const idxB = idsMasVendidos.indexOf(b.id);
      if (idxA === -1 && idxB === -1) return (a.nombreProducto || "").localeCompare(b.nombreProducto || "");
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    }
    // Modo 4: Precio ascendente
    if (ordenProductos === "precio_asc") {
      return getPrecioAplicado(a) - getPrecioAplicado(b);
    }
    // Modo 5: Precio descendente
    if (ordenProductos === "precio_desc") {
      return getPrecioAplicado(b) - getPrecioAplicado(a);
    }
    // Modo 6: Z-A
    if (ordenProductos === "za") {
      return (b.nombreProducto || "").localeCompare(a.nombreProducto || "");
    }
    // Modo 7: Alfabético A-Z (por defecto del sort)
    return (a.nombreProducto || "").localeCompare(b.nombreProducto || "");
  });

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
    .filter((p) => {
      // Restricción de autoría para nutricionistas
      if (!esFarmacia && !esAdmin) {
        // Si el email aún no se ha cargado, no mostrar nada (seguridad)
        if (!miEmail) return false;
        // 1. La farmacia del pedido debe coincidir con la seleccionada
        const perteneceAFarmacia = p.farmaciaNombre === farmaciaActual?.nombre;
        // 2. El pedido debe haber sido creado por la nutricionista logueada
        const esMio = p.creadoPor === miEmail;
        return perteneceAFarmacia && esMio;
      }
      return true; // Admins y Farmacias siguen su flujo normal
    })
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
    productos: productosFiltrados,
    pedidosFiltrados,
    farmacias,
    farmaciaActual,
    esFarmacia,
    esAdmin,
    esNutricionista,
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
    limiteMonedero,
    setLimiteMonedero,
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
    ordenProductos,
    setOrdenProductos,
    observacionesPedido,
    setObservacionesPedido,
  };
};
