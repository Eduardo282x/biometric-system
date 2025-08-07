import { useState, useRef, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import Webcam from "react-webcam";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { verifyClientFace } from "@/services/client/client.service";
import { ClientIdentification } from "@/services/client/client.interface";
import { findClient } from "@/services/access/access.service";
import { IPayment } from "@/services/payment/payment.interface";
import { formatDateShort, getDaysUntil } from "@/lib/formatters";
import { ScreenLoader } from "@/components/loaders/ScreenLoader";
import { RenderImage } from "../clients/client.data";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};


export const Access = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const webcamRef = useRef<Webcam>(null);
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isDetected, setIsDetected] = useState<boolean>(false)
    const [clientDetected, setClientDetected] = useState<IPayment | null>(null);

    const openSearch = () => {
        setOpenDialog(true)
    }

    const findClientByIdentification = async (data: ClientIdentification) => {
        const response = await findClient(data);
        if (response.success) {
            setIsDetected(true);
            setClientDetected(response.data as IPayment)
            setOpenDialog(false)
        } else {
            setIsDetected(false);
        }
    }

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setStream(mediaStream)
            setIsScanning(true)
        } catch (err) {
            console.error("Error accessing camera:", err)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(null)
            setIsScanning(false)
            setIsDetected(false)
            setClientDetected(null)
        }
    }

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [stream])

    const captureAndVerify = async () => {
        setIsLoading(true);
        const imageSrc = webcamRef.current?.getScreenshot();

        if (!imageSrc) return;

        // Convierte base64 a File como antes
        const byteString = atob(imageSrc.split(',')[1]);
        const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], 'verificacion.jpg', { type: mimeString });

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await verifyClientFace(formData);
            setIsDetected(true);
            setClientDetected(response.data as IPayment);
            setTimeout(() => {
                setStream(null)
                setIsScanning(false)
            }, 2000);
            setTimeout(() => {
                stopCamera()
            }, 15000);
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            console.error('Error en reconocimiento facial:', error);
        }
        setIsLoading(false);
    };

    return (
        <div className="text-white space-y-4">
            {isLoading && <ScreenLoader />}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Control de Acceso</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 text-white">

                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-white">Cámara</CardTitle>
                        <CardDescription>{isScanning ? "Escaneando..." : "Inicie la cámara para verificar acceso"}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 aspect-video bg-zinc-950 flex items-center justify-center">
                        {stream ? (
                            // <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                            <div className="w-full relative max-w-lg mx-auto">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    style={{ width: "100%" }}
                                    videoConstraints={videoConstraints}
                                />
                                <Button onClick={captureAndVerify} className="right-2 bottom-2 absolute mt-4 bg-blue-600 hover:bg-blue-700">
                                    Verificar acceso
                                </Button>
                                {/* <button onClick={capture}>Capture photo</button> */}
                            </div>
                        ) : (
                            <div className="text-gray-200">Cámara desactivada</div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-6">
                        {!isScanning ? (
                            <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                                Iniciar Cámara
                            </Button>
                        ) : (
                            <Button onClick={stopCamera} variant="destructive">
                                Detener Cámara
                            </Button>
                        )}

                        <Button onClick={openSearch} variant='outline'>
                            Buscar por cédula
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white text-4xl">Información del Cliente</CardTitle>
                        <CardDescription className="text-xl text-white">
                            {isDetected
                                ? "Cliente identificado"
                                : isScanning
                                    ? "Buscando coincidencia..."
                                    : "Inicie la cámara para verificar"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-white h-full">
                        {clientDetected && isDetected ? (
                            <div className="flex items-start justify-between h-full">
                                <div className="flex flex-col justify-around h-full" >
                                    <div className="space-y-1">
                                        <p className="text-lg text-gray-200">Nombre completo</p>
                                        <p className="text-2xl font-medium">
                                            {clientDetected.client.name} {clientDetected.client.lastName}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg text-gray-200">Estado de acceso</p>
                                        <div className="flex items-center gap-2">
                                            {clientDetected.status ? (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <p className="text-2xl font-medium text-green-500">Acceso permitido</p>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                    <p className="text-2xl font-medium text-red-500">Acceso denegado</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg text-gray-200">Próximo pago</p>
                                        <div className="flex items-center gap-2 text-lg font-medium">
                                            <p>{formatDateShort(clientDetected.nextDatePay)}</p> - <p>{getDaysUntil(clientDetected.nextDatePay)} Dias</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-6">
                                    <RenderImage imageUrl={clientDetected.client.photo} maxSize={true}/>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-40 items-center justify-center text-gray-200">
                                {isScanning ? "Buscando..." : "No hay cliente detectado"}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <SearchByIdentification
                open={openDialog}
                setOpen={setOpenDialog}
                onSearch={findClientByIdentification}
            />
        </div>
    )
}

interface SearchByIdentificationProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSearch: (data: ClientIdentification) => void;
}

const SearchByIdentification = ({ open, setOpen, onSearch }: SearchByIdentificationProps) => {
    const [identification, setIdentification] = useState<string>('');

    const onSubmit = () => {
        onSearch({ identify: identification })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="text-white sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle>Buscar Cliente</DialogTitle>
                    <DialogDescription>Ingrese la cédula del cliente para verificar su acceso.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="identification-search">Cédula</Label>
                        <Input
                            id="identification-search"
                            placeholder="V-12345678"
                            value={identification}
                            onKeyDownCapture={(value) => { if (value.key == 'Enter') onSubmit() }}
                            onChange={(e) => setIdentification(e.target.value)}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button className="text-black" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button type="submit" onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700">
                        Buscar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

