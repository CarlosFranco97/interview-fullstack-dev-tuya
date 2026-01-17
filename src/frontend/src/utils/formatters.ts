/**
 * Formatea un número como moneda
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
    }).format(amount);
};

/**
 * Formatea una fecha
 */
export const formatDate = (date: string | Date): string => {
    return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

/**
 * Enmascara un número de tarjeta mostrando solo los últimos 4 dígitos
 */
export const maskCardNumber = (cardNumber: string): string => {
    if (cardNumber.length < 4) return cardNumber;
    const lastFour = cardNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
};

// Alias para compatibilidad
export const formatCardNumber = maskCardNumber;

/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Trunca un texto largo
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};
