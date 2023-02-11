export interface LoginRequestData {
    email: string,
    password: string
};

export interface LoginResponse {
    token: string,
    refreshToken: string,
    refreshTokenExpiration: number
};