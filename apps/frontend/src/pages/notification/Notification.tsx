"use client"

import { useEffect, useState } from "react"
import { Settings, Plus, Pencil, Trash2, Send, Clock, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock reminder configurations
const mockReminderConfigs = [
    {
        id: 1,
        name: "Primer Recordatorio",
        daysBeforeExpiry: 7,
        isActive: true,
        subject: "Recordatorio: Tu mensualidad vence pronto",
        message:
            "Hola {nombre}, te recordamos que tu mensualidad del gimnasio vence el {fecha_vencimiento}. Por favor, realiza tu pago a tiempo para evitar interrupciones en tu acceso.",
    },
    {
        id: 2,
        name: "Segundo Recordatorio",
        daysBeforeExpiry: 3,
        isActive: true,
        subject: "Urgente: Tu mensualidad vence en 3 días",
        message:
            "Hola {nombre}, tu mensualidad vence el {fecha_vencimiento}. Te pedimos que realices tu pago lo antes posible para mantener tu acceso al gimnasio.",
    },
    {
        id: 3,
        name: "Recordatorio de Vencimiento",
        daysBeforeExpiry: 0,
        isActive: false,
        subject: "Tu mensualidad ha vencido",
        message:
            "Hola {nombre}, tu mensualidad venció el {fecha_vencimiento}. Por favor, realiza tu pago para reactivar tu acceso al gimnasio.",
    },
]

// Mock reminder history
const mockReminderHistory = [
    {
        id: 1,
        clientName: "Carlos Rodríguez",
        email: "carlos@example.com",
        reminderType: "Primer Recordatorio",
        sentDate: "2025-01-28",
        sentTime: "09:30",
        status: "Enviado",
    },
    {
        id: 2,
        clientName: "María González",
        email: "maria@example.com",
        reminderType: "Segundo Recordatorio",
        sentDate: "2025-01-28",
        sentTime: "09:35",
        status: "Enviado",
    },
    {
        id: 3,
        clientName: "Juan Pérez",
        email: "juan@example.com",
        reminderType: "Primer Recordatorio",
        sentDate: "2025-01-27",
        sentTime: "10:15",
        status: "Error",
    },
]

export const Notification = () => {
    const [reminderConfigs, setReminderConfigs] = useState(mockReminderConfigs)
    const [reminderHistory, setReminderHistory] = useState(mockReminderHistory)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentReminder, setCurrentReminder] = useState<(typeof mockReminderConfigs)[0] | null>(null)

    // Email configuration state
    const [emailConfig, setEmailConfig] = useState({
        smtpServer: "smtp.gmail.com",
        smtpPort: "587",
        email: "gym@example.com",
        password: "••••••••",
        senderName: "GYM ACCESS",
    })

    const handleEdit = (reminder: (typeof mockReminderConfigs)[0]) => {
        setCurrentReminder(reminder)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (reminderId: number) => {
        setReminderConfigs(reminderConfigs.filter((reminder) => reminder.id !== reminderId))
    }

    const handleToggleActive = (reminderId: number) => {
        setReminderConfigs(
            reminderConfigs.map((reminder) =>
                reminder.id === reminderId ? { ...reminder, isActive: !reminder.isActive } : reminder,
            ),
        )
    }

    const handleTestEmail = () => {
        alert("Enviando correo de prueba...")
    }

    useEffect(() => {
        setReminderHistory(mockReminderHistory)
    }, [])

    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight ">Gestión de Recordatorios</h1>
                <p className="text-muted-foreground">
                    Configure recordatorios automáticos por correo electrónico para los pagos de mensualidades.
                </p>
            </div>

            <Tabs defaultValue="configurations" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-[#262626] p-1 h-full">
                    <TabsTrigger value="configurations">Configuraciones</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                    <TabsTrigger value="email-settings">Configuración Email</TabsTrigger>
                </TabsList>

                <TabsContent value="configurations" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Recordatorios Configurados</h3>
                            <p className="text-sm text-muted-foreground">
                                Configure cuándo y cómo enviar recordatorios a los clientes.
                            </p>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar Recordatorio
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
                                <DialogHeader>
                                    <DialogTitle>Agregar Recordatorio</DialogTitle>
                                    <DialogDescription>Configure un nuevo recordatorio automático.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="reminder-name">Nombre del Recordatorio</Label>
                                            <Input id="reminder-name" className="bg-zinc-950 border-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="days-before">Días antes del vencimiento</Label>
                                            <Select>
                                                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                                    <SelectValue placeholder="Seleccionar días" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                    <SelectItem value="0">El mismo día</SelectItem>
                                                    <SelectItem value="1">1 día antes</SelectItem>
                                                    <SelectItem value="3">3 días antes</SelectItem>
                                                    <SelectItem value="7">7 días antes</SelectItem>
                                                    <SelectItem value="15">15 días antes</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Asunto del correo</Label>
                                        <Input id="subject" className="bg-zinc-950 border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mensaje</Label>
                                        <Textarea
                                            id="message"
                                            className="bg-zinc-950 border-zinc-800"
                                            rows={4}
                                            placeholder="Usa {nombre} para el nombre del cliente y {fecha_vencimiento} para la fecha de vencimiento"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="active" />
                                        <Label htmlFor="active">Activar recordatorio</Label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(false)}>
                                        Guardar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4">
                        {reminderConfigs.map((reminder) => (
                            <Card key={reminder.id} className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-white">{reminder.name}</CardTitle>
                                        <CardDescription>
                                            {reminder.daysBeforeExpiry === 0
                                                ? "El mismo día del vencimiento"
                                                : `${reminder.daysBeforeExpiry} días antes del vencimiento`}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch checked={reminder.isActive} onCheckedChange={() => handleToggleActive(reminder.id)} />
                                            <span className="text-sm text-muted-foreground">{reminder.isActive ? "Activo" : "Inactivo"}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(reminder)}>
                                            <Pencil className="h-4 w-4 text-white" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción eliminará permanentemente el recordatorio "{reminder.name}".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(reminder.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardHeader>
                                <CardContent className="-mt-6">
                                    <div className="space-y-2 text-white">
                                        <div>
                                            <p className="text-sm font-medium">Asunto:</p>
                                            <p className="text-sm text-muted-foreground">{reminder.subject}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Mensaje:</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{reminder.message}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Historial de Recordatorios</h3>
                        <p className="text-sm text-muted-foreground">Registro de todos los recordatorios enviados.</p>
                    </div>

                    <div className="rounded-md border border-zinc-800 bg-zinc-900 text-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-zinc-800/50">
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Correo</TableHead>
                                    <TableHead>Tipo de Recordatorio</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reminderHistory.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-zinc-800/50 text-white">
                                        <TableCell>{record.clientName}</TableCell>
                                        <TableCell>{record.email}</TableCell>
                                        <TableCell>{record.reminderType}</TableCell>
                                        <TableCell>{record.sentDate}</TableCell>
                                        <TableCell>{record.sentTime}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${record.status === "Enviado" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                    }`}
                                            >
                                                {record.status === "Enviado" ? (
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                ) : (
                                                    <Clock className="mr-1 h-3 w-3" />
                                                )}
                                                {record.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="email-settings" className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Configuración de Correo Electrónico</h3>
                        <p className="text-sm text-muted-foreground">
                            Configure los parámetros SMTP para el envío de correos electrónicos.
                        </p>
                    </div>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Configuración SMTP
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-server">Servidor SMTP</Label>
                                    <Input
                                        id="smtp-server"
                                        value={emailConfig.smtpServer}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpServer: e.target.value })}
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-port">Puerto</Label>
                                    <Input
                                        id="smtp-port"
                                        value={emailConfig.smtpPort}
                                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: e.target.value })}
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sender-name">Nombre del remitente</Label>
                                <Input
                                    id="sender-name"
                                    value={emailConfig.senderName}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={emailConfig.email}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, email: e.target.value })}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={emailConfig.password}
                                    onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Guardar Configuración
                                </Button>
                                <Button variant="outline" onClick={handleTestEmail}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar Correo de Prueba
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Reminder Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle>Editar Recordatorio</DialogTitle>
                        <DialogDescription>Modifique la configuración del recordatorio.</DialogDescription>
                    </DialogHeader>
                    {currentReminder && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-reminder-name">Nombre del Recordatorio</Label>
                                    <Input
                                        id="edit-reminder-name"
                                        defaultValue={currentReminder.name}
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-days-before">Días antes del vencimiento</Label>
                                    <Select defaultValue={currentReminder.daysBeforeExpiry.toString()}>
                                        <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            <SelectItem value="0">El mismo día</SelectItem>
                                            <SelectItem value="1">1 día antes</SelectItem>
                                            <SelectItem value="3">3 días antes</SelectItem>
                                            <SelectItem value="7">7 días antes</SelectItem>
                                            <SelectItem value="15">15 días antes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-subject">Asunto del correo</Label>
                                <Input
                                    id="edit-subject"
                                    defaultValue={currentReminder.subject}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-message">Mensaje</Label>
                                <Textarea
                                    id="edit-message"
                                    defaultValue={currentReminder.message}
                                    className="bg-zinc-950 border-zinc-800"
                                    rows={4}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="edit-active" defaultChecked={currentReminder.isActive} />
                                <Label htmlFor="edit-active">Activar recordatorio</Label>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditDialogOpen(false)}>
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
