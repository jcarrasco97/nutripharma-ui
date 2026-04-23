# 📊 Plan de Mejora: Dashboard Financiero y Visualización de KPIs

## 1. Contexto del Modelo de Negocio
NutriPharma opera bajo un modelo de **Fidelización de Bucle Cerrado**.

* **Ingresos:** Consultas (100% liquidez) + Pedidos (Parte liquidez, parte saldo virtual).
* **Pasivo (Deuda):** Saldo virtual generado por las farmacias en cada consulta.
* **Saneamiento:** Consumo de saldo virtual en pedidos (reduce la deuda de la empresa con la farmacia).

## 2. El Problema Actual (Discrepancia Semántica)
Actualmente, el sistema muestra tres números distintos para "Productos" porque mezcla:

* **Volumen Bruto (PVP):** Lo que el nutricionista "mueve".
* **Facturación Operativa (PVF):** Lo que la empresa factura legalmente.
* **Liquidez Real (Cashflow):** Lo que realmente entra en el banco (PVF menos Saldo Virtual).

## 3. Nuevos KPIs Estratégicos (Post-Refactorización UI)
Para que el Administrador gobierne la empresa, el Dashboard debe mostrar:

### A. Gráfica de Liquidez vs. Deuda (Financiera)
* **Liquidez Entrante:** (Suma de todas las consultas) + (Suma del importe pagado con "dinero real" en pedidos).
* **Deuda Generada:** Suma del saldo virtual que se ha acreditado a las farmacias ese mes.
* **Deuda Saneada:** Importe de pedidos pagados con saldo virtual.
* **Objetivo:** Vigilar que la Deuda Generada no supere crónicamente a la Saneada (Burbuja).

### B. Gráfica de Rendimiento Comercial (Ventas)
* **Volumen Total:** Suma del PVF total de todos los productos movidos.
* **Penetración de Mercado:** Comparativa de ventas entre provincias (Almería vs. Resto) aplicando los filtros de precio correspondientes.

### C. Margen Neto Operativo
* **Fórmula:** (Liquidez Entrante) - (Comisiones pagadas a Nutricionistas).

---

## 4. Hoja de Ruta Técnica

### Fase 1: Integración con Shadcn/ui
* Sustituir los componentes actuales por `Card`, `Tabs` y `Charts` de `shadcn`.
* Asegurar que el `Tooltip` de las gráficas sea descriptivo (ej: "Este mes se han limpiado 500€ de deuda virtual").

### Fase 2: Refactorización de DTOs (Backend)
* Modificar `FacturacionMensualDTO` para incluir campos específicos: `ingresosReales`, `ingresosVirtuales`, `saldoGenerado`.

### Fase 3: Lógica de Filtros
* Implementar un "Toggle" en la UI para alternar entre **Visión Comercial** y **Visión de Tesorería**.

---

## 5. El Prompt Maestro (Para implementar la mejora)
*Copia y pega este prompt cuando estés listo para que la IA escriba el código tras la actualización de la UI:*

> "Actúa como un Desarrollador Fullstack y Analista Financiero. Vamos a implementar la lógica de negocio final en mi Dashboard de NutriPharma basándonos en los componentes de `shadcn/ui` que ya tengo instalados.
> 
> **Lógica de negocio a aplicar:**
> 1. Las farmacias compran con un mix de Dinero Real y Saldo Virtual. Debemos usar la variable `pagadoConSaldo` de `LineaPedido` para diferenciar el Cashflow de la empresa del volumen de ventas.
> 2. Las consultas generan una deuda (Saldo Virtual) que debe visualizarse como 'Pasivo'.
> 
> **Tareas requeridas:**
> 1. Modifica `AdminGraficaFacturacion.jsx` para que use el componente de Gráficas de `shadcn` con dos series de datos apiladas: 'Dinero Real' y 'Saldo Virtual'.
> 2. Actualiza `ModalGeneradorInformes.jsx` para que el PDF desglose la facturación real (Base Imponible + IVA) de los descuentos por fidelidad (Saldo Virtual).
> 3. Crea una función en el frontend o backend que calcule el 'Margen Neto' restando las comisiones de las nutricionistas a la liquidez real.
> 
> Utiliza nombres de variables claros: `cashflowReal`, `volumenBruto`, `deudaSaneada`. No rompas la arquitectura de módulos actual."

---

### 💡 Consejo de Arquitecto:
Mientras terminas con `shadcn`, asegúrate de que todos tus servicios de backend devuelvan objetos consistentes. Si una función se llama `obtenerFacturacion`, asegúrate de que siempre especifique si es **Bruta** o **Neta** en el nombre del método (ej: `obtenerFacturacionNetaReal`). Esto evitará que volvamos a tener los problemas de inconsistencia de hoy.