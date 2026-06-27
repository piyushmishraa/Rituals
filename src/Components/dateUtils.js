export const formatDateKey = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const shiftDateKey = (dateKey, deltaDays) => {
    const nextDate = parseDateKey(dateKey);
    nextDate.setDate(nextDate.getDate() + deltaDays);
    return formatDateKey(nextDate);
};

export const normalizeDateKey = (rawDate) => {
    if (typeof rawDate !== 'string' || !rawDate.trim()) {
        return null;
    }

    const dashed = rawDate.trim().replaceAll('/', '-');
    if (/^\d{4}-\d{2}-\d{2}$/.test(dashed)) {
        return dashed;
    }

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return formatDateKey(parsed);
};
