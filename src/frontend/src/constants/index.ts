export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    CARDS: '/cards',
    CREATE_CARD: '/cards/new',
    EDIT_CARD: '/cards/edit/:id',
    PAYMENTS: '/payments',
    CREATE_PAYMENT: '/payments/new',
} as const;

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
    UNAUTHORIZED: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
    VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
    SERVER_ERROR: 'Error en el servidor. Intenta nuevamente más tarde.',
} as const;

export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 6,
    CARD_NUMBER_LENGTH: 16,
    CVV_LENGTH: 3,
} as const;
