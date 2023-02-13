/* eslint-disable  @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import jwt_decode from 'jwt-decode'
import axios from '@/plugins/axios'
import ResponseDto from '@/modules/Response'
import ErrorHandler from './error-handler-service'
import { ACCESS_TOKEN, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRATION } from '@/common/constants'
import { AxiosResponse } from 'axios'
import { LoginResponse, LoginRequestData } from '@/modules/login'
import { UserData } from '@/modules/user'
import { ERROR_INVALID_TOKEN } from '@/common/errors'
import { AUTHENTICATION_TOKEN_URL } from '@/plugins/axios/constants'

export default class AuthService {
    static isLoggedIn(): boolean {
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();

        return accessToken !== null && refreshToken !== null;
    }

    static async login(loginDto: LoginRequestData): Promise<ResponseDto> {
        let requestStatus = {
            error: '',
            success: true
        };
        await axios.post(AUTHENTICATION_TOKEN_URL, { email: loginDto.email, password: loginDto.password })
            .then(response => {
                if (requestStatus.success) {
                    // the request has been successfully performed and the access token has been received
                    const responseData = (response as AxiosResponse).data as LoginResponse;
                    Vue.$cookies.set(ACCESS_TOKEN, responseData.token);
                    Vue.$cookies.set(REFRESH_TOKEN, responseData.refreshToken, responseData.refreshTokenExpiration);
                    Vue.$cookies.set(REFRESH_TOKEN_EXPIRATION, responseData.refreshTokenExpiration, responseData.refreshTokenExpiration);
                }
            })
            .catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    static logout(): void {
        Vue.$cookies.remove(ACCESS_TOKEN);
        Vue.$cookies.remove(REFRESH_TOKEN);
        Vue.$cookies.remove(REFRESH_TOKEN_EXPIRATION);
    }

    static getAccessToken(): string {
        return Vue.$cookies.isKey(ACCESS_TOKEN) ? Vue.$cookies.get(ACCESS_TOKEN) : null;
    }

    static setAccessToken(accessToken: string): void {
        Vue.$cookies.set(ACCESS_TOKEN, accessToken);
    }

    static setRefreshTokenExpiration(exp: number): void {
        Vue.$cookies.set(REFRESH_TOKEN_EXPIRATION, exp);
    }

    static getRefreshToken(): string {
        return Vue.$cookies.isKey(REFRESH_TOKEN) ? Vue.$cookies.get(REFRESH_TOKEN) : null;
    }

    static getRefreshTokenExpiration(): number | null {
        return Vue.$cookies.isKey(REFRESH_TOKEN_EXPIRATION) ? Vue.$cookies.get(REFRESH_TOKEN_EXPIRATION) * 1000 : null;
    }

    static setRefreshToken(refreshToken: string, expires: number): void {
        Vue.$cookies.set(REFRESH_TOKEN, refreshToken, expires);
    }

    static parseToken(token: string): UserData | null {
        try {
            return jwt_decode<UserData>(token);
        } catch (e) {
            console.error(ERROR_INVALID_TOKEN, e);
        }

        return null;
    }

    static isAuthorized(): string | null {
        if (!this.isLoggedIn()) {
            return null;
        }

        const parsedToken = this.parseToken(this.getAccessToken());
        const role = (parsedToken !== null && typeof (parsedToken.roles[0]) !== 'undefined') ? parsedToken.roles[0] : null;
        return role;
    }
}