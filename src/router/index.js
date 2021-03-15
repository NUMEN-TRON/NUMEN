import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter);

routes.forEach(route => {
    route.name = route.path.split('/').pop();
});

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    next();
});

router.afterEach(() => {

});

export default router
