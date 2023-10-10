function formatDateString(inputDateString: string): string {
    const inputDate = new Date(inputDateString);

    if (isNaN(inputDate.getTime())) {
        throw new Error('Invalid date format');
    }

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    };

    return new Intl.DateTimeFormat('ru-RU', options).format(inputDate);
}

export default formatDateString;
