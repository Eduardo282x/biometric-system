import type React from "react"

import { useState } from "react"
import { LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router"

export const Login = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate authentication
        setTimeout(() => {
            setIsLoading(false)
            navigate("/acceso")
        }, 1000)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black">
            <Card className="w-[350px] bg-zinc-900 border-zinc-800">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center text-white font-bold">GYM ACCESS</CardTitle>
                    <CardDescription className="text-gray-300 text-center">Ingresa tus credenciales para acceder al sistema</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-white" htmlFor="username">Nombre de usuario</Label>
                            <Input
                                id="username"
                                placeholder="usuario"
                                required
                                className=" text-white bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white" htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className=" text-white bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full mt-5 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent"></span>
                                    Cargando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Iniciar Sesión
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

