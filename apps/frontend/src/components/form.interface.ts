export interface BaseFormProps<T, Body> extends BaseDialogProps {
    onSubmit: (data: Body) => void;
    data: T | null;
}

export interface BaseDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export interface Options {
    label: string;
    value: string;
}