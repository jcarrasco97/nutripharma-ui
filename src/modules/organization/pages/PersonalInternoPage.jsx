import React from "react";
import { Shield } from "lucide-react";
// Importamos todo desde la "puerta" del submódulo personal:
import {
  usePersonalInterno,
  FormularioAdmin,
  ListadoAdmins,
  ArchivoBajasAdmins,
} from "@/modules/organization/personal";

const PersonalInternoPage = () => {
  const hook = usePersonalInterno();

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* CABECERA */}
      <div className="bg-gradient-to-r from-[#062e3a] to-[#342c1e] p-8 rounded-[2.5rem] shadow-lg text-white flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="bg-white/10 p-4 rounded-3xl shadow-inner backdrop-blur-sm">
          <Shield size={40} className="text-[#bed000]" />
        </div>
        <div>
          <h2 className="text-3xl font-black">Centro de Mando (SuperAdmin)</h2>
          <p className="text-white/80 font-medium mt-2">
            Gestión exclusiva de credenciales con privilegios globales. Los
            usuarios aquí listados tienen acceso total a la plataforma.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: LISTAS */}
        <div className="xl:col-span-2 space-y-6">
          <ListadoAdmins
            admins={hook.admins}
            cargando={hook.cargando}
            handleEliminar={hook.handleEliminar}
          />
          <ArchivoBajasAdmins
            mostrarBajas={hook.mostrarBajas}
            setMostrarBajas={hook.setMostrarBajas}
            adminsBajas={hook.adminsBajas}
            handleRestaurar={hook.handleRestaurar}
          />
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <FormularioAdmin
          formData={hook.formData}
          handleChange={hook.handleChange}
          handleCrear={hook.handleCrear}
          enviando={hook.enviando}
        />
      </div>
    </div>
  );
};

export default PersonalInternoPage;
