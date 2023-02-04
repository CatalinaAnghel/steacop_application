/* eslint-disable  @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import VueJwtDecode from 'vue-jwt-decode'
import axios from '@/axios/auth'
import LoginDto from "@/dtos/LoginDto"
import ResponseDto from '@/dtos/ResponseDto'
import ErrorHandler from './ErrorHandler'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/common/constants'
import { AxiosResponse } from 'axios'
import LoginResponseDto from '@/dtos/LoginResponseDto'
import UserDto from '@/dtos/UserDto'


export default class AuthService{
    static isLoggedIn(): boolean {
        return Vue.$cookies.isKey(ACCESS_TOKEN);
    }

    static async login(loginDto: LoginDto): Promise<ResponseDto> {
        let requestStatus = {
            error: '',
            success: true
        };
        await axios.post('/authentication_token', { email: loginDto.email, password: loginDto.password})
        .then(response => {
            if(requestStatus.success === true){
                // the request has been successfully performed and the access token has been received
                const responseData = (response as AxiosResponse).data as LoginResponseDto;
                Vue.$cookies.set(ACCESS_TOKEN, responseData.token);
            }
        })
        .catch(error => {
            requestStatus = ErrorHandler.handleError(error);
        });

        return requestStatus;
    }

    static logout(): void{
        Vue.$cookies.remove(ACCESS_TOKEN);
        Vue.$cookies.remove(REFRESH_TOKEN);
    }

    static getAccessToken(): string{
        return Vue.$cookies.isKey(ACCESS_TOKEN)? Vue.$cookies.get(ACCESS_TOKEN): null;
    }

    static getRefreshToken(): string{
        return Vue.$cookies.isKey(REFRESH_TOKEN)? Vue.$cookies.get(REFRESH_TOKEN): null;
    }

    static parseToken(token: string): UserDto|null{
        try{
            return VueJwtDecode.decode(token);
        }catch(e){
            console.error("Error decoding token: ", e);
        }
        
        return null;
    }
}