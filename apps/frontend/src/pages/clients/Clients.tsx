import type React from "react"

import { useEffect, useState } from "react"
import { Download, Plus, Search } from "lucide-react"

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
import { clientsColumns, IClient } from "./client.data"

// Mock user data
const mockClients = [
    {
        id: 1,
        name: "Carlos",
        lastName: "Rodríguez",
        cedula: "V-12345678",
        address: "Av. Principal, Caracas",
        phone: "+58 412-1234567",
        email: "carlos@example.com",
    },
    {
        id: 2,
        name: "María",
        lastName: "González",
        cedula: "V-87654321",
        address: "Calle 5, Valencia",
        phone: "+58 414-7654321",
        email: "maria@example.com",
    },
    {
        id: 3,
        name: "Juan",
        lastName: "Pérez",
        cedula: "V-23456789",
        address: "Urbanización Los Palos Grandes",
        phone: "+58 416-2345678",
        email: "juan@example.com",
    },
    {
        id: 4,
        name: "Ana",
        lastName: "Martínez",
        cedula: "V-98765432",
        address: "Centro Comercial Sambil",
        phone: "+58 424-9876543",
        email: "ana@example.com",
    },
]

export const Clients = () => {
    const [users, setUsers] = useState<IClient[]>(mockClients)
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

    const handleExportToExcel = () => {
        // Mock export functionality
        console.log("Exporting to Excel:", users)
        alert("Exportando a Excel...")
    }

    useEffect(() => {
        setUsers(mockClients)
    }, [])

    return (
        <div className="space-y-4 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h1>
                <p className="text-muted-foreground">Administre los clientes del gimnasio.</p>
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

                    <Button className="text-black" variant="outline" onClick={handleExportToExcel}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar a Excel
                    </Button>
                </div>
            </div>

            <TableComponent
                data={filteredUsers}
                columns={clientsColumns}
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


