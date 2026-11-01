export const STATUS_LABELS = {
    PENDING: "Oczekujące",
    IN_PROGRESS: "W realizacji",
    COMPLETED: "Zakończone",
    CANCELLED: "Anulowane",
};

export function formatMoney(value) {
    return `${value.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
}