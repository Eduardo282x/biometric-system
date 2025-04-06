import { Outlet } from "react-router"
import { Sidebar } from "./Sidebar"

export const Layout = () => {
    return (
        <div className="flex h-screen bg-zinc-950">
            <Sidebar />
            <main className="flex-1 overflow-auto p-6"><Outlet /></main>
        </div>
    )
}

