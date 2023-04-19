export const AUTHENTICATION_TOKEN_URL = '/authentication_token';
export const REFRESH_TOKEN_URL = '/token/refresh';
export const AUTH_URL_PATTERN = `(${AUTHENTICATION_TOKEN_URL}|${REFRESH_TOKEN_URL})`;

export const MULTIPART_FORM_DATA_ROUTES = [
    '/student-import-files',
    '/supervisor-import-files',
    '/documents'
]