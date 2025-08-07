import { BaseDialogProps, BaseFormProps } from "@/components/form.interface";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogFooter, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IPayment, PaymentBody } from "@/services/payment/payment.interface";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Label } from "@radix-ui/react-label";
import { IClients } from "@/services/client/client.interface";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { Autocomplete } from "@/components/autocomplete/Autocomplete";

interface PaymentFormProps extends BaseFormProps<IPayment, PaymentBody> {
    clients: IClients[];
}


export const PaymentForm = ({ open, setOpen, data, clients, onSubmit }: PaymentFormProps) => {
    registerLocale("es", es);

    const { register, handleSubmit, reset, watch, setValue } = useForm<PaymentBody>({
        defaultValues: {
            clientId: 0,
            userId: 1,
            methodPayment: '',
            amount: 0,
            description: '',
            nextDatePay: new Date(),
        }
    });

    useEffect(() => {
        if (data) {
            reset(data)
        }
    }, [data])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="text-white sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Agregar Pago</DialogTitle>
                    <DialogDescription>Complete el formulario para registrar un pago.</DialogDescription>
                </DialogHeader>
                <form id="client-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="client">Cliente</Label>
                        <Autocomplete
                            data={clients.map(item => ({ label: `${item.name} ${item.lastName}`, value: item.id.toString() }))}
                            placeholder="Buscar cliente..."
                            onChange={(value) => setValue('clientId', Number(value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="methodPayment">Método de pago</Label>
                        <Input id="methodPayment" {...register('methodPayment')} className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="amount">Cantidad</Label>
                        <Input id="amount" type="number" {...register('amount', { valueAsNumber: true })} className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Input id="description" {...register('description')} className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="nextDatePay">Proximo Pago</Label>

                        <DatePicker
                            locale="es"
                            dateFormat="dd/MM/yyyy"
                            selected={watch('nextDatePay')}
                            onChange={(date) => setValue('nextDatePay', date as Date)} //only when value has changed
                            className="bg-zinc-950 border border-[#27272a] block w-full rounded-md p-2"
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" type="button" className="text-black" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button form="client-form" type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface DeleteClientDialogProps extends BaseDialogProps {
    onDelete: (action: boolean) => void
}

export const DeletePaymentDialog = ({ open, setOpen, onDelete }: DeleteClientDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="bg-zinc-900 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
                    <AlertDialogDescription>
                        Estas seguro que desea eliminar este pago?. Esta acción no se podrá deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="text-black" onClick={() => onDelete(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-800 hover:bg-red-700" onClick={() => onDelete(true)} >Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}