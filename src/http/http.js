import axios from 'axios'
import Qs from 'qs'
import store from '@/store'
const Env = require('@/env.js');
import Error from './error'

const http = axios.create({
    timeout: 1000 * 30,
    baseURL: Env.host || Env.baseUrl,
});

http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/**
 * 请求拦截器
 */
http.interceptors.request.use(
    config => {
        config.headers['XPS-Address'] = window.tronWeb.defaultAddress.base58 || '';
        config.headers['XPS-Token'] = store.state.token;
        config.headers['XPS-Language'] = localStorage.getItem('lang') || 'hk';
        if(Qs.stringify(config.data)){
            config.data = Qs.stringify(config.data)
        }
        return config;
    },
    error => Promise.error(error)
);

/**
 * 响应拦截器
 */
http.interceptors.response.use(
    res => {
        let data = res.data;
        if (data.code === 200) {
            return Promise.resolve(data.data);
        } else {
            Error.errorHandle(data);
            return Promise.reject(data);
        }
    },
    // 请求失败
    error => {
        Error.errorNetwork(error);
        return Promise.reject(error);
    }
);

export default http
