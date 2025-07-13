import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableComponent } from "@/components/table/TableComponent"
import { usersColumns } from "./user.data"
import { createUser, getUsers, updateUser } from "@/services/user/user.service"
import { UserForm } from "./UserForm"
import { GroupUser, IUser, UserBody } from "@/services/user/user.interface"
import { FilterComponent } from "@/components/table/FilterComponent"

export const Users = () => {
    const [users, setUsers] = useState<GroupUser>({ allUsers: [], users: [] })
    const [userSelected, setUserSelected] = useState<IUser | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        getUserApi();
    }, []);

    const getUserApi = async () => {
        try {
            const response: IUser[] = await getUsers();
            setUsers({ allUsers: response, users: response });
        } catch (err) {
            console.log(err);
        }
    }

    const newUser = () => {
        setUserSelected(null);
        setOpen(true);
    }

    const getActionTable = (action: string, data: IUser) => {
        setUserSelected(data);
        if (action == 'edit') {
            setOpen(true);
        }
        if (action == 'delete') {
            console.log('Eliminar');
        }
    }

    const getActionForm = async (data: UserBody) => {
        if (userSelected) {
            await updateUser(userSelected.id, data);
        } else {
            await createUser(data);
        }
        setOpen(false);
        await getUserApi();
    }

    const onFilterUser = (users: IUser[]) => {
        setUsers(prev => ({ ...prev, users }))
    }

    return (
        <div className="space-y-4 text-white">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
                <p className="text-muted-foreground">Administre los usuarios del gimnasio.</p>
            </div>
            <div className="flex items-center justify-between">
                <div className="w-72">
                    <FilterComponent
                        placeholder={"Buscar por nombre o apellido"}
                        columns={usersColumns}
                        data={users.allUsers}
                        onSearch={onFilterUser}
                    />
                </div>

                <div className="flex gap-2">
                    <Button onClick={newUser} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Usuario
                    </Button>
                </div>
            </div>

            <TableComponent
                data={users.users}
                columns={usersColumns}
                actionTable={getActionTable}
            />

            {open && (
                <UserForm
                    open={open}
                    setOpen={setOpen}
                    data={userSelected}
                    onSubmit={getActionForm}
                    roles={['ADMIN', 'GERENTE', 'RECEPCIONISTA']}
                />
            )}


        </div>
    )
}

