import { useState, useCallback } from "react";
import { nutricionistasService } from "../services/nutricionistasService";

export const useNutricionistas = () => {
    const [nutricionistas, setNutricionistas] = useState([]);
    const [nutricionistasBajas, setNutricionistasBajas] = useState([]);
    const [cargandoNutricionistas, setCargandoNutricionistas] = useState(true);

    const cargarNutricionistas = useCallback(async () => {
        setCargandoNutricionistas(true);
        try {
            const [activas, bajas] = await Promise.all([
                nutricionistasService.listarTodas(),
                nutricionistasService.listarBajas()
            ]);
            setNutricionistas(activas);
            setNutricionistasBajas(bajas);
        } catch (error) {
            console.error("Error al cargar nutricionistas:", error);
        } finally {
            setCargandoNutricionistas(false);
        }
    }, []);

    const eliminarNutricionista = async (id) => {
        if (!window.confirm("¿Dar de baja a esta nutricionista?")) return false;
        try {
            await nutricionistasService.eliminar(id);
            await cargarNutricionistas();
            return true;
        } catch (error) {
            console.error("Error al dar de baja nutricionista:", error);
            alert(error.response?.data?.message || "Error al dar de baja.");
            return false;
        }
    };

    const restaurarNutricionista = async (id) => {
        if (!window.confirm("¿Restaurar a esta nutricionista?")) return false;
        try {
            await nutricionistasService.restaurar(id);
            await cargarNutricionistas();
            return true;
        } catch (error) {
            console.error("Error al restaurar nutricionista:", error);
            alert("Error al restaurar.");
            return false;
        }
    };

    return {
        nutricionistas,
        nutricionistasBajas,
        cargandoNutricionistas,
        cargarNutricionistas,
        eliminarNutricionista,
        restaurarNutricionista
    };
};