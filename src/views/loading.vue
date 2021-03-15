<template>
    <div class="f-ct">
        <van-loading color="#ffffff" type="spinner" size="20" class="mr10" />
    </div>
</template>

<script>
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r) return unescape(r[2]);
        return '';
    }

    export default {
        name: "loading",
        activated() {
            this.initTronWeb();
        },
        methods: {
            initTronWeb() {
                let timerInterval = setInterval(() => {
                    if(window.tronWeb && window.tronWeb.defaultAddress.base58){
                        clearInterval(timerInterval);
                        clearTimeout(timerTimeout);
                        this.$go('/login?code=123' + getQueryString('code'));
                    }
                }, 16);

                let timerTimeout = setTimeout(() => {
                    clearInterval(timerInterval);
                    this.$toast(this.$t('noTronWeb'));
                }, 30e3);
                this.$once('hook:deactivated', () => {
                    clearInterval(timerInterval);
                    clearTimeout(timerTimeout);
                });
            },
        }
    }
</script>

<style scoped>

</style>
