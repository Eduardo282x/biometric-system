import type React from "react"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"

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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock plan data
const mockPlans = [
    {
        id: 1,
        name: "Plan Básico",
        price: 25.0,
        description: "Acceso al gimnasio en horarios regulares, uso de equipos básicos de cardio y pesas.",
    },
    {
        id: 2,
        name: "Plan Premium",
        price: 45.0,
        description: "Acceso completo al gimnasio, clases grupales, área de spa y entrenador personal 2 veces por semana.",
    },
    {
        id: 3,
        name: "Plan VIP",
        price: 75.0,
        description: "Acceso 24/7, entrenador personal ilimitado, nutricionista, spa premium y estacionamiento gratuito.",
    },
    {
        id: 4,
        name: "Plan Estudiante",
        price: 15.0,
        description: "Plan especial para estudiantes con descuento, acceso en horarios específicos.",
    },
]

export const Plan = () => {
    const [plans, setPlans] = useState(mockPlans)
    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentPlan, setCurrentPlan] = useState<(typeof mockPlans)[0] | null>(null)

    const filteredPlans = plans.filter((plan) => plan.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleEdit = (plan: (typeof mockPlans)[0]) => {
        setCurrentPlan(plan)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (planId: number) => {
        setPlans(plans.filter((plan) => plan.id !== planId))
    }

    // const handleExportToExcel = () => {
    //     console.log("Exporting to Excel:", plans)
    //     alert("Exportando a Excel...")
    // }

    return (
        <div className="space-y-4 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Planes</h1>
                <p className="text-muted-foreground">Administre los planes del gimnasio.</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre del plan"
                        className="pl-8 bg-zinc-900 border-zinc-800"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Plan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
                            <DialogHeader>
                                <DialogTitle>Agregar Plan</DialogTitle>
                                <DialogDescription>Complete el formulario para agregar un nuevo plan.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="planName">Nombre del Plan</Label>
                                    <Input id="planName" className="bg-zinc-950 border-zinc-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Precio ($)</Label>
                                    <Input id="price" type="number" step="0.01" className="bg-zinc-950 border-zinc-800" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea id="description" className="bg-zinc-950 border-zinc-800" rows={4} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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

            <div className="rounded-md border border-zinc-800 bg-zinc-900">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-zinc-800/50">
                            <TableHead>Nombre del Plan</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="text-right">Editar</TableHead>
                            <TableHead className="text-right">Eliminar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan) => (
                                <TableRow key={plan.id} className="hover:bg-zinc-800/50">
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>${plan.price.toFixed(2)}</TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="truncate">{plan.description}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="icon" onClick={() => handleEdit(plan)}>
                                            <Pencil className="text-blue-800" />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. Esto eliminará permanentemente el plan "{plan.name}".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(plan.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Plan Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle>Editar Plan</DialogTitle>
                        <DialogDescription>Modifique la información del plan.</DialogDescription>
                    </DialogHeader>
                    {currentPlan && (
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-planName">Nombre del Plan</Label>
                                <Input id="edit-planName" defaultValue={currentPlan.name} className="bg-zinc-950 border-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Precio ($)</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={currentPlan.price}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Descripción</Label>
                                <Textarea
                                    id="edit-description"
                                    defaultValue={currentPlan.description}
                                    className="bg-zinc-950 border-zinc-800"
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
