import axios, { RawAxiosRequestHeaders } from 'axios';
import { AUTHENTICATION_TOKEN_URL, REFRESH_TOKEN_URL, AUTH_URL_PATTERN } from './constants';
import AuthService from '@/services/auth-service';
import router from '@/router';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:8000/api',
    headers: {
        "Content-Type": "application/json"
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        if (!config.url?.match(AUTH_URL_PATTERN)) {
            if (typeof (AuthService.getAccessToken()) === 'undefined') {
                logout();
            }
            config["headers"] = config.headers ?? {};
            console.log(config);
            if(config.method === 'patch'){
                (config.headers as RawAxiosRequestHeaders)["Content-Type"] = 'application/merge-patch+json';
            } else if (config.method === 'post' && config.url === '/student-import-files'){
                (config.headers as RawAxiosRequestHeaders)["Content-Type"] = 'multipart/form-data';
            }

            (config.headers as RawAxiosRequestHeaders)["Authorization"] = `Bearer ${AuthService.getAccessToken()}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== AUTHENTICATION_TOKEN_URL && originalConfig.url !== REFRESH_TOKEN_URL && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    validateRefreshToken();
                    // the refresh token is still valid
                    await axiosInstance.post(REFRESH_TOKEN_URL, {
                        refreshToken: AuthService.getRefreshToken(),
                    })
                        .then(response => {
                            const { token, refreshToken, refreshTokenExpiration } = response.data;
                            AuthService.setAccessToken(token);
                            AuthService.setRefreshToken(refreshToken, refreshTokenExpiration);
                            AuthService.setRefreshTokenExpiration(refreshTokenExpiration);
                        });
                    return axiosInstance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);

// async function validateAccessToken(): Promise<void> {
//     const accessToken = AuthService.getAccessToken();
//     const refreshToken = AuthService.getRefreshToken();
//     if(accessToken === null || refreshToken === null) {
//         logout();
//     }

//     const decodedAccessToken = AuthService.parseToken(accessToken);
//     if(decodedAccessToken === null){
//         logout();
//     } else if(decodedAccessToken.exp * 1000 <= Date.now()){
//         // access token has expired
//         validateRefreshToken();
//     }
// }

function validateRefreshToken(): void {
    const refreshTokenExpiration = AuthService.getRefreshTokenExpiration() ?? (new Date()).getTime();
    if ((new Date()).getTime() >= refreshTokenExpiration) {
        console.error("Refresh token has expired, the access token cannot be regenerated without login: " +
            AuthService.getRefreshTokenExpiration());
        logout();
    }
}

function logout(): void {
    AuthService.logout();
    router.push({ name: 'login' });
}

export default axiosInstance;