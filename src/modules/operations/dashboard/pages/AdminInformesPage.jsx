import React from "react";
import { useDashboardAdmin } from "../hooks/useDashboardAdmin";
import ModalGeneradorInformes from "../components/admin/ModalGeneradorInformes";

const AdminInformesPage = () => {
  const hook = useDashboardAdmin();

  return (
    <ModalGeneradorInformes
      isOpen={true}
      onClose={() => {}}
      modoPagina={true}
      farmacias={hook.listadoFarmacias}
      nutricionistas={hook.listadoNutricionistas}
    />
  );
};

export default AdminInformesPage;
