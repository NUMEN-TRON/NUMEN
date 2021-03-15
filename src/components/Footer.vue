<template>
    <van-tabbar
            route
            fixed
            :border="false"
            placeholder
            safe-area-inset-bottom
            active-color="#217CCF"
            inactive-color="#666">
        <van-tabbar-item replace to="/home">
            <span>home</span>
            <template #icon="props">
                <img v-if="props.active" src="../assets/img/bar/footer_ic01_a.png" />
                <img v-else src="../assets/img/bar/footer_ic01.png" />
            </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/rotary">
            <span>抽奖</span>
            <template #icon="props">
                <img v-if="props.active" src="../assets/img/bar/footer_ic02_a.png" />
                <img v-else src="../assets/img/bar/footer_ic02.png" />
            </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/wallet">
            <span>钱包</span>
            <template #icon="props">
                <img v-if="props.active" src="../assets/img/bar/footer_ic03_a.png" />
                <img v-else src="../assets/img/bar/footer_ic03.png" />
            </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/center">
            <span>我的</span>
            <template #icon="props">
                <img v-if="props.active" src="../assets/img/bar/footer_ic04_a.png" />
                <img v-else src="../assets/img/bar/footer_ic04.png" />
            </template>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
    export default {
        name: "Footer",

        data() {
            return {
            }
        }
    }
</script>

<style scoped>

</style>
