import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaFilter } from "react-icons/fa";

interface DropdownColumnFilterProps {
    children: React.ReactNode
}

export const DropdownColumnFilter = ({ children }: DropdownColumnFilterProps) => {

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="outline"
                        className="bg-zinc-950 outline-none focus:border-none text-gray-400 border border-gray-400  hover:bg-zinc-700 hover:text-gray-200 "
                    >
                        <FaFilter />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {children}
                </DropdownMenuContent>
            </DropdownMenu>
        </div >
    )
}
