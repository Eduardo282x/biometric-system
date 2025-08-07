import { useEffect, useState } from "react"
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IUser, UserBody } from "@/services/user/user.interface"
import toast from 'react-hot-toast';
import { useForm } from "react-hook-form"
import { changePassword, updateProfile } from "@/services/user/user.service"

export const Profile = () => {
    const [userData, setUserData] = useState<IUser | null>(null)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { register, handleSubmit, reset } = useForm<UserBody>({
        defaultValues: {
            username: '',
            name: '',
            lastName: '',
            role: 'GERENTE',
        }
    })

    useEffect(() => {
        const getUserData: IUser = JSON.parse(localStorage.getItem('userData') as string);
        if (getUserData) {
            setUserData(getUserData);
            reset(getUserData)
        }
    }, [])

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const onSubmit = async (data: UserBody) => {
        const updateData = await updateProfile(Number(userData?.id), data);

        if(updateData && updateData.data){
            localStorage.setItem('userData', JSON.stringify(updateData.userData))
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Las contraseñas no coinciden.", { position: 'bottom-center' })
            return
        }

        if (passwordForm.newPassword.length < 8) {
            toast("La nueva contraseña debe tener al menos 8 caracteres.", { position: 'bottom-center' })
            return
        }

        const response = await changePassword(Number(userData?.id), { currentPassword: passwordForm.currentPassword, password: passwordForm.newPassword })

        if (response.success) {
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Tabs defaultValue="personal-info" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal-info">Información Personal</TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                </TabsList>

                <TabsContent value="personal-info" className="space-y-6">
                    {/* Profile Header */}
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Información Personal
                            </CardTitle>
                            <CardDescription>
                                Actualice su información personal y datos de contacto.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Profile Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Usuario</Label>
                                    <Input
                                        type="username"
                                        {...register('username')}
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-2 ">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        {...register('name')}
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Apellido</Label>
                                    <Input
                                        id="lastName"
                                        {...register('lastName')}
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Cambiar Contraseña
                            </CardTitle>
                            <CardDescription>
                                Actualice su contraseña para mantener su cuenta segura.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordChange} className="space-y-4 text-white">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        La contraseña debe tener al menos 8 caracteres.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            className="bg-zinc-950 border-zinc-800 pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                        <Lock className="mr-2 h-4 w-4" />
                                        Cambiar Contraseña
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
