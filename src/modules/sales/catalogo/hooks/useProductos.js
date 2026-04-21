import { useState, useCallback } from "react";
import { productosService } from "../services/productosService";

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productosBajas, setProductosBajas] = useState([]);
    const [cargandoProductos, setCargandoProductos] = useState(true);

    const cargarProductos = useCallback(async () => {
        setCargandoProductos(true);
        try {
            const [activos, bajas] = await Promise.all([
                productosService.listarTodos(),
                productosService.listarBajas()
            ]);
            setProductos(activos);
            setProductosBajas(bajas);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        } finally {
            setCargandoProductos(false);
        }
    }, []);

    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Dar de baja este producto?")) return false;
        try {
            await productosService.eliminar(id);
            await cargarProductos();
            return true;
        } catch (error) {
            console.error("Error al dar de baja producto:", error);
            alert("Error al dar de baja.");
            return false;
        }
    };

    const restaurarProducto = async (id) => {
        if (!window.confirm("¿Restaurar este producto?")) return false;
        try {
            await productosService.restaurar(id);
            await cargarProductos();
            return true;
        } catch (error) {
            console.error("Error al restaurar producto:", error);
            alert("Error al restaurar.");
            return false;
        }
    };

    const toggleStockProducto = async (id) => {
        try {
            await productosService.toggleStock(id);
            await cargarProductos();
            return true;
        } catch (error) {
            console.error("Error al cambiar stock:", error);
            alert("Error al cambiar el estado de stock.");
            return false;
        }
    };

    return {
        productos,
        productosBajas,
        cargandoProductos,
        cargarProductos,
        eliminarProducto,
        restaurarProducto,
        toggleStockProducto
    };
};