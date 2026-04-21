import React, { useState } from "react";
import { Plus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../../shared/components/ui/Button";
import { Input } from "../../../../shared/components/ui/Input";

const FormularioAdmin = ({ formData, handleChange, handleCrear, enviando }) => {
  // Estados locales para controlar la visibilidad de las contraseñas
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

  return (
    <div className="bg-surface rounded-3xl border border-gray-100 p-6 shadow-sm h-fit xl:sticky xl:top-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="bg-accent/20 p-2 rounded-xl">
          <Plus size={20} className="text-primary" />
        </div>
        <h3 className="text-lg font-black text-secondary">Dar de Alta Admin</h3>
      </div>

      <form onSubmit={handleCrear} className="space-y-4">
        {/* CORREO CORPORATIVO */}
        <Input
          icon={Mail}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Correo corporativo"
        />

        {/* CONTRASEÑA */}
        <div className="relative">
          <Input
            icon={Lock}
            type={mostrarPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Contraseña"
            // Añadimos pr-11 para que el texto no se pise con el icono del ojo
            inputClassName="pr-11"
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
            title={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div className="relative">
          <Input
            icon={Lock}
            type={mostrarConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword || ""} // Aseguramos que no rompa si el padre aún no tiene el campo
            onChange={handleChange}
            onPaste={(e) => e.preventDefault()} // 👈 Bloquea copiar y pegar
            required
            placeholder="Confirmar Contraseña"
            inputClassName="pr-11"
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
            title={
              mostrarConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"
            }
          >
            {mostrarConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* NOMBRE */}
        <Input
          icon={User}
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          placeholder="Nombre"
        />

        {/* APELLIDOS */}
        <Input
          icon={User}
          type="text"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          required
          placeholder="Apellidos"
        />

        {/* BOTÓN DE ENVÍO */}
        <Button
          type="submit"
          variant="primary"
          isLoading={enviando}
          className="w-full mt-6"
        >
          Generar Credenciales
        </Button>
      </form>
    </div>
  );
};

export default FormularioAdmin;
