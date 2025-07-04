import type React from "react"

import { useEffect, useState } from "react"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TableComponent } from "@/components/table/TableComponent"
import { usersColumns, type IUser } from "./user.data"

// Mock user data
const mockUsers: IUser[] = [
    {
        id: 1,
        name: "Alvaro",
        lastName: "Rios",
        username: 'Alvaro20',
        rol: 'Administrador'
    },
    {
        id: 2,
        name: "Luis",
        lastName: "Perez",
        username: 'LuisP',
        rol: 'Recepcionista'
    },
    {
        id: 3,
        name: "Maria",
        lastName: "Villalobos",
        username: 'MariaV',
        rol: 'Recepcionista'
    }
]

export const Users = () => {
    const [users, setUsers] = useState<IUser[]>(mockUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    // const [currentUser, setCurrentUser] = useState<IUser | null>(null)

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    // const handleExportToExcel = () => {
    //     // Mock export functionality
    //     console.log("Exporting to Excel:", users)
    //     alert("Exportando a Excel...")
    // }

    useEffect(() => {
        setUsers(mockUsers)
    }, [])

    return (
        <div className="space-y-4 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administre los usuarios del gimnasio.</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o apellido"
                        className="text-white pl-8 bg-zinc-900 border-zinc-800"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className="flex gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="text-white sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                            <DialogHeader>
                                <DialogTitle>Agregar Usuario</DialogTitle>
                                <DialogDescription>Complete el formulario para agregar un nuevo usuario.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input id="name" className="bg-zinc-950 border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Apellido</Label>
                                        <Input id="lastName" className="bg-zinc-950 border-zinc-800" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cedula">Cédula</Label>
                                    <Input id="cedula" className="bg-zinc-950 border-zinc-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo</Label>
                                    <Input id="email" type="email" className="bg-zinc-950 border-zinc-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input id="phone" className="bg-zinc-950 border-zinc-800" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" className="text-black" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddDialogOpen(false)}>
                                    Guardar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* <Button variant="outline" onClick={handleExportToExcel}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar a Excel
                    </Button> */}
                </div>
            </div>

            <TableComponent
                data={filteredUsers}
                columns={usersColumns}
            />

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="text-white sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                        <DialogDescription>Modifique la información del usuario.</DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" className="text-black" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditDialogOpen(false)}>
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

