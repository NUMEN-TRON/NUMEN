
const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue')
    },
    {
        path: '/exchange',
        component: () => import(/* webpackChunkName: "exchange" */ '@/views/exchange.vue')
    },
    {
        path: '/angel',
        component: () => import(/* webpackChunkName: "angel" */ '@/views/angel.vue')
    },
    {
        path: '/mining',
        component: () => import(/* webpackChunkName: "mining" */ '@/views/mining.vue')
    },
    {
        path: '/bag',
        component: () => import(/* webpackChunkName: "bag" */ '@/views/bag.vue')
    },
    {
        path: '/mineAngel',
        // meta: {
        //     keepAlive: false,
        // },
        component: () => import(/* webpackChunkName: "mineAngel" */ '@/views/mineAngel.vue')
    },
    {
        path: '/mineCard',
        component: () => import(/* webpackChunkName: "mineCard" */ '@/views/mineCard.vue')
    },
    {
        path: '/editGod',
        component: () => import(/* webpackChunkName: "editGod" */ '@/views/editGod.vue')
    },
    {
        path: '*',
        redirect: '/home',
    },
];


export default routes
