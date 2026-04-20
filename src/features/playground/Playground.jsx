import React from 'react';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Label } from '../../shared/components/ui/Label';
import { Badge } from '../../shared/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../shared/components/ui/Table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../shared/components/ui/Card';

export default function Playground() {
    return (
        <div className="p-10 space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-black mb-4 text-[#062e3a]">Laboratorio de Componentes UI</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* SECCIÓN 1: BOTONES */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Botones Corporativos</CardTitle>
                            <CardDescription>Variantes y tamaños del sistema de diseño.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <Button variant="default">Guardar Cambios</Button>
                                <Button variant="secondary">Acción Secundaria</Button>
                                <Button variant="accent">Promoción</Button>
                            </div>
                            <div className="flex flex-wrap gap-4 border-t pt-4">
                                <Button variant="outline">Cancelar</Button>
                                <Button variant="ghost">Solo Texto</Button>
                                <Button variant="link">Enlace web</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* SECCIÓN 2: FORMULARIO TIPO SHADCN */}
                <div>
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Iniciar Sesión</CardTitle>
                            <CardDescription>
                                Introduce tu correo para acceder al portal de NutriPharma.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="flex flex-col gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Correo electrónico</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@ejemplo.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">Contraseña</Label>
                                            <a href="#" className="text-xs text-[#367933] font-medium hover:underline">
                                                ¿Olvidaste tu contraseña?
                                            </a>
                                        </div>
                                        <Input id="password" type="password" required />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-3">
                            <Button type="button" className="w-full">Acceder al ERP</Button>
                            <Button variant="outline" className="w-full">Volver atrás</Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* SECCIÓN 3: DATA DISPLAY (BADGES Y TABLAS) */}
                <div className="col-span-1 md:col-span-2 space-y-4 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estados y Tablas (Data Display)</CardTitle>
                            <CardDescription>Componentes para mostrar información de auditoría o listados.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            {/* Ejemplo de Badges */}
                            <div className="flex flex-wrap gap-3 pb-4 border-b border-gray-100">
                                <Badge variant="default">Completado</Badge>
                                <Badge variant="secondary">En Revisión</Badge>
                                <Badge variant="accent">Nuevo</Badge>
                                <Badge variant="outline">Borrador</Badge>
                                <Badge variant="success">Validado</Badge>
                                <Badge variant="warning">Pendiente</Badge>
                                <Badge variant="destructive">Rechazado</Badge>
                            </div>

                            {/* Ejemplo de Tabla */}
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ID Factura</TableHead>
                                        <TableHead>Farmacia</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Importe</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">INV001</TableCell>
                                        <TableCell>Farmacia Centro</TableCell>
                                        <TableCell><Badge variant="success">Pagado</Badge></TableCell>
                                        <TableCell className="text-right font-medium">€250.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">INV002</TableCell>
                                        <TableCell>Farmacia Norte</TableCell>
                                        <TableCell><Badge variant="warning">Pendiente</Badge></TableCell>
                                        <TableCell className="text-right font-medium">€150.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">INV003</TableCell>
                                        <TableCell>Farmacia Sur</TableCell>
                                        <TableCell><Badge variant="destructive">Rechazado</Badge></TableCell>
                                        <TableCell className="text-right font-medium">€350.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}