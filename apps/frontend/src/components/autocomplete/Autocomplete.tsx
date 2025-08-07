import { Check, ChevronsUpDown } from "lucide-react"
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface AutoCompleteProps {
    data: { label: string, value: string }[];
    placeholder: string;
    onChange: (value: string) => void;
    valueDefault?: string | number;
    resetValues?: boolean
    theme?: 'black' | 'white'
}

export const Autocomplete: FC<AutoCompleteProps> = ({ data, placeholder, onChange, valueDefault, resetValues, theme }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string | number>(valueDefault ? valueDefault : "");
    const [inputValue, setInputValue] = useState<string>("");
    const [dataFiltered, setDataFiltered] = useState<{ label: string, value: string }[]>(data);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setValue(valueDefault ? valueDefault.toString() : "");
    }, [valueDefault])

    const handleSelect = (currentValue: string) => {
        setValue(currentValue);
        onChange(currentValue);

        if (resetValues) {
            setValue('')
        }
        setOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        setInputValue('')
        setDataFiltered(data);
    }, [open])

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    const normalize = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        const filteredData = data.filter((option) =>
            normalize(option.label).includes(normalize(e.target.value))
        );
        setDataFiltered(filteredData);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const selectedOption = dataFiltered[0];
            if (selectedOption) {
                handleSelect(selectedOption.value.toString());
            }
        }
    }

    return (
        <div className="relative w-full bg-zinc-950 border-zinc-800" ref={ref}>
            <Button
                type="button"
                variant="outline"
                className="w-full bg-zinc-950 hover:bg-zinc-950 hover:text-white justify-between overflow-hidden"
                onClick={() => setOpen(!open)}
            >
                {value
                    ? data.find((option) => option.value.toString() === value)?.label
                    : placeholder}
                <ChevronsUpDown className="absolute top-3 right-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="border rounded-lg overflow-hidden w-full absolute  animationOpacity z-20 mt-1 bg-zinc-950">
                    <input
                        autoFocus
                        placeholder={placeholder}
                        className="px-2 py-1 rounded-none border-b-2 outline-none w-full"
                        value={inputValue}
                        onChange={onChangeInput}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="max-h-60 overflow-y-auto flex flex-col gap-1 p-2 w-full">
                        {dataFiltered && dataFiltered.map((option: { label: string, value: string }, index: number) => (
                            <p
                                key={index}
                                onClick={() => handleSelect(option.value.toString())}
                                className="text-sm flex items-center justify-between w-full py-1 px-2 hover:bg-zinc-700 rounded-md transition-all cursor-pointer">
                                {option.label}
                                {option.value.toString() === value && (
                                    <Check className="ml-auto h-4 w-4" />
                                )}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}