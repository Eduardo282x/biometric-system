import { useState, useRef, useEffect } from "react"
import { CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock user data
const mockUser = {
    name: "Carlos",
    lastName: "Rodríguez",
    accessStatus: true,
    nextPaymentDate: "15/05/2025",
}

export const Access = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [userDetected, setUserDetected] = useState<boolean>(false)
    const [userData, setUserData] = useState<typeof mockUser | null>(null)

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
            console.log(mediaStream);
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setStream(mediaStream)
            setIsScanning(true)

            // Simulate face detection after 3 seconds
            setTimeout(() => {
                setUserDetected(true)
                setUserData(mockUser)
            }, 3000)
        } catch (err) {
            console.error("Error accessing camera:", err)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(null)
            setIsScanning(false)
            setUserDetected(false)
            setUserData(null)
        }
    }

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [stream])

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-white">Cámara</CardTitle>
                    <CardDescription>{isScanning ? "Escaneando..." : "Inicie la cámara para verificar acceso"}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 aspect-video bg-zinc-950 flex items-center justify-center">
                    {stream ? (
                        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-zinc-500">Cámara desactivada</div>
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
                </CardFooter>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white text-4xl">Información del Cliente</CardTitle>
                    <CardDescription className="text-xl text-gray-300">
                        {userDetected
                            ? "Cliente identificado"
                            : isScanning
                                ? "Buscando coincidencia..."
                                : "Inicie la cámara para verificar"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-white">
                    {userDetected && userData ? (
                        <>
                            <div className="space-y-1">
                                <p className="text-sm text-zinc-500">Nombre completo</p>
                                <p className="text-lg font-medium">
                                    {userData.name} {userData.lastName}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-zinc-500">Estado de acceso</p>
                                <div className="flex items-center gap-2">
                                    {userData.accessStatus ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <p className="text-lg font-medium text-green-500">Acceso permitido</p>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-5 w-5 text-red-500" />
                                            <p className="text-lg font-medium text-red-500">Acceso denegado</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-zinc-500">Próximo pago</p>
                                <p className="text-lg font-medium">{userData.nextPaymentDate}</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-zinc-500">
                            {isScanning ? "Buscando..." : "No hay cliente detectado"}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

