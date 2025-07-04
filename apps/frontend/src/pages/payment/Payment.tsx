import type React from "react"

import { useEffect, useState } from "react"
import { Download, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

// Mock payment data
const mockPayments = [
    {
        id: 1,
        name: "Carlos",
        lastName: "Rodríguez",
        date: "10/01/2025",
        time: "14:30",
        method: "Tarjeta de crédito",
        status: "Al día",
        nextPaymentDate: "10/02/2025",
    },
    {
        id: 2,
        name: "María",
        lastName: "González",
        date: "15/01/2025",
        time: "10:15",
        method: "Efectivo",
        status: "Al día",
        nextPaymentDate: "15/02/2025",
    },
    {
        id: 3,
        name: "Juan",
        lastName: "Pérez",
        date: "05/01/2025",
        time: "16:45",
        method: "Transferencia",
        status: "Pendiente",
        nextPaymentDate: "05/02/2025",
    },
    {
        id: 4,
        name: "Ana",
        lastName: "Martínez",
        date: "20/01/2025",
        time: "09:30",
        method: "Tarjeta de débito",
        status: "Al día",
        nextPaymentDate: "20/02/2025",
    },
]

export const Payment = () => {
    const [payments, setPayments] = useState(mockPayments)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todos")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.lastName.toLowerCase().includes(searchTerm.toLowerCase())

        if (statusFilter === "todos") return matchesSearch
        if (statusFilter === "al-dia") return matchesSearch && payment.status === "Al día"
        if (statusFilter === "Pendientes") return matchesSearch && payment.status === "Pendiente"

        return matchesSearch
    })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value)
    }

    const handleExportToExcel = () => {
        // Mock export functionality
        console.log("Exporting to Excel:", filteredPayments)
        alert("Exportando a Excel...")
    }

    useEffect(() => {
        setPayments(mockPayments)
    }, [])

    return (
        <div className="space-y-4">
            <div className="text-white">
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Pagos</h1>
                <p className="text-muted-foreground">Administre los pagos de los miembros del gimnasio.</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre o apellido"
                            className="pl-8 bg-zinc-900 border-zinc-800"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                        <SelectTrigger className="text-white w-40 bg-zinc-900 border-zinc-800">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent className=" text-white bg-zinc-900 border-zinc-800">
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="al-dia">Al día</SelectItem>
                            <SelectItem value="Pendientes">Pendientes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Pago
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
                        <TableRow className="hover:bg-zinc-800/50">
                            <TableHead>Nombre</TableHead>
                            <TableHead>Apellido</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Hora</TableHead>
                            <TableHead>Método de Pago</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Próximo Pago</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment.id} className="hover:bg-zinc-800/50">
                                    <TableCell>{payment.name}</TableCell>
                                    <TableCell>{payment.lastName}</TableCell>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell>{payment.time}</TableCell>
                                    <TableCell>{payment.method}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${payment.status === "Al día" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                }`}
                                        >
                                            {payment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{payment.nextPaymentDate}</TableCell>
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
        </div>
    )
}

