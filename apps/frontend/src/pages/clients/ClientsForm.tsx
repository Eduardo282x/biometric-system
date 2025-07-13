import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BaseFormProps } from "@/components/form.interface";
import { ClientBody, IClients } from "@/services/client/client.interface";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export const ClientsForm = ({ open, setOpen, data, onSubmit }: BaseFormProps<IClients, ClientBody>) => {
    // const isEdit = data ? true : false;

    const { register, handleSubmit, reset } = useForm<ClientBody>({
        defaultValues: {
            name: '',
            lastName: '',
            phone: '',
            address: '',
            email: '',
            identify: ''
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
                    <DialogTitle>Agregar Cliente</DialogTitle>
                    <DialogDescription>Complete el formulario para agregar un nuevo cliente.</DialogDescription>
                </DialogHeader>
                <form id="client-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input id="name" {...register('name')} className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input id="lastName" {...register('lastName')} className="bg-zinc-950 border-zinc-800" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="identify">Cédula</Label>
                        <Input id="identify" {...register('identify')} className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo</Label>
                        <Input id="email" {...register('email')} type="email" className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" {...register('phone')} className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" {...register('address')} className="bg-zinc-950 border-zinc-800" />
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
