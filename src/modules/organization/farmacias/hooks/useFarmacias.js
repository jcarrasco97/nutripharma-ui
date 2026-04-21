import { useState, useCallback } from "react";
import { farmaciaService } from "../services/farmaciaService";

export const useFarmacias = () => {
    const [farmacias, setFarmacias] = useState([]);
    const [farmaciasBajas, setFarmaciasBajas] = useState([]);
    const [cargandoFarmacias, setCargandoFarmacias] = useState(true);

    const cargarFarmacias = useCallback(async () => {
        setCargandoFarmacias(true);
        try {
            const [activas, bajas] = await Promise.all([
                farmaciaService.listarTodas(),
                farmaciaService.listarBajas()
            ]);
            setFarmacias(activas);
            setFarmaciasBajas(bajas);
        } catch (error) {
            console.error("Error al cargar farmacias:", error);
        } finally {
            setCargandoFarmacias(false);
        }
    }, []);

    const eliminarFarmacia = async (id) => {
        if (!window.confirm("¿Dar de baja esta farmacia?")) return;
        try {
            await farmaciaService.eliminar(id);
            await cargarFarmacias();
            return true;
        } catch (error) {
            console.error("Error al eliminar farmacia:", error);
            alert(error.response?.data?.message || "Error al eliminar.");
            return false;
        }
    };

    const restaurarFarmacia = async (id) => {
        if (!window.confirm("¿Restaurar esta farmacia?")) return;
        try {
            await farmaciaService.restaurar(id);
            await cargarFarmacias();
            return true;
        } catch (error) {
            console.error("Error al restaurar farmacia:", error);
            alert("Error al restaurar.");
            return false;
        }
    };

    return {
        farmacias,
        farmaciasBajas,
        cargandoFarmacias,
        cargarFarmacias,
        eliminarFarmacia,
        restaurarFarmacia
    };
};