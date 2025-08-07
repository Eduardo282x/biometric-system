import { Users, CreditCard, Camera, LogOut, Bell, User } from "lucide-react"
import { useLocation, Link, useNavigate } from "react-router"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GrGroup } from "react-icons/gr";

const navItems = [
    {
        name: "Control de Acceso",
        href: "/acceso",
        icon: Camera,
    },
    {
        name: "Gestión de Clientes",
        href: "/clientes",
        icon: GrGroup,
    },
    {
        name: "Gestión de Pagos",
        href: "/pagos",
        icon: CreditCard,
    },
    {
        name: "Gestión de Recordatorios",
        href: "/recordatorios",
        icon: Bell,
    },
    {
        name: "Gestión de Usuarios",
        href: "/usuarios",
        icon: Users,
    },
    {
        name: "Perfil",
        href: "/perfil",
        icon: User,
    },

]

export function Sidebar() {
    const pathname = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('userData')
        navigate('/login')
    }

    return (
        <div className="flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-900">
            <div className="flex h-14 items-center border-b border-zinc-800 px-4">
                <h1 className="text-xl font-bold text-white">GYM ACCESS</h1>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-400 transition-all hover:text-zinc-100",
                                pathname.pathname === item.href && "bg-zinc-800 text-zinc-100",
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                <Button
                    onClick={logout}
                    variant="outline"
                    className="w-full justify-start gap-2 border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    )
}

