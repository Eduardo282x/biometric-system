/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "../ui/button";

export interface IColumns<T> {
    label: string;
    column: ColumnType<T>;
    element: (data: T) => string | React.ReactNode;
    icon?: boolean;
    Icon?: React.ComponentType<{ className?: string }>
    className?: (data: T) => string;
}

type ColumnType<T> = 'edit' | 'delete' | keyof T

interface TableComponentProps<T> {
    columns: IColumns<T>[];
    data: T[];
    actionTable: (action: ColumnType<T>, data: T) => void;
}
export const TableComponent = <T,>({ columns, data, actionTable }: TableComponentProps<T>) => {
    return (
        <div>
            <div className="rounded-md border border-zinc-800 bg-zinc-900">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-zinc-800/50 ">
                            {columns && columns.map((col: IColumns<T>, index: number) => (
                                <TableHead key={index}>{col.label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, index: number) => (
                                <TableRow key={index} className="hover:bg-zinc-800/50">
                                    {columns && columns.map((col: IColumns<T>, indexCell: number) => (
                                        <TableCell key={indexCell}>
                                            {col.icon && col.Icon ? (
                                                <Button onClick={() => actionTable(col.column, item)} size='icon' className="scale-115 cursor-pointer">
                                                    <col.Icon className={`${col.className ? col.className(item) : ''}`} />
                                                </Button>
                                            ) : (
                                                col.element(item)
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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
