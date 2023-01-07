import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:8000'
});
// delete axiosInstance.defaults.headers.common["Authorization"];
export default axiosInstance;