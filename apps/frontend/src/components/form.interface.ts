export interface BaseFormProps<T, Body> {
    open: boolean;
    setOpen: (open: boolean) => void;
    onSubmit: (data: Body) => void;
    data: T | null;
}

export interface Options {
    label: string;
    value: string;
}