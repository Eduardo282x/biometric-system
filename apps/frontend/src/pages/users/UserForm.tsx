import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { IUser, Role, UserBody } from "@/services/user/user.interface";
import { BaseFormProps } from "@/components/form.interface";
import { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { setRoleName } from "./user.data";

interface UserFormProps extends BaseFormProps<IUser, UserBody> {
    roles: Role[];
}

export const UserForm = ({ open, setOpen, onSubmit, data, roles }: UserFormProps) => {
    const isEdit = data ? true : false;

    const { register, handleSubmit, reset, watch, setValue } = useForm<UserBody>({
        defaultValues: {
            username: '',
            name: '',
            lastName: '',
            role: 'RECEPCIONISTA',
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
                    <DialogTitle>{isEdit ? 'Editar' : 'Agregar '} Usuario</DialogTitle>
                    <DialogDescription>{isEdit
                        ? 'Modifique la información del usuario'
                        : 'Complete el formulario para agregar un nuevo usuario'}
                    </DialogDescription>
                </DialogHeader>

                <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <Input {...register('name')} id="name" className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input {...register('lastName')} id="lastName" className="bg-zinc-950 border-zinc-800" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Usuario</Label>
                        <Input {...register('username')} id="username" className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select value={watch('role')} onValueChange={(value) => setValue('role', value as Role)}>
                            <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                                {roles && roles.map((item) => (
                                    <SelectItem key={item} value={item}>{setRoleName(item)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </form>
                <DialogFooter>
                    <Button type="button" variant="outline" className="text-black" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" form="user-form" className="bg-blue-600 hover:bg-blue-700">
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
