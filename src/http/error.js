import router from '@/router'
import Store from '@/store'
import { Toast, Notify  } from 'vant'

const err = {
    /**
     * 请求失败后的错误统一处理
     */
    doCode: ['5007', '4003', '4002'],
    errorHandle(data) {
        let code = data.code + '';
        if (this.doCode.includes(code)) {
            this[code](data);
        } else {
            Toast(data.data);
        }
    },

    errorNetwork() {
        // Toast.fail('网络错误');
    },
    /**
     * 跳转登录页
     * 携带当前页面路由，在登录页面完成登录后返回当前页面
     */
    toLogin: () => {
        router.replace({
            path: '/login',
            query: {
                redirect: router.currentRoute.fullPath
            }
        });
    },
    ['5007']: data => {
        console.log('401得错误 errMethods', data);
    },
    ['4002']: data => {
        Store.commit('SET_REGISTER_INVITE_DLG', true);
    },
    ['4003']: data => {
        console.log('401得错误 errMethods', data);
    },

};

export default err
