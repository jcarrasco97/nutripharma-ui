import React from "react";
import {
  Lock,
  User,
  ArrowRight,
  Mail,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import logoUrl from "@/assets/logo.svg";

import { Card, CardHeader, CardContent } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";
import { Item } from "@/shared/components/ui/Item";

const Login = () => {
  const hook = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#006633] to-[#68b54e] p-4 font-sans">

      <Card className="max-w-md w-full bg-surface rounded-3xl shadow-2xl overflow-hidden border-none p-0">

        <CardHeader className="pt-10 pb-4 text-center space-y-4">
          <img src={logoUrl} alt="Logo NutriPharma" className="h-16 w-auto mx-auto" />

          <div>
            <h2 className="text-2xl font-bold text-secondary tracking-tight">
              {hook.vistaRecuperar ? "Recuperación de Acceso" : "Bienvenido a Nutripharma"}
            </h2>
            <p className="text-neutral/80 mt-2 text-sm font-medium px-4">
              {hook.vistaRecuperar
                ? "Introduce tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña."
                : "Introduce tu correo para acceder a tu perfil."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          {hook.mensajeExito && (
            <Item className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm text-center font-bold mb-6 justify-center">
              {hook.mensajeExito}
            </Item>
          )}
          {hook.error && (
            <Item className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-bold mb-6 justify-center">
              {hook.error}
            </Item>
          )}

          {/* VISTA: RECUPERAR CONTRASEÑA */}
          {hook.vistaRecuperar ? (
            <form onSubmit={hook.handlePedirRecuperacion} className="space-y-6">
              <Field>
                <FieldContent className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral/40 group-focus-within:text-primary" />
                  </div>
                  <Input
                    type="email"
                    required
                    value={hook.emailRecuperacion}
                    onChange={(e) => hook.setEmailRecuperacion(e.target.value)}
                    disabled={hook.cargando}
                    className="block w-full pl-10 pr-3 py-3 border-neutral/10 rounded-xl focus:ring-primary transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </FieldContent>
              </Field>

              {/* Contenedor de botones agrupados para un espaciado más natural */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={hook.cargando}
                  isLoading={hook.cargando}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md shadow-primary/20 font-bold text-white bg-primary hover:bg-primary-hover transition-colors disabled:bg-primary/50"
                >
                  {!hook.cargando && "Enviar enlace"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    hook.setVistaRecuperar(false);
                    hook.setError("");
                  }}
                  className="w-full text-sm font-bold text-neutral/60 hover:text-primary text-center transition-colors h-auto py-2"
                >
                  Volver al Login
                </Button>
              </div>
            </form>
          ) : (
            /* VISTA: LOGIN NORMAL */
            <form onSubmit={hook.handleLogin} className="space-y-6">
              <Field>
                <FieldLabel className="block text-sm font-medium text-secondary mb-2">
                  Correo electrónico
                </FieldLabel>
                <FieldContent className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral/40 group-focus-within:text-primary" />
                  </div>
                  <Input
                    type="email"
                    name="username"
                    required
                    value={hook.credenciales.username}
                    onChange={hook.handleChange}
                    disabled={hook.cargando}
                    className="block w-full pl-10 pr-3 py-3 border-neutral/10 rounded-xl focus:ring-primary disabled:bg-neutral/5 transition-all"
                    placeholder="ejemplo@nutripharma.com"
                  />
                </FieldContent>
              </Field>

              <Field>
                <div className="flex justify-between items-center mb-2">
                  <FieldLabel className="block text-sm font-medium text-secondary">
                    Contraseña
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => hook.setVistaRecuperar(true)}
                    className="text-xs font-bold text-primary hover:text-primary-hover transition-colors p-0 h-auto"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
                <FieldContent className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral/40 group-focus-within:text-primary" />
                  </div>
                  <Input
                    type={hook.showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={hook.credenciales.password}
                    onChange={hook.handleChange}
                    disabled={hook.cargando}
                    className="block w-full pl-10 pr-10 py-3 border-neutral/10 rounded-xl focus:ring-primary transition-all disabled:bg-neutral/5"
                    placeholder="••••••••"
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

              <Button
                type="submit"
                disabled={hook.cargando}
                isLoading={hook.cargando}
                className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-hover transition-colors mt-4 disabled:bg-primary/50 disabled:shadow-none"
              >
                {!hook.cargando && (
                  <>
                    <ArrowRight className="mr-2 h-5 w-5" /> Iniciar Sesión
                  </>
                )}
                {hook.cargando && "Conectando..."}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;