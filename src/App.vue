<template>
    <div id="app">
        <transition>
            <keep-alive :exclude="['mineAngel', 'editGod']">
                <router-view v-if="showView" class="page"></router-view>
                <div v-else class="page f-ct full-h">
                    <van-loading color="#ffffff" type="spinner" size="20">
                        {{ $t('loading') }}
                    </van-loading>
                </div>
            </keep-alive>
<!--            <router-view v-if="$route.meta.keepAlive"></router-view>-->
        </transition>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showView: false,
            }
        },
        mounted() {
            this.initTronWeb();
        },
        methods: {
            initTronWeb() {
                let timerInterval = setInterval(() => {
                    if(window.tronWeb && window.tronWeb.defaultAddress.base58){
                        clearInterval(timerInterval);
                        clearTimeout(timerTimeout);
                        this.showView = true;
                    }
                }, 16);

                let timerTimeout = setTimeout(() => {
                    clearInterval(timerInterval);
                    this.$toast(this.$t('noTronWeb'));
                }, 30e3);
                this.$once('hook:beforeDestroy', () => {
                    clearInterval(timerInterval);
                    clearTimeout(timerTimeout);
                });
            },
        }
    }
</script>

<style lang="scss">
    @import "style/reset.css";
    @import "style/base";
    @import "style/common";
    @import "style/reset_vant";


    .page {
        font-size: 14px;
        box-sizing: border-box;
    }
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active {
        will-change: transform;
        transition: all 300ms;
        position: absolute;
    }
    .slide-right-enter {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }
    .slide-right-leave-active {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
    .slide-left-enter {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
    .slide-left-leave-active {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }
</style>
