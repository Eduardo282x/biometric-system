import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { BaseFormProps } from "@/components/form.interface";
import { IPlan, PlanBody } from "@/services/plan/plan.interface";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect } from "react";



export const PlanForm = ({ open, setOpen, data, onSubmit }: BaseFormProps<IPlan, PlanBody>) => {
    const isEdit = data ? true : false;

    const { register, handleSubmit, reset } = useForm<PlanBody>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
        }
    });

    useEffect(() => {
        if (data) {
            reset(data)
        }
    }, [data])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="text-white sm:max-w-[500px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar' : 'Agregar'} Plan</DialogTitle>
                    <DialogDescription>Modifique la información del plan.</DialogDescription>
                </DialogHeader>
                <form id="plan-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="plan">Nombre del Plan</Label>
                        <Input id="plan" {...register('name')} className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Precio ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            {...register('price', { valueAsNumber: true })}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            className="bg-zinc-950 border-zinc-800"
                            rows={4}
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" type="button" className="text-black" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button form="plan-form" type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Guardar Cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
