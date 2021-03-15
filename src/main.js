import Vue from 'vue'
import 'amfe-flexible'
import App from './App.vue'
import router from './router'
import store from './store'
import Plugins from './plugins'
import Filters from './filters'
import Directives from './directives'
import './vant'
import i18n from './language'
import tronWeb from 'tronweb'

import HeaderNav from "./components/HeaderNav"

Vue.component('HeaderNav', HeaderNav);

Vue.use(Plugins);
Vue.use(Filters);
Vue.use(Directives);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');
