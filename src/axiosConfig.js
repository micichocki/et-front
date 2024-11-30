import axios from 'axios';
import config from './config';

const instance = axios.create({
    baseURL: config.backendUrl,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
        config.headers['Accept'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;