export default function handleErrors(error: unknown) {
    if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response: unknown }).response === 'object'
    ) {
        // Server responded with a status other than 2xx
        const response = (error as { response: { status: number; data?: { message?: string }, statusText?: string } }).response;
        console.error('Response error:', response);
        throw new Error(
            `Server Error: ${response.status} - ${response.data?.message || response.statusText}`,
        );
    } else if (
        typeof error === 'object' &&
        error !== null &&
        'request' in error &&
        typeof (error as { request: unknown }).request === 'object'
    ) {
        // Request was made but no response received
        const request = (error as { request: { status: number; data?: { message?: string } } }).request;
        console.error('Request error:', request);
        throw new Error(
            'No response from server. Please check your network connection.',
        );
    } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Error).message === 'string'
    ) {
        // Something else happened
        console.error('Error:', (error as Error).message);
        throw new Error(`Error: ${(error as Error).message}`);
    } else {
        // Unknown error type
        console.error('Unknown error:', error);
        throw new Error('An unknown error occurred.');
    }
}
