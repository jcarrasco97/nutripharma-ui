import React, { useState, useEffect } from "react";
import { Plus, Save, Eye, EyeOff, Shield, Store, Package, User, Car } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/shared/components/ui/Sheet";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Field, FieldLabel, FieldContent } from "@/shared/components/ui/Field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/Select";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { Label } from "@/shared/components/ui/Label";
import { ScrollArea } from "@/shared/components/ui/ScrollArea";
import { Separator } from "@/shared/components/ui/Separator";
import { Badge } from "@/shared/components/ui/Badge";

const SheetAdministracionForm = ({
  open,
  onOpenChange,
  pestana,
  itemEditando,
  setItemEditando,
  formData,
  setFormData,
  farmacias,
  enviando,
  handleCrear,
  handleActualizar,
  handleToggleFarmacia,
  handleCambiarKilometros,
  formDataAdmin,
  handleChangeAdmin,
  handleCrearAdmin,
  enviandoAdmin,
}) => {
  const modoEdicion = itemEditando !== null;
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirm, setMostrarConfirm] = useState(false);

  useEffect(() => {
    setConfirmPassword("");
    setMostrarPassword(false);
    setMostrarConfirm(false);
  }, [open, itemEditando?.id]);

  const passwordActual = modoEdicion
    ? itemEditando?.password || ""
    : formData?.password || "";

  const passwordMismatch =
    pestana !== "productos" && passwordActual && passwordActual !== confirmPassword;

  const formValido = () => {
    if (pestana !== "productos" && passwordActual && passwordActual !== confirmPassword)
      return false;
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!formValido()) return;
    if (modoEdicion) {
      handleActualizar(e, confirmPassword);
    } else if (pestana === "personal") {
      handleCrearAdmin(e);
    } else {
      handleCrear(e);
    }
  };

  const titulo = modoEdicion
    ? `Editar ${pestana === "nutricionistas" ? "Nutricionista" : pestana === "farmacias" ? "Farmacia" : "Producto"}`
    : `Crear ${pestana === "nutricionistas" ? "Nutricionista" : pestana === "farmacias" ? "Farmacia" : pestana === "productos" ? "Producto" : "Administrador"}`;

  const setField = (name, value) => {
    if (modoEdicion) {
      setItemEditando((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const current = modoEdicion ? itemEditando : formData;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">

        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-neutral/10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
              {pestana === "nutricionistas" && <User size={18} />}
              {pestana === "farmacias" && <Store size={18} />}
              {pestana === "productos" && <Package size={18} />}
              {pestana === "personal" && <Shield size={18} />}
            </div>
            <div>
              <SheetTitle className="text-base">{titulo}</SheetTitle>
              <SheetDescription>
                {modoEdicion ? "Modifica los campos y guarda los cambios." : "Completa el formulario para añadir un nuevo registro."}
              </SheetDescription>
            </div>
          </div>
          {modoEdicion && (
            <Badge className="w-fit bg-accent/20 text-primary border-none text-[10px] font-black uppercase mt-2">
              Modo Edición
            </Badge>
          )}
        </SheetHeader>

        {/* Body */}
        <ScrollArea className="flex-1 px-6">
          <form id="sheet-form" onSubmit={onSubmit} className="space-y-5 py-5">

            {/* ── PERSONAL INTERNO (SuperAdmin) ── */}
            {pestana === "personal" && (
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-neutral/50 uppercase tracking-widest">Credenciales</p>
                <Field>
                  <FieldLabel>Correo corporativo *</FieldLabel>
                  <FieldContent>
                    <Input type="email" name="email" value={formDataAdmin?.email || ""} onChange={handleChangeAdmin} required placeholder="correo@nutripharma.com" />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Contraseña *</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Input type={mostrarPassword ? "text" : "password"} name="password" value={formDataAdmin?.password || ""} onChange={handleChangeAdmin} required placeholder="Contraseña" className="pr-10" />
                      <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                        {mostrarPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Confirmar contraseña *</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Input type={mostrarConfirm ? "text" : "password"} name="confirmPassword" value={formDataAdmin?.confirmPassword || ""} onChange={handleChangeAdmin} onPaste={(e) => e.preventDefault()} required placeholder="Confirmar contraseña" className="pr-10" />
                      <button type="button" onClick={() => setMostrarConfirm(!mostrarConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                        {mostrarConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </FieldContent>
                </Field>
                <Separator />
                <p className="text-[11px] font-bold text-neutral/50 uppercase tracking-widest">Perfil</p>
                <Field>
                  <FieldLabel>Nombre *</FieldLabel>
                  <FieldContent><Input type="text" name="nombre" value={formDataAdmin?.nombre || ""} onChange={handleChangeAdmin} required placeholder="Nombre" /></FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Apellidos *</FieldLabel>
                  <FieldContent><Input type="text" name="apellidos" value={formDataAdmin?.apellidos || ""} onChange={handleChangeAdmin} required placeholder="Apellidos" /></FieldContent>
                </Field>
              </div>
            )}

            {/* ── CREDENCIALES (Nutris / Farmacias) ── */}
            {pestana !== "productos" && pestana !== "personal" && (
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-neutral/50 uppercase tracking-widest">Credenciales de acceso</p>
                <Field>
                  <FieldLabel>Email *</FieldLabel>
                  <FieldContent>
                    <Input type="email" value={current?.email || ""} onChange={(e) => setField("email", e.target.value)} required placeholder="Correo electrónico" />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>{modoEdicion ? "Nueva contraseña (vacío = sin cambios)" : "Contraseña *"}</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Input type={mostrarPassword ? "text" : "password"} value={current?.password || ""} onChange={(e) => setField("password", e.target.value)} required={!modoEdicion} placeholder={modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"} className="pr-10" />
                      <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                        {mostrarPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </FieldContent>
                </Field>
                {(!modoEdicion || current?.password) && (
                  <Field>
                    <FieldLabel>Confirmar contraseña *</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Input type={mostrarConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repetir contraseña" className={`pr-10 ${passwordMismatch ? "border-red-400" : ""}`} />
                        <button type="button" onClick={() => setMostrarConfirm(!mostrarConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                          {mostrarConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {passwordMismatch && <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden.</p>}
                    </FieldContent>
                  </Field>
                )}
                <Separator />
              </div>
            )}

            {/* ── NUTRICIONISTAS ── */}
            {pestana === "nutricionistas" && (
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-neutral/50 uppercase tracking-widest">Perfil laboral</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel>Nombre *</FieldLabel>
                    <FieldContent><Input type="text" value={current?.nombre || ""} onChange={(e) => setField("nombre", e.target.value)} required placeholder="Nombre" /></FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Apellidos *</FieldLabel>
                    <FieldContent><Input type="text" value={current?.apellidos || ""} onChange={(e) => setField("apellidos", e.target.value)} required placeholder="Apellidos" /></FieldContent>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Teléfono</FieldLabel>
                  <FieldContent><Input type="text" value={current?.telefono || ""} onChange={(e) => setField("telefono", e.target.value)} placeholder="Teléfono (Opcional)" /></FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Horas contrato mensual</FieldLabel>
                  <FieldContent><Input type="number" min="1" max="160" value={current?.horasContratoMensual || ""} onChange={(e) => setField("horasContratoMensual", e.target.value)} placeholder="Ej: 40" /></FieldContent>
                </Field>
                <Separator />
                <p className="text-[11px] font-bold text-neutral/50 uppercase tracking-widest">Asignación y distancia</p>
                <div className="space-y-2 max-h-52 overflow-y-auto border border-neutral/10 rounded-xl p-3 bg-neutral/5">
                  {farmacias.map((farmacia) => {
                    const asigs = current?.asignaciones || [];
                    const asig = asigs.find((a) => (a.farmaciaId || a.id) === farmacia.id);
                    const checked = !!asig;
                    return (
                      <div key={farmacia.id} className={`flex flex-col p-2 rounded-lg transition-colors ${checked ? "bg-accent/10 border border-accent/30" : "border border-transparent"}`}>
                        <div className="flex items-center gap-2">
                          <Checkbox id={`farm-${farmacia.id}`} checked={checked} onCheckedChange={() => handleToggleFarmacia(farmacia.id)} />
                          <Label htmlFor={`farm-${farmacia.id}`} className="text-sm font-semibold text-secondary cursor-pointer">{farmacia.nombre}</Label>
                        </div>
                        {checked && (
                          <div className="mt-2 pl-6 flex items-center gap-2">
                            <Car size={13} className="text-neutral/50" />
                            <Input type="number" min="0" value={asig.kilometros} onChange={(e) => handleCambiarKilometros(farmacia.id, e.target.value)} className="w-20 h-8 text-center text-sm" placeholder="Km" required />
                            <span className="text-xs font-bold text-primary">km totales</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {farmacias.length === 0 && (
                    <p className="text-xs text-neutral/50 text-center py-2">No hay farmacias disponibles.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── FARMACIAS ── */}
            {pestana === "farmacias" && (
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-neutral/50 uppercase tracking-widest">Datos de la farmacia</p>
                <Field>
                  <FieldLabel>Nombre *</FieldLabel>
                  <FieldContent><Input type="text" value={current?.nombre || ""} onChange={(e) => setField("nombre", e.target.value)} required placeholder="Nombre de la Farmacia" /></FieldContent>
                </Field>
                <Field>
                  <FieldLabel>CIF *</FieldLabel>
                  <FieldContent><Input type="text" value={current?.cif || ""} onChange={(e) => setField("cif", e.target.value)} required placeholder="CIF" /></FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Dirección *</FieldLabel>
                  <FieldContent><Input type="text" value={current?.direccion || ""} onChange={(e) => setField("direccion", e.target.value)} required placeholder="Dirección completa" /></FieldContent>
                </Field>
                <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/20 rounded-xl">
                  <Checkbox id="esProvinciaLocal" checked={current?.esProvinciaLocal ?? true} onCheckedChange={(v) => setField("esProvinciaLocal", v)} />
                  <Label htmlFor="esProvinciaLocal" className="font-semibold text-secondary cursor-pointer">Almería (PVF)</Label>
                </div>
                <Field>
                  <FieldLabel>Comisión (%) *</FieldLabel>
                  <FieldContent><Input type="number" min="0" max="100" step="0.1" value={current?.porcentajeComision || ""} onChange={(e) => setField("porcentajeComision", e.target.value)} required placeholder="Ej: 30" /></FieldContent>
                </Field>
              </div>
            )}

            {/* ── PRODUCTOS ── */}
            {pestana === "productos" && (
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-neutral/50 uppercase tracking-widest">Datos del producto</p>
                <Field>
                  <FieldLabel>Nombre del producto *</FieldLabel>
                  <FieldContent><Input type="text" value={current?.nombreProducto || ""} onChange={(e) => setField("nombreProducto", e.target.value)} required placeholder="Ej: Batido Vainilla" /></FieldContent>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel>Acrónimo *</FieldLabel>
                    <FieldContent><Input type="text" value={current?.acronimo || ""} onChange={(e) => setField("acronimo", e.target.value)} required placeholder="Acrónimo" /></FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Categoría *</FieldLabel>
                    <FieldContent>
                      <Select value={current?.categoria || "PEQUENO"} onValueChange={(v) => setField("categoria", v)}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PEQUENO">PEQUEÑO</SelectItem>
                          <SelectItem value="GRANDE">GRANDE</SelectItem>
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Referencia / SKU *</FieldLabel>
                  <FieldContent><Input type="text" value={current?.referencia || ""} onChange={(e) => setField("referencia", e.target.value)} required placeholder="Referencia / SKU" /></FieldContent>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel>PVF (€) *</FieldLabel>
                    <FieldContent><Input type="number" step="0.01" value={current?.pvf || ""} onChange={(e) => setField("pvf", e.target.value)} required placeholder="PVF" /></FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>PVP (€) *</FieldLabel>
                    <FieldContent><Input type="number" step="0.01" value={current?.pvp || ""} onChange={(e) => setField("pvp", e.target.value)} required placeholder="PVP" /></FieldContent>
                  </Field>
                </div>
              </div>
            )}

          </form>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 border-t border-neutral/10">
          <Button
            form="sheet-form"
            type="submit"
            disabled={enviando || enviandoAdmin || !formValido()}
            className="w-full bg-primary hover:bg-primary-hover text-surface font-bold"
          >
            {(enviando || enviandoAdmin) ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-surface/30 border-t-surface rounded-full" />
                Guardando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {modoEdicion ? <Save size={16} /> : <Plus size={16} />}
                {modoEdicion ? "Guardar Cambios" : "Registrar Datos"}
              </span>
            )}
          </Button>
        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
};

export default SheetAdministracionForm;
