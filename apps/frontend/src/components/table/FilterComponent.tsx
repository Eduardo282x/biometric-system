/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { IColumns } from './TableComponent';
import { useState } from 'react';
import { debounce } from '@/lib/debounce';

interface FilterComponentProps<T> {
    placeholder: string;
    columns: IColumns<T>[];
    data: T[]
    onSearch: (dataFilter: T[]) => void
}

export const FilterComponent = <T,>({ placeholder, columns, data, onSearch }: FilterComponentProps<T>) => {
    const [filter, setFilter] = useState<string>('');

    const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const getNestedValue = (obj: any, path: string): string => {
        return path.split('.').reduce((acc, key) => acc?.[key], obj)?.toString().toLowerCase() || ''
    }

    const handleFilter = (value: string) => {
        if (!value) {
            onSearch(data)
            return
        }

        const keys = columns
            // .filter((col: IColumns) => col.isIcon === false)
            .map((col: IColumns<T>) => col.column)

        const filtered = data.filter((item) =>
            keys.some((key) =>
                normalize(getNestedValue(item, key as string)).includes(normalize(value))
            )
        )

        onSearch(filtered);
    }

    const debouncedFilter = debounce(handleFilter, 200)

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value)
        debouncedFilter(value)
    }

    return (
        <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-100" />
            <Input
                type='search'
                placeholder={placeholder}
                value={filter}
                onChange={onChange}
                className="text-white pl-8 bg-zinc-900 border-zinc-800 outline-none"
            />
        </div>
    )
}
