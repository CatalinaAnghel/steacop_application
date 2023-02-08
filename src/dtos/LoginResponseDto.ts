export default interface LoginResponseDto{
    token: string,
    refreshToken: string,
    refreshTokenExpiration: number
};