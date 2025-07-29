import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BaseFormProps } from "@/components/form.interface";
import { ClientBody, IClients } from "@/services/client/client.interface";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Webcam from 'react-webcam';

export interface ClientsForm extends BaseFormProps<IClients, ClientBody> {
    onSubmitPicture: (picture: File | null, data: ClientBody) => void
}

export const ClientsForm = ({ open, setOpen, data, onSubmitPicture }: ClientsForm) => {
    // const isEdit = data ? true : false;
    const [file, setFile] = useState<File | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const [useCamera, setUseCamera] = useState<boolean>(false);

    const capturePhoto = () => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            // Convierte base64 a Blob
            const byteString = atob(imageSrc.split(',')[1]);
            const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const nameFile = watch('identify');
            const file = new File([blob], `${nameFile}_cliente.jpg`, { type: mimeString });
            setFile(file);
            setUseCamera(false); // Oculta la cámara tras capturar
        }
    };

    const { register, handleSubmit, reset, watch } = useForm<ClientBody>({
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

    const sendData = (data: ClientBody) => {
        onSubmitPicture(file, data);

        if (file) {
            onSubmitPicture(file, data)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="text-white sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Agregar Cliente</DialogTitle>
                    <DialogDescription>Complete el formulario para agregar un nuevo cliente.</DialogDescription>
                </DialogHeader>
                <form id="client-form" onSubmit={handleSubmit(sendData)} className="grid gap-4 py-4">
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Cédula</Label>
                            <Input id="identify" type="number" {...register('identify')} className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Teléfono</Label>
                            <Input id="phone" type="tel" {...register('phone')} className="bg-zinc-950 border-zinc-800" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo</Label>
                        <Input id="email" {...register('email')} type="email" className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" {...register('address')} className="bg-zinc-950 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="picture">Foto</Label>
                        {useCamera ? (
                            <div className="flex flex-col items-center gap-2">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={320}
                                    height={240}
                                    videoConstraints={{ facingMode: 'user' }}
                                    className="rounded-xl border border-gray-400"
                                />
                                <Button type="button" onClick={capturePhoto} className="bg-blue-600 hover:bg-blue-700">
                                    Capturar foto
                                </Button>
                            </div>
                        ) : (
                            <div
                                onClick={() => setUseCamera(true)}
                                className="w-full border-3 flex items-center cursor-pointer justify-center mt-4 bg-zinc-950 border-dashed border-gray-400 h-32 rounded-2xl"
                            >
                                <span>{file ? 'Actualizar foto' : 'Agregar foto con cámara'}</span>
                            </div>
                        )}
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
