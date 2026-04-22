// Páginas
export { default as PedidosPage } from './pages/PedidosPage';
// (Nota: Si ya renombraste el archivo a PedidosPage.jsx, pon './pages/PedidosPage')

// Componentes expuestos (El Dashboard y Validaciones usan este modal)
export { default as ModalDetallePedido } from './components/ModalDetallePedido';

// Hooks y Servicios
export { usePedidos } from './hooks/usePedidos';
export { pedidosService } from './services/pedidosService';