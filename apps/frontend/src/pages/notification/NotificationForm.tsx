import { BaseDialogProps, BaseFormProps } from '@/components/form.interface';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { IReminder, ReminderBody, SendReminderBody } from '@/services/reminder/reminder.interface';
import { useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { useEffect, useState } from 'react';
import { IClients } from '@/services/client/client.interface';
import { Checkbox } from '@/components/ui/checkbox';


export const NotificationForm = ({ open, setOpen, onSubmit, data }: BaseFormProps<IReminder, ReminderBody>) => {
    const isEdit = data ? true : false;

    const { register, handleSubmit, watch, setValue, reset } = useForm<ReminderBody>({
        defaultValues: {
            name: '',
            subject: '',
            message: '',
            daysBefore: 1,
            isActive: false,
        }
    });

    useEffect(() => {
        if (data) {
            reset(data)
        } else {
            reset({
                name: '',
                subject: '',
                message: '',
                daysBefore: 1,
                isActive: false,
            })
        }
    }, [data])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar' : 'Agregar'} Recordatorio</DialogTitle>
                    <DialogDescription>{isEdit ? 'Modifique la configuración del recordatorio.' : 'Configure un nuevo recordatorio automático.'}</DialogDescription>
                </DialogHeader>
                <form id='form-reminder' onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reminder-name">Nombre del Recordatorio</Label>
                            <Input
                                id="reminder-name"
                                {...register('name')}
                                className="bg-zinc-950 border-zinc-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="days-before">Días antes del vencimiento</Label>
                            <Select value={watch('daysBefore').toString()} onValueChange={(value) => setValue('daysBefore', Number(value))}>
                                <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                                    <SelectValue placeholder="Seleccionar días" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
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
                        <Input
                            id="subject"
                            {...register('subject')}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea
                            {...register('message')}
                            id="message"
                            className="bg-zinc-950 border-zinc-800"
                            rows={4}
                            placeholder="Usa {nombre} para el nombre del cliente y {fecha_vencimiento} para la fecha de vencimiento"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="active" {...register('isActive')} />
                        <Label htmlFor="active">Activar recordatorio</Label>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" type='button' className='text-black' onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button form='form-reminder' type='submit' className="bg-blue-600 hover:bg-blue-700">
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface DeleteReminderDialogProps extends BaseDialogProps {
    onDelete: (action: boolean) => void
}


export const DeleteReminderDialog = ({ open, setOpen, onDelete }: DeleteReminderDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-white'>¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará permanentemente el recordatorio.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onDelete(false)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onDelete(true)}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


export interface SendRemindersProps extends BaseFormProps<IReminder, SendReminderBody> {
    reminders: IReminder[];
    clients: IClients[]
}
export const SendReminders = ({ open, setOpen, onSubmit, reminders, clients }: SendRemindersProps) => {
    const [reminderSelected, setReminderSelected] = useState<string>('')
    const [clientsSelected, setClientsSelecteds] = useState<number[]>([]);

    const [clientsList, setClientsList] = useState<IClients[]>(clients.map(item => ({ ...item, selected: false })))

    const onSendReminders = () => {
        onSubmit({
            clientIds: clientsSelected,
            reminderId: reminderSelected
        })
    }

    const onChangeSelected = (clientId: number) => {
        setClientsList(prev => prev.map(item => ({
            ...item,
            selected: item.id === clientId ? !item.selected : item.selected
        })))
    }

    useEffect(() => {
        setClientsSelecteds(clientsList.filter(cli => cli.selected == true).map(item => item.id))
    },[clientsList])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className=" bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Envió de recordatorios</DialogTitle>
                    <DialogDescription>Selecciona el recordatorio y los clientes a enviar</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="days-before">Recordatorio</Label>
                        <Select value={reminderSelected} onValueChange={(value) => setReminderSelected(value)}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white w-full">
                                <SelectValue placeholder="Seleccionar recordatorio" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {reminders && reminders.map(item => (
                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="days-before">Clientes</Label>
                        <div className='flex flex-col gap-2 items-start justify-start max-h-80 overflow-y-auto w-full'>
                            {clientsList && clientsList.map(cli => (
                                <div key={cli.id} className='flex items-center gap-2 border rounded-2xl p-4 w-full cursor-pointer' onClick={() => onChangeSelected(cli.id)}>
                                    <Checkbox checked={cli.selected} />
                                    <p>{cli.name} {cli.lastName}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" type='button' className='text-black' onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={onSendReminders} type='submit' className="bg-blue-600 hover:bg-blue-700">
                        Enviar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}