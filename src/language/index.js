import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n);

const messages = {};

const i18nContext = require.context('./modules', false, /\.js$/);
i18nContext.keys().forEach(fileName => {
    const config = i18nContext(fileName);
    let attr = fileName.replace(/(^\.\/)|(\.js$)/g, '');
    messages[attr] = config.default || config;
});

const i18n = new VueI18n({
    locale: localStorage.getItem('lang') || 'hk',
    messages
});

export default i18n
