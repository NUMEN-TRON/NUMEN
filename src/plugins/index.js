import request from '@/http/http'
import utils from './utils'

const arr$ = {};
const arr = {};
const attr = { configurable: false, writable: true, enumerable: false };
const $http = { ...attr, value: request };

Object.keys(utils).forEach(key => {
    arr$['$' + key] = {...attr, value: utils[key]};
    arr[key] = {...attr, value: utils[key]};
});

export default {
    /**
     * 自定义方法
     * 组件内使用： this.$validator, this.$http
     * 全局使用： Vue.validator, Vue.http
     */
    install(Vue) {
        Object.defineProperties(Vue.prototype, {
            $http,
            ...arr$,
        });

        Object.defineProperties(Vue, {
            http: $http,
            ...arr,
        })
    }
}
