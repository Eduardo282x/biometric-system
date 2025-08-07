import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeleteReminderDialog, NotificationForm } from "./NotificationForm"
import { IReminder, ReminderBody } from "@/services/reminder/reminder.interface"

// Mock reminder configurations
const mockReminderConfigs: IReminder[] = [
    {
        id: 1,
        name: "Primer Recordatorio",
        daysBefore: 7,
        isActive: true,
        subject: "Recordatorio: Tu mensualidad vence pronto",
        createdAt: new Date(),
        updatedAt: new Date(),
        message:
            "Hola {nombre}, te recordamos que tu mensualidad del gimnasio vence el {fecha_vencimiento}. Por favor, realiza tu pago a tiempo para evitar interrupciones en tu acceso.",
    },
    {
        id: 2,
        name: "Segundo Recordatorio",
        daysBefore: 3,
        isActive: true,
        subject: "Urgente: Tu mensualidad vence en 3 días",
        createdAt: new Date(),
        updatedAt: new Date(),
        message:
            "Hola {nombre}, tu mensualidad vence el {fecha_vencimiento}. Te pedimos que realices tu pago lo antes posible para mantener tu acceso al gimnasio.",
    },
    {
        id: 3,
        name: "Recordatorio de Vencimiento",
        daysBefore: 0,
        isActive: false,
        subject: "Tu mensualidad ha vencido",
        createdAt: new Date(),
        updatedAt: new Date(),
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
    const [openForm, setOpenForm] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [reminderSelected, setReminderSelected] = useState<IReminder | null>(null)

    const handleEdit = (reminder: IReminder) => {
        setReminderSelected(reminder);
        setOpenForm(true);
    }

    const handleToggleActive = (reminderId: number) => {
        setReminderConfigs(
            reminderConfigs.map((reminder) =>
                reminder.id === reminderId ? { ...reminder, isActive: !reminder.isActive } : reminder,
            ),
        )
    }

    const openNotificationForm = () => {
        setReminderSelected(null);
        setOpenForm(true)
    }

    const getChangesForm = (data: ReminderBody) => {
        console.log(data);
        setOpenForm(false);
    }

    const deleteReminder = (data: boolean) => {
        console.log(data);
        if (data && reminderSelected) {
            setOpenForm(false);
        }
    }

    useEffect(() => {
        setReminderHistory(mockReminderHistory)
    }, []);


    return (
        <div className="space-y-6 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight ">Gestión de Recordatorios</h1>
                <p className="text-gray-100">
                    Configure recordatorios automáticos por correo electrónico para los pagos de mensualidades.
                </p>
            </div>

            <Tabs defaultValue="configurations" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 bg-[#262626] p-1 h-full">
                    <TabsTrigger className="cursor-pointer" value="configurations">Configuraciones</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="history">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="configurations" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Recordatorios Configurados</h3>
                            <p className="text-sm text-gray-100">
                                Configure cuándo y cómo enviar recordatorios a los clientes.
                            </p>
                        </div>
                        <Button onClick={openNotificationForm} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Recordatorio
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {reminderConfigs.map((reminder) => (
                            <Card key={reminder.id} className="bg-zinc-900 border-zinc-800">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-white">{reminder.name}</CardTitle>
                                        <CardDescription>
                                            {reminder.daysBefore === 0
                                                ? "El mismo día del vencimiento"
                                                : `${reminder.daysBefore} días antes del vencimiento`}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch checked={reminder.isActive} onCheckedChange={() => handleToggleActive(reminder.id)} />
                                            <span className="text-sm text-gray-100">{reminder.isActive ? "Activo" : "Inactivo"}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(reminder)}>
                                            <Pencil className="h-4 w-4 text-white" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setOpenDelete(true)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="-mt-6">
                                    <div className="space-y-2 text-white">
                                        <div>
                                            <p className="text-sm font-medium">Asunto:</p>
                                            <p className="text-sm text-gray-100">{reminder.subject}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Mensaje:</p>
                                            <p className="text-sm text-gray-100 line-clamp-2">{reminder.message}</p>
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
                        <p className="text-sm text-gray-100">Registro de todos los recordatorios enviados.</p>
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
            </Tabs>


            <NotificationForm
                open={openForm}
                setOpen={setOpenForm}
                data={reminderSelected}
                onSubmit={getChangesForm}
            />
            <DeleteReminderDialog
                open={openDelete}
                setOpen={setOpenDelete}
                onDelete={deleteReminder}
            />
        </div>
    )
}
