import axios from 'axios';
import store from '@/store';
axios.defaults.baseURL = 'https://127.0.0.1:8000/api';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.getters.accessToken;