export const formatOnlyNumberWithDots = (number: number | string, digits?: number): string => {
    const parsed = typeof number === 'string' ? parseFloat(number) : number;

    return new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: digits ? digits : 2,
        maximumFractionDigits: digits ? digits : 2,
    }).format(parsed);
};


export const formatDateShort = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
};

export const formatHourShort = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes}${ampm}`;
}