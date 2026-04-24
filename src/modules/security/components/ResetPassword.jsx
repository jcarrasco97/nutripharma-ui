import React from "react";
import { Lock, XCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import logoUrl from "@/assets/logo.svg";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";
import { Item, ItemMedia, ItemContent } from "@/shared/components/ui/Item";

const ResetPassword = () => {
  const hook = useAuth();

  if (!hook.tokenReset) {
    return (
      <div className="flex justify-center mt-20 p-4">
        <Item className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-2 font-bold w-auto">
          <ItemMedia>
            <XCircle />
          </ItemMedia>
          <ItemContent>
            Enlace inválido o sin token de seguridad.
          </ItemContent>
        </Item>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#006633] to-[#68b54e] p-4 font-sans">

      <Card className="max-w-md w-full bg-surface rounded-3xl shadow-2xl overflow-hidden border-none p-0">

        <CardHeader className="pt-10 pb-4 text-center space-y-4">
          <img src={logoUrl} alt="Logo NutriPharma" className="h-16 w-auto mx-auto" />
          <div>
            <CardTitle className="text-2xl font-bold text-secondary tracking-tight">
              Nueva Contraseña
            </CardTitle>
            <CardDescription className="text-neutral/80 mt-2 text-sm font-medium px-4">
              Escribe tu nueva contraseña. Asegúrate de que ambas coincidan para poder acceder a tu perfil.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={hook.handleResetPassword} className="space-y-6">

            {hook.error && (
              <Item className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-bold justify-center mb-6">
                {hook.error}
              </Item>
            )}

            <Field>
              <FieldLabel className="block text-sm font-medium text-secondary mb-1">
                Nueva Contraseña
              </FieldLabel>
              <FieldContent className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral/40 group-focus-within:text-primary" />
                </div>
                <Input
                  type={hook.showPassword ? "text" : "password"}
                  required
                  value={hook.newPassword}
                  onChange={(e) => hook.setNewPassword(e.target.value)}
                  disabled={hook.cargando}
                  minLength={6}
                  className="block w-full pl-10 pr-10 py-3 border-neutral/10 rounded-xl focus:ring-primary transition-all disabled:bg-neutral/5"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => hook.setShowPassword(!hook.showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral/40 hover:text-primary transition-colors outline-none cursor-pointer"
                  tabIndex="-1"
                >
                  {hook.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="block text-sm font-medium text-secondary mb-1">
                Confirmar Nueva Contraseña
              </FieldLabel>
              <FieldContent className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral/40 group-focus-within:text-primary" />
                </div>
                <Input
                  type={hook.showConfirmPassword ? "text" : "password"}
                  required
                  value={hook.confirmPassword}
                  onChange={(e) => hook.setConfirmPassword(e.target.value)}
                  disabled={hook.cargando}
                  minLength={6}
                  onPaste={(e) => {
                    e.preventDefault();
                    alert("Por seguridad, no puedes pegar en este campo.");
                  }}
                  className="block w-full pl-10 pr-10 py-3 border-neutral/10 rounded-xl focus:ring-primary transition-all disabled:bg-neutral/5"
                  placeholder="Repite la contraseña"
                />
                <button
                  type="button"
                  onClick={() => hook.setShowConfirmPassword(!hook.showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral/40 hover:text-primary transition-colors outline-none cursor-pointer"
                  tabIndex="-1"
                >
                  {hook.showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </FieldContent>
            </Field>

            <Button
              type="submit"
              disabled={hook.cargando}
              isLoading={hook.cargando}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md shadow-primary/20 font-bold text-white bg-primary hover:bg-primary-hover transition-colors disabled:bg-primary/50 disabled:shadow-none mt-4"
            >
              {hook.cargando ? "Guardando..." : "Guardar contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;