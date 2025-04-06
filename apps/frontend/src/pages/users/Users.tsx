import type React from "react"

import { useEffect, useState } from "react"
import { Download, Plus, Search, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

// Mock user data
const mockUsers = [
    {
        id: 1,
        name: "Carlos",
        lastName: "Rodríguez",
        cedula: "V-12345678",
        email: "carlos@example.com",
        phone: "+58 412-1234567",
        registrationDate: "10/01/2025",
    },
    {
        id: 2,
        name: "María",
        lastName: "González",
        cedula: "V-87654321",
        email: "maria@example.com",
        phone: "+58 414-7654321",
        registrationDate: "15/01/2025",
    },
    {
        id: 3,
        name: "Juan",
        lastName: "Pérez",
        cedula: "V-23456789",
        email: "juan@example.com",
        phone: "+58 416-2345678",
        registrationDate: "20/01/2025",
    },
    {
        id: 4,
        name: "Ana",
        lastName: "Martínez",
        cedula: "V-98765432",
        email: "ana@example.com",
        phone: "+58 424-9876543",
        registrationDate: "25/01/2025",
    },
]

export const Users = () => {
    const [users, setUsers] = useState(mockUsers)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<(typeof mockUsers)[0] | null>(null)

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleEdit = (user: (typeof mockUsers)[0]) => {
        setCurrentUser(user)
        setIsEditDialogOpen(true)
    }

    const handleExportToExcel = () => {
        // Mock export functionality
        console.log("Exporting to Excel:", users)
        alert("Exportando a Excel...")
    }

    useEffect(() => {
        setUsers(mockUsers)
    },[])

    return (
        <div className="space-y-4">
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

                    <Button variant="outline" onClick={handleExportToExcel}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar a Excel
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-zinc-800/50 ">
                            <TableHead>Nombre</TableHead>
                            <TableHead>Apellido</TableHead>
                            <TableHead>Cédula</TableHead>
                            <TableHead>Correo</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Fecha de Inscripción</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-zinc-800/50">
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.cedula}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.registrationDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Editar</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="text-white sm:max-w-[425px] bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                        <DialogDescription>Modifique la información del usuario.</DialogDescription>
                    </DialogHeader>
                    {currentUser && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Nombre</Label>
                                    <Input id="edit-name" defaultValue={currentUser.name} className="bg-zinc-950 border-zinc-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-lastName">Apellido</Label>
                                    <Input
                                        id="edit-lastName"
                                        defaultValue={currentUser.lastName}
                                        className="bg-zinc-950 border-zinc-800"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-cedula">Cédula</Label>
                                <Input id="edit-cedula" defaultValue={currentUser.cedula} className="bg-zinc-950 border-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Correo</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    defaultValue={currentUser.email}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Teléfono</Label>
                                <Input id="edit-phone" defaultValue={currentUser.phone} className="bg-zinc-950 border-zinc-800" />
                            </div>
                        </div>
                    )}
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

