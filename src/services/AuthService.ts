/* eslint-disable  @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import VueJwtDecode from 'vue-jwt-decode'
import axios from '@/axios/auth'
import LoginDto from "@/dtos/LoginDto"
import ResponseDto from '@/dtos/ResponseDto'
import ErrorHandler from './ErrorHandler'
import { ACCESS_TOKEN, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRATION } from '@/common/constants'
import { AxiosResponse } from 'axios'
import LoginResponseDto from '@/dtos/LoginResponseDto'
import UserDto from '@/dtos/UserDto'


export default class AuthService {
    static async isLoggedIn(): Promise<ResponseDto> {
        let requestStatus = {
            error: '',
            success: true
        };
        const accessToken = this.getAccessToken();
        const refreshToken = this.getRefreshToken();
        if (accessToken === null || refreshToken === null) {
            requestStatus.success = false;
            requestStatus.error = 'The tokens are not set';
            return requestStatus;
        }
        const decodedAccessToken = this.parseToken(accessToken);
        if (decodedAccessToken !== null && decodedAccessToken.exp * 1000 > Date.now()) {
            return requestStatus;
        }

        await axios.post('/token/refresh', { refreshToken: refreshToken })
            .then(response => {
                const responseData = (response as AxiosResponse).data as LoginResponseDto;
                this.setAccessToken(responseData.token);
                this.setRefreshToken(responseData.refreshToken, responseData.refreshTokenExpiration);
            }).catch(error => {
                requestStatus = ErrorHandler.handleError(error);
            });

        return requestStatus;
    }

    static async login(loginDto: LoginDto): Promise<ResponseDto> {
        let requestStatus = {
            error: '',
            success: true
        };
        await axios.post('/authentication_token', { email: loginDto.email, password: loginDto.password })
            .then(response => {
                if (requestStatus.success) {
                    // the request has been successfully performed and the access token has been received
                    const responseData = (response as AxiosResponse).data as LoginResponseDto;
                    Vue.$cookies.set(ACCESS_TOKEN, responseData.token);
                    Vue.$cookies.set(REFRESH_TOKEN, responseData.refreshToken, responseData.refreshTokenExpiration);
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
    }

    static getAccessToken(): string {
        return Vue.$cookies.isKey(ACCESS_TOKEN) ? Vue.$cookies.get(ACCESS_TOKEN) : null;
    }

    static setAccessToken(accessToken: string): void {
        Vue.$cookies.set(ACCESS_TOKEN, accessToken);
    }

    static getRefreshToken(): string {
        return Vue.$cookies.isKey(REFRESH_TOKEN) ? Vue.$cookies.get(REFRESH_TOKEN) : null;
    }

    static setRefreshToken(refreshToken: string, expires: number): void {
        Vue.$cookies.set(REFRESH_TOKEN, refreshToken, expires);
    }

    static parseToken(token: string): UserDto | null {
        try {
            return VueJwtDecode.decode(token);
        } catch (e) {
            console.error("Error decoding token: ", e);
        }

        return null;
    }

    static async isAuthorized(): Promise<string | null> {
        if (!(await this.isLoggedIn()).success) {
            return null;
        }

        const parsedToken = this.parseToken(this.getAccessToken());
        const role = (parsedToken !== null && typeof (parsedToken.roles[0]) !== 'undefined') ? parsedToken.roles[0] : null;
        return role;
    }
}