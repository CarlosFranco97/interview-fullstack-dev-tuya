import type { AxiosError, AxiosResponse } from 'axios';
import type { ApiError } from '../types/apiTypes';

/**
 * Extracts data from an Axios response and returns it with the correct type.
 */
export async function handleApiRequest<T>(
    request: Promise<AxiosResponse<T>>
): Promise<T> {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        throw formatApiError(error as AxiosError);
    }
}

/**
 * Formats Axios errors into a consistent structure.
 */
function formatApiError(error: AxiosError): ApiError {
    if (error.response) {
        const data = error.response.data as Record<string, unknown>;

        return {
            message: (data?.message as string) || 'Error en el servidor',
            statusCode: error.response.status,
            errors: data?.errors as Record<string, string[]> | undefined,
        };
    } else if (error.request) {
        return {
            message: 'Error de conexión. Verifica tu internet.',
            statusCode: 0,
        };
    } else {
        return {
            message: error.message || 'Error desconocido',
            statusCode: 0,
        };
    }
}

