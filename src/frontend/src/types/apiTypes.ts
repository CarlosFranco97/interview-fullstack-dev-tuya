/**
 * Standard structure for API error responses.
 */
export interface ApiError {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
}
