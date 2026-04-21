// 1. React & Librerías Externas
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// 2. Iconos (Lucide React)
import {
    ActivityIcon,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronDown,
    FolderOpenIcon,
    HomeIcon,
    InfoIcon,
    KeyboardIcon,
    MailIcon,
    MenuIcon,
    MoreHorizontal,
    SearchIcon,
    SettingsIcon,
    UserIcon
} from "lucide-react";

// 3. Componentes UI del Sistema de Diseño (Ordenados alfabéticamente)
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../shared/components/ui/Accordion';
import { Alert, AlertTitle, AlertDescription } from '../../shared/components/ui/Alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../shared/components/ui/AlertDialog';
import { Avatar, AvatarFallback, AvatarImage } from '../../shared/components/ui/Avatar';
import { Badge } from '../../shared/components/ui/Badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../shared/components/ui/Breadcrumb';
import { Button } from '../../shared/components/ui/Button';
import { ButtonGroup, ButtonGroupSeparator } from "../../shared/components/ui/ButtonGroup";
import { Calendar } from '../../shared/components/ui/Calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../shared/components/ui/Card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../shared/components/ui/Carousel";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../../shared/components/ui/Chart";
import { Checkbox } from '../../shared/components/ui/Checkbox';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../shared/components/ui/Command';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../../shared/components/ui/ContextMenu';
import { DataTable } from '../../shared/components/ui/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../shared/components/ui/Dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../shared/components/ui/DropdownMenu';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../../shared/components/ui/Empty';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from '../../shared/components/ui/Field';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../shared/components/ui/HoverCard';
import { Input } from '../../shared/components/ui/Input';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../../shared/components/ui/InputGroup';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from '../../shared/components/ui/Item';
import { Label } from '../../shared/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '../../shared/components/ui/RadioGroup';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../shared/components/ui/Resizable';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '../../shared/components/ui/Select';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '../../shared/components/ui/Sheet';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '../../shared/components/ui/Sidebar';
import { Skeleton } from '../../shared/components/ui/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../shared/components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shared/components/ui/Tabs';
import { Textarea } from '../../shared/components/ui/Textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../shared/components/ui/Tooltip';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "../../shared/components/ui/NavigationMenu"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from "../../shared/components/ui/Pagination"
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription } from "../../shared/components/ui/Popover"
import { DatePicker } from "../../shared/components/ui/DatePicker"
import { Progress } from "../../shared/components/ui/Progress"
import { ScrollArea } from "../../shared/components/ui/ScrollArea"
import { Slider } from '../../shared/components/ui/Slider';
import { Switch } from '../../shared/components/ui/Switch';
import { toast } from "sonner";
import { Toggle } from '../../shared/components/ui/Toggle';
import { ToggleGroup, ToggleGroupItem } from '../../shared/components/ui/ToggleGroup';
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

const chartData = [
    { month: "Enero", desktop: 186, mobile: 80 },
    { month: "Febrero", desktop: 305, mobile: 200 },
    { month: "Marzo", desktop: 237, mobile: 120 },
    { month: "Abril", desktop: 73, mobile: 190 },
    { month: "Mayo", desktop: 209, mobile: 130 },
    { month: "Junio", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
}

const tableData = [
    { id: "728ed52f", importe: 150.50, estado: "Pendiente", nombre: "Farmacia Central" },
    { id: "489e1d42", importe: 250.00, estado: "Pagado", nombre: "Farmacia Norte" },
    { id: "9u12h321", importe: 85.25, estado: "Rechazado", nombre: "Farmacia Avenida" },
    { id: "82h1283j", importe: 420.00, estado: "Pagado", nombre: "Farmacia Sur" },
    { id: "123k12j3", importe: 50.00, estado: "Pendiente", nombre: "Farmacia Estación" },
];

// Subcomponente de cabecera limpio
const SortableHeader = ({ column, title }) => {
    const isSorted = column.getIsSorted();
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className="-ml-4"
        >
            {title}
            {isSorted === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
            ) : isSorted === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
            ) : <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
        </Button>
    );
};

// Subcomponente de celda de acción sin estilos de fuente/color ajenos al sistema
const ActionCell = ({ row }) => {
    const registro = row.original;
    const [openDialog, setOpenDialog] = React.useState(false);

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(registro.id)}>
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                        setOpenDialog(true);
                    }}>
                        Ver detalles
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalles del Registro</DialogTitle>
                    <DialogDescription>
                        Información completa de la operación.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right text-sm">ID:</span>
                        <span className="col-span-3 text-sm">{registro.id}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right text-sm">Cliente:</span>
                        <span className="col-span-3 text-sm">{registro.nombre}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right text-sm">Estado:</span>
                        <span className="col-span-3 text-sm">
                            <Badge variant={registro.estado === "Rechazado" ? "destructive" : "default"}>
                                {registro.estado}
                            </Badge>
                        </span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="text-right text-sm">Importe:</span>
                        <span className="col-span-3 text-sm">{registro.importe}</span>
                    </div>
                </div>
                <DialogFooter showCloseButton>
                    <Button onClick={() => setOpenDialog(false)}>Aceptar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const tableColumns = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Seleccionar todos"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Seleccionar fila"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "estado",
        header: ({ column }) => <SortableHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const estado = row.getValue("estado");
            // Se usa destructuración básica sobre variantes conocidas
            const variant = estado === "Rechazado" ? "destructive" : "default";
            return <Badge variant={variant}>{estado}</Badge>
        }
    },
    {
        accessorKey: "nombre",
        header: ({ column }) => <SortableHeader column={column} title="Email" />,
    },
    {
        accessorKey: "importe",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("importe"))
            // Se formatea sin tipografías hardcodeadas
            const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
            return <div className="text-right">{formatted}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ActionCell,
    },
];

export default function Playground() {
    const [date, setDate] = useState(new Date());
    const [codeError, setCodeError] = useState(false);
    const [openCommand, setOpenCommand] = useState(false);
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
                <div className="col-span-1 md:col-span-2 space-y-4">
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
                            {/* Ejemplo de DataTable Inteligente Completada */}
                            <DataTable
                                columns={tableColumns}
                                data={tableData}
                                searchKey="nombre"
                                searchPlaceholder="Filtrar por nombre..."
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* SECCIÓN 4: ACCORDION */}
                <Card>
                    <CardHeader>
                        <CardTitle>Accordion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full bg-white rounded-md border">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="px-4">¿Es accesible?</AccordionTrigger>
                                <AccordionContent className="px-4">
                                    Sí. Sigue el patrón WAI-ARIA.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-b-0">
                                <AccordionTrigger className="px-4">¿Está estilizado?</AccordionTrigger>
                                <AccordionContent className="px-4">
                                    Sí. Viene con estilos por defecto que puedes sobrescribir.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                {/* SECCIÓN 5: ALERTS */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alert</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertTitle>¡Atención!</AlertTitle>
                            <AlertDescription>
                                Tu sesión está a punto de expirar en 5 minutos.
                            </AlertDescription>
                        </Alert>
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                No se pudo conectar con el servidor.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* SECCIÓN 6: ALERT DIALOG */}
                <Card>
                    <CardHeader>
                        <CardTitle>AlertDialog</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Mostrar Dialog</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction>Continuar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardContent>
                </Card>

                {/* SECCIÓN 7: AVATAR */}
                <Card>
                    <CardHeader>
                        <CardTitle>Avatar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarFallback>US</AvatarFallback>
                        </Avatar>
                    </CardContent>
                </Card>

                {/* SECCIÓN 8: BREADCRUMB */}
                <Card>
                    <CardHeader>
                        <CardTitle>Breadcrumb</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">Componentes</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </CardContent>
                </Card>

                {/* SECCIÓN 9: BUTTON GROUP */}
                <Card>
                    <CardHeader>
                        <CardTitle>ButtonGroup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ButtonGroup>
                            <Button variant="outline">Izquierda</Button>
                            <ButtonGroupSeparator />
                            <Button variant="outline">Centro</Button>
                            <ButtonGroupSeparator />
                            <Button variant="outline">Derecha</Button>
                        </ButtonGroup>

                        <ButtonGroup orientation="vertical">
                            <Button variant="outline">Arriba</Button>
                            <ButtonGroupSeparator orientation="horizontal" />
                            <Button variant="outline">Medio</Button>
                            <ButtonGroupSeparator orientation="horizontal" />
                            <Button variant="outline">Abajo</Button>
                        </ButtonGroup>
                    </CardContent>
                </Card>

                {/* SECCIÓN 10: CALENDAR */}
                <Card>
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border bg-white"
                        />
                    </CardContent>
                </Card>

                {/* SECCIÓN 11: CAROUSEL */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Carousel</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center px-12 pb-8">
                        <Carousel className="w-full max-w-xs">
                            <CarouselContent>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6 bg-slate-100">
                                                    <span className="text-4xl font-semibold">Slider {index + 1}</span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </CardContent>
                </Card>

                {/* SECCIÓN 12: CHART */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Chart (Recharts)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* SECCIÓN 13: SELECT, DROPDOWN & TABS */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Navegación y Selección</CardTitle>
                        <CardDescription>Pestañas, Menús Desplegables y Selectores de datos.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* SELECT */}
                        <div className="space-y-2">
                            <Label>Asignar Farmacia</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una farmacia" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Zona Norte</SelectLabel>
                                        <SelectItem value="norte-1">Farmacia Central</SelectItem>
                                        <SelectItem value="norte-2">Farmacia Avenida</SelectItem>
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <SelectGroup>
                                        <SelectLabel>Zona Sur</SelectLabel>
                                        <SelectItem value="sur-1">Farmacia Plaza</SelectItem>
                                        <SelectItem value="sur-2">Farmacia Estación</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* DROPDOWN MENU */}
                        <div className="space-y-2 flex flex-col items-start">
                            <Label className="invisible">Acciones</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        Acciones de Fila <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    <DropdownMenuLabel>Gestión de Pedido</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                                    <DropdownMenuItem>Descargar Factura</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem variant="destructive">Cancelar Pedido</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* TABS */}
                        <div className="col-span-1 md:col-span-3 pt-4 border-t border-neutral/10">
                            <Tabs defaultValue="detalles" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 max-w-md">
                                    <TabsTrigger value="detalles">Detalles Generales</TabsTrigger>
                                    <TabsTrigger value="historial">Historial</TabsTrigger>
                                    <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
                                </TabsList>
                                <TabsContent value="detalles" className="p-4 bg-surface border border-neutral/10 rounded-xl mt-4">
                                    <h3 className="font-semibold text-secondary">Información del Cliente</h3>
                                    <p className="text-neutral/70 mt-1">Aquí se mostrarían los datos generales de la farmacia asociada al pedido actual.</p>
                                </TabsContent>
                                <TabsContent value="historial" className="p-4 bg-surface border border-neutral/10 rounded-xl mt-4">
                                    <h3 className="font-semibold text-secondary">Registro de Actividad</h3>
                                    <p className="text-neutral/70 mt-1">Línea de tiempo con los cambios de estado del pedido.</p>
                                </TabsContent>
                                <TabsContent value="ajustes" className="p-4 bg-surface border border-neutral/10 rounded-xl mt-4">
                                    <h3 className="font-semibold text-secondary">Configuración</h3>
                                    <p className="text-neutral/70 mt-1">Opciones de facturación y preferencias de notificación.</p>
                                </TabsContent>
                            </Tabs>
                        </div>

                    </CardContent>
                </Card>

                {/* SECCIÓN 14: PANELES, ÁREAS DE TEXTO Y TOOLTIPS */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Entradas Largas y Paneles Laterales</CardTitle>
                        <CardDescription>Textareas, Tooltips informativos y Sheets (Drawers).</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* TEXTAREA Y TOOLTIP */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="notas">Notas de Auditoría</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button type="button" className="text-neutral/50 hover:text-secondary transition-colors">
                                                <InfoIcon className="h-4 w-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Estas notas serán visibles para los administradores.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Textarea
                                id="notas"
                                placeholder="Escribe aquí los detalles o incidencias relacionadas con la farmacia..."
                                className="h-32"
                            />
                        </div>

                        {/* SHEET (PANEL LATERAL) */}
                        <div className="space-y-4 flex flex-col items-start justify-center p-6 border border-neutral/10 border-dashed rounded-2xl bg-neutral/5">
                            <p className="text-sm text-neutral/70 text-center mb-2">
                                Los paneles laterales (Sheets) son ideales para editar registros en tablas sin perder el contexto.
                            </p>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="secondary" className="w-full gap-2">
                                        <MenuIcon className="h-4 w-4" /> Abrir Panel de Edición
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <SheetHeader>
                                        <SheetTitle>Editar Perfil de Farmacia</SheetTitle>
                                        <SheetDescription>
                                            Actualiza los datos fiscales y de contacto. Haz clic en guardar cuando termines.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-4 p-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="farmacia-nombre">Nombre de la Farmacia</Label>
                                            <Input id="farmacia-nombre" defaultValue="Farmacia Centro Vida" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="farmacia-obs">Observaciones</Label>
                                            <Textarea id="farmacia-obs" defaultValue="Cliente VIP. Prioridad en envíos." />
                                        </div>
                                    </div>
                                    <SheetFooter>
                                        <SheetClose asChild>
                                            <Button variant="outline">Cancelar</Button>
                                        </SheetClose>
                                        <Button>Guardar Cambios</Button>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>

                    </CardContent>
                </Card>

                {/* SECCIÓN 15: CAMPOS AVANZADOS Y PANELES REDIMENSIONABLES */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Agrupación de Campos y Layouts Flexibles</CardTitle>
                        <CardDescription>Uso de FieldSets, RadioGroups y Paneles redimensionables.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                        {/* FIELDSETS & RADIO GROUP */}
                        <div className="space-y-6">
                            <FieldSet>
                                <FieldLegend>Configuración de Notificaciones</FieldLegend>
                                <FieldDescription>Selecciona cómo prefieres recibir las alertas de los pedidos.</FieldDescription>

                                <RadioGroup defaultValue="email" className="mt-4">
                                    <Field orientation="horizontal" className="items-center space-x-2">
                                        <RadioGroupItem value="email" id="r-email" />
                                        <FieldLabel htmlFor="r-email" className="font-normal cursor-pointer">
                                            Correo Electrónico
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal" className="items-center space-x-2">
                                        <RadioGroupItem value="sms" id="r-sms" />
                                        <FieldLabel htmlFor="r-sms" className="font-normal cursor-pointer">
                                            SMS al teléfono móvil
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal" className="items-center space-x-2">
                                        <RadioGroupItem value="none" id="r-none" />
                                        <FieldLabel htmlFor="r-none" className="font-normal cursor-pointer">
                                            No recibir notificaciones
                                        </FieldLabel>
                                    </Field>
                                </RadioGroup>
                            </FieldSet>
                            {/* CHECKBOX GROUP */}
                            <FieldSet>
                                <FieldLegend>Permisos de Acceso</FieldLegend>
                                <FieldDescription>Selecciona los módulos habilitados para este rol.</FieldDescription>

                                <div className="mt-4 space-y-3">
                                    <Field orientation="horizontal" className="items-center space-x-2">
                                        <Checkbox id="chk-facturacion" />
                                        <FieldLabel htmlFor="chk-facturacion" className="font-normal cursor-pointer">
                                            Módulo de Facturación
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal" className="items-center space-x-2">
                                        <Checkbox id="chk-inventario" defaultChecked />
                                        <FieldLabel htmlFor="chk-inventario" className="font-normal cursor-pointer">
                                            Módulo de Inventario (Por defecto)
                                        </FieldLabel>
                                    </Field>
                                    <Field orientation="horizontal" className="items-center space-x-2">
                                        <Checkbox id="chk-reportes" disabled />
                                        <FieldLabel htmlFor="chk-reportes" className="font-normal cursor-pointer text-neutral/50">
                                            Reportes Avanzados (Requiere plan superior)
                                        </FieldLabel>
                                    </Field>
                                </div>
                            </FieldSet>

                            {/* Separador visual opcional para que respire */}
                            <div className="h-px w-full bg-neutral/10 my-6"></div>

                            <FieldGroup>
                                <Field data-invalid={codeError}>
                                    <FieldLabel htmlFor="code">Código de Verificación</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id="code"
                                            placeholder="Escribe '1234' para quitar el error"
                                            aria-invalid={codeError}
                                            className={codeError ? "border-destructive focus-visible:ring-destructive/50" : ""}
                                            onChange={(e) => {
                                                // Si el input no está vacío y no es "1234", muestra error.
                                                setCodeError(e.target.value !== "1234" && e.target.value !== "")
                                            }}
                                        />
                                        {codeError && <FieldError>El código introducido no es válido.</FieldError>}
                                    </FieldContent>
                                </Field>
                            </FieldGroup>
                        </div>

                        {/* RESIZABLE PANELS */}
                        <div className="h-64 border border-neutral/10 rounded-2xl overflow-hidden bg-surface">
                            <ResizablePanelGroup direction="horizontal">
                                <ResizablePanel defaultSize={30} minSize={20}>
                                    <div className="flex h-full items-center justify-center p-6 bg-neutral/5">
                                        <span className="font-semibold text-secondary">Menú</span>
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle withHandle />
                                <ResizablePanel defaultSize={70}>
                                    <ResizablePanelGroup direction="vertical">
                                        <ResizablePanel defaultSize={75}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <span className="font-semibold text-secondary">Contenido Principal</span>
                                            </div>
                                        </ResizablePanel>
                                        <ResizableHandle />
                                        <ResizablePanel defaultSize={25} minSize={15}>
                                            <div className="flex h-full items-center justify-center p-6 bg-neutral/5 text-sm text-neutral/70">
                                                <span>Consola / Log</span>
                                            </div>
                                        </ResizablePanel>
                                    </ResizablePanelGroup>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </div>

                    </CardContent>
                </Card>

                {/* SECCIÓN 16: ECOSISTEMA AVANZADO (COMMAND, DIALOGS, SKELETON, SIDEBAR) */}
                <Card className="col-span-1 md:col-span-2 border-primary/20">
                    <CardHeader className="bg-primary/5 rounded-t-2xl">
                        <CardTitle className="text-primary">Ecosistema Complejo</CardTitle>
                        <CardDescription>Integración de Sidebar, Modal Dialogs, InputGroups, Skeletons y Command Palette.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-6">

                        {/* DIALOG & INPUT GROUP */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <Label>Modal Clásico (Dialog)</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-fit">Invitar Usuario</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Invitar al ERP</DialogTitle>
                                            <DialogDescription>
                                                Envía un enlace de acceso al nuevo empleado de la farmacia.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <Label className="mb-2 block">Correo Electrónico</Label>
                                            {/* Ejemplo de INPUT GROUP */}
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <MailIcon className="text-neutral/50" />
                                                </InputGroupAddon>
                                                <InputGroupInput placeholder="empleado@farmacia.com" />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>@</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </div>
                                        <DialogFooter showCloseButton>
                                            <Button>Enviar Invitación</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* SKELETONS */}
                            <div className="flex flex-col gap-2">
                                <Label>Estado de Carga (Skeleton)</Label>
                                <div className="flex items-center space-x-4 p-4 border border-neutral/10 rounded-2xl bg-surface">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-[200px]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MINI SIDEBAR & CONTEXT MENU */}
                        <div className="flex flex-col gap-2">
                            <Label>Mini Sidebar (Colapsable) & Context Menu</Label>

                            <ContextMenu>
                                <ContextMenuTrigger className="h-[300px] border border-neutral/20 rounded-2xl overflow-hidden bg-neutral/5 relative flex">

                                    {/* Sidebar contenido en su caja gracias al relative anterior */}
                                    <SidebarProvider defaultOpen={true} className="h-full w-full absolute inset-0">

                                        <Sidebar variant="sidebar" className="h-full border-r border-neutral/10">
                                            <SidebarContent>
                                                <SidebarGroup>
                                                    <SidebarGroupLabel>Navegación</SidebarGroupLabel>
                                                    <SidebarGroupContent>
                                                        <SidebarMenu>
                                                            <SidebarMenuItem>
                                                                <SidebarMenuButton isActive>
                                                                    <HomeIcon /> <span>Dashboard</span>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                            <SidebarMenuItem>
                                                                <SidebarMenuButton>
                                                                    <UserIcon /> <span>Directorio</span>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                            <SidebarMenuItem>
                                                                <SidebarMenuButton>
                                                                    <SettingsIcon /> <span>Ajustes</span>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        </SidebarMenu>
                                                    </SidebarGroupContent>
                                                </SidebarGroup>
                                            </SidebarContent>
                                        </Sidebar>

                                        {/* INSET: El área principal que convive con el Sidebar */}
                                        <SidebarInset className="flex-1 bg-surface flex flex-col">
                                            <header className="flex h-12 items-center border-b border-neutral/10 px-4">
                                                <SidebarTrigger /> {/* ¡AQUÍ ESTÁ EL BOTÓN MAGICO! */}
                                                <div className="w-px h-4 bg-neutral/20 mx-4" />
                                                <span className="text-sm font-semibold text-secondary">Área de Trabajo</span>
                                            </header>
                                            <main className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                                                <KeyboardIcon className="text-neutral/20 size-12 mb-2" />
                                                <p className="text-sm text-neutral/50 font-medium">Usa el botón superior izquierdo para contraer el menú.</p>
                                                <p className="text-xs text-neutral/40 mt-1">Sigue funcionando el clic derecho aquí.</p>
                                            </main>
                                        </SidebarInset>

                                    </SidebarProvider>

                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-48">
                                    <ContextMenuItem>Ver perfil</ContextMenuItem>
                                    <ContextMenuItem>Ajustes rápidos</ContextMenuItem>
                                    <ContextMenuItem variant="destructive">Cerrar Sesión</ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>

                            {/* COMMAND DIALOG */}
                            <div className="flex flex-col gap-2 mt-4 border-t border-neutral/10 pt-4">
                                <Label>Command Dialog (Modal interactivo)</Label>
                                <Button variant="secondary" className="w-full" onClick={() => setOpenCommand(true)}>
                                    <SearchIcon className="mr-2" /> Abrir Paleta de Comandos
                                </Button>

                                <CommandDialog open={openCommand} onOpenChange={setOpenCommand} title="Buscar">
                                    <CommandInput placeholder="Escribe un comando o busca..." />
                                    <CommandList>
                                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                                        <CommandGroup heading="Enlaces Rápidos">
                                            {/* Al hacer clic en un item, cerramos el modal */}
                                            <CommandItem onSelect={() => setOpenCommand(false)}>Ir a Pedidos Pendientes</CommandItem>
                                            <CommandItem onSelect={() => setOpenCommand(false)}>Crear nueva Factura</CommandItem>
                                            <CommandItem onSelect={() => setOpenCommand(false)}>Ajustes de Farmacia</CommandItem>
                                        </CommandGroup>
                                    </CommandList>
                                </CommandDialog>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* SECCIÓN 17: ESTADOS VACÍOS, LISTAS GENÉRICAS Y HOVER CARDS */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Listas y Estados Visuales</CardTitle>
                        <CardDescription>Presentación de elementos (Item), ayudas contextuales (HoverCard) y estados sin contenido (Empty).</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* EMPTY & HOVER CARD */}
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Label>Estado Vacío (Empty State)</Label>
                                    <HoverCard>
                                        <HoverCardTrigger asChild>
                                            <button className="text-neutral/50 hover:text-neutral">
                                                <InfoIcon className="h-4 w-4" />
                                            </button>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                            <div className="flex justify-between space-x-4">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-medium">¿Cuándo usar este estado?</h4>
                                                    <p className="text-sm text-neutral/70">
                                                        Utiliza el componente Empty cuando una tabla, un listado de facturas o resultados de búsqueda no devuelvan ningún dato.
                                                    </p>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                                <div className="border border-neutral/10 rounded-2xl p-4 bg-neutral/5">
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <FolderOpenIcon />
                                            </EmptyMedia>
                                            <EmptyTitle>No hay archivos</EmptyTitle>
                                            <EmptyDescription>
                                                Aún no se ha subido ningún documento a esta carpeta.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                        <EmptyContent>
                                            <Button variant="outline" size="sm">Subir archivo</Button>
                                        </EmptyContent>
                                    </Empty>
                                </div>
                            </div>
                        </div>

                        {/* ITEMS GROUP */}
                        <div className="flex flex-col gap-2">
                            <Label>Listado Genérico (Item Group)</Label>
                            <div className="border border-neutral/10 rounded-2xl p-4">
                                <ItemGroup>
                                    <Item variant="muted">
                                        <ItemMedia variant="icon">
                                            <ActivityIcon className="text-neutral/70" />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle>Auditoría Finalizada</ItemTitle>
                                            <ItemDescription>Se ha generado el informe mensual de la Farmacia Centro Vida.</ItemDescription>
                                        </ItemContent>
                                    </Item>

                                    <ItemSeparator />

                                    <Item variant="outline">
                                        <ItemMedia variant="icon">
                                            <ActivityIcon className="text-neutral/70" />
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle>Nuevo Pedido Recibido</ItemTitle>
                                            <ItemDescription>Pedido #82h1283j - Importe: 420.00€</ItemDescription>
                                        </ItemContent>
                                    </Item>
                                </ItemGroup>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* SECCIÓN 18: MENÚS Y NAVEGACIÓN */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Navegación y Popovers</CardTitle>
                        <CardDescription>Menús complejos, paginación y ventanas emergentes contextuales.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-12">
                        <div className="flex flex-col gap-4">
                            <Label>Menú de Navegación</Label>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                <li>
                                                    <NavigationMenuLink href="#">
                                                        <div className="text-sm font-medium leading-none">Documentación</div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-neutral/70">Guías técnicas para el uso del ERP.</p>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink href="#">
                                                        <div className="text-sm font-medium leading-none">Soporte</div>
                                                        <p className="line-clamp-2 text-sm leading-snug text-neutral/70">Contacta con el equipo de asistencia.</p>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink href="#" className="px-4 py-2">Acerca de</NavigationMenuLink>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <Label>Popover Informativo</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline">Ver Configuración</Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverHeader>
                                            <PopoverTitle>Ajustes de Vista</PopoverTitle>
                                            <PopoverDescription>Configura los parámetros de visualización de la tabla.</PopoverDescription>
                                        </PopoverHeader>
                                        <div className="grid gap-2 pt-2">
                                            <div className="flex items-center gap-2">
                                                <Checkbox id="pop-1" />
                                                <label htmlFor="pop-1" className="text-sm">Mostrar inactivos</label>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Label>Paginación</Label>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious href="#" />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#" isActive>2</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext href="#" />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* SECCIÓN 19: CONTROL DE FECHAS, PROGRESO Y ÁREAS DINÁMICAS */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Controles de Estado y Scroll</CardTitle>
                        <CardDescription>Gestión de tiempos, indicadores de carga y contenedores con scroll interactivo en ambos ejes.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* DATE PICKER */}
                        <div className="flex flex-col gap-4">
                            <Label>Selector de Fecha de Auditoría</Label>
                            <DatePicker
                                date={date}
                                setDate={setDate}
                                placeholder="Elegir día de revisión"
                            />
                        </div>

                        {/* PROGRESS BARS */}
                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <Label>Progreso de Facturación (75%)</Label>
                                <Progress value={75} />
                            </div>
                        </div>

                        {/* SCROLL AREA CON DOBLE EJE */}
                        <div className="flex flex-col gap-2">
                            <Label>Registro de Actividad Detallado</Label>
                            <ScrollArea className="h-40 w-full rounded-xl border border-neutral/10 bg-neutral/5">
                                <div className="p-4 w-[600px]"> {/* Ancho fijo para forzar scroll horizontal */}
                                    <div className="space-y-4">
                                        <div className="text-sm whitespace-nowrap">
                                            <span className="font-semibold text-primary">10:30</span> - <Badge variant="outline" className="mr-2">SISTEMA</Badge> Pedido #123 procesado para Farmacia Central con un importe total de 1.250,00€ y validación de saldo pendiente.
                                        </div>
                                        <div className="text-sm whitespace-nowrap">
                                            <span className="font-semibold text-primary">09:15</span> - <Badge variant="outline" className="mr-2">FACTURACIÓN</Badge> Factura #F-2026-004 enviada por correo electrónico a farmacia.norte@ejemplo.com con adjuntos de auditoría.
                                        </div>
                                        <div className="text-sm whitespace-nowrap">
                                            <span className="font-semibold text-primary">08:00</span> - <Badge variant="outline" className="mr-2">SEGURIDAD</Badge> Apertura de caja realizada por el usuario administrador desde la terminal P03 en la oficina principal.
                                        </div>
                                        <div className="text-sm whitespace-nowrap">
                                            <span className="font-semibold text-primary">07:45</span> - <Badge variant="outline" className="mr-2">SISTEMA</Badge> Backup del sistema completado con éxito en el servidor secundario de redundancia externa.
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>

                    </CardContent>
                </Card>
                {/* SECCIÓN 20: SELECTORES DESLIZANTES Y CONMUTADORES */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Entradas de Control</CardTitle>
                        <CardDescription>Ajustes de rango (Slider), interruptores (Switch) y notificaciones (Toast).</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* SLIDER: Ajustado con padding para visibilidad de Thumbs */}
                        <div className="flex flex-col gap-6 justify-center">
                            <div className="space-y-4">
                                <Label className="text-secondary">Umbral de Bonificación (Rango)</Label>
                                <div className="py-4">
                                    <Slider defaultValue={[20, 80]} step={1} />
                                </div>
                                <div className="flex justify-between items-center text-xs text-neutral/70 font-semibold">
                                    <span>Min: 20€</span>
                                    <span>Max: 80€</span>
                                </div>
                            </div>
                        </div>

                        {/* SWITCH & TOAST */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between p-5 border border-neutral/10 rounded-2xl bg-neutral/5">
                                <div className="space-y-1">
                                    <Label htmlFor="airplane-mode" className="cursor-pointer font-bold text-secondary">
                                        Modo Proxy Administrativo
                                    </Label>
                                    <p className="text-xs text-neutral/70 leading-relaxed">
                                        Permite realizar acciones en nombre de la farmacia.
                                    </p>
                                </div>
                                <Switch
                                    id="airplane-mode"
                                    onCheckedChange={(checked) => {
                                        if (checked) toast.success("Modo Proxy activado correctamente");
                                        else toast.info("Modo Proxy desactivado");
                                    }}
                                />
                            </div>

                            <Button
                                variant="outline"
                                className="w-full h-11 border-neutral/10 hover:bg-neutral/5 font-semibold"
                                onClick={() => toast.error("Error al sincronizar con el almacén central")}
                            >
                                Probar Notificación de Error
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* SECCIÓN 21: BOTONES DE ACTIVACIÓN (TOGGLE) */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Botones de Activación</CardTitle>
                        <CardDescription>Estados binarios y grupos de selección múltiple/única.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* INDIVIDUAL TOGGLES */}
                        <div className="flex flex-col gap-4">
                            <Label>Botones Individuales</Label>
                            <div className="flex flex-wrap gap-4 p-4 border border-neutral/10 rounded-2xl bg-neutral/5">
                                <Toggle aria-label="Toggle bold">
                                    <BoldIcon />
                                </Toggle>
                                <Toggle variant="outline" aria-label="Toggle italic">
                                    <ItalicIcon />
                                </Toggle>
                            </div>
                        </div>

                        {/* TOGGLE GROUP */}
                        <div className="flex flex-col gap-4">
                            <Label>Grupos de Formato (Múltiple)</Label>
                            <div className="flex flex-wrap gap-4 p-4 border border-neutral/10 rounded-2xl bg-surface">
                                <ToggleGroup type="multiple" variant="outline" spacing={0}>
                                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                                        <BoldIcon />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                                        <ItalicIcon />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="underline" aria-label="Toggle underline">
                                        <UnderlineIcon />
                                    </ToggleGroupItem>
                                </ToggleGroup>

                                <ToggleGroup type="single" variant="default" spacing={4}>
                                    <ToggleGroupItem value="b" className="w-8">B</ToggleGroupItem>
                                    <ToggleGroupItem value="i" className="w-8">I</ToggleGroupItem>
                                    <ToggleGroupItem value="u" className="w-8">U</ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}