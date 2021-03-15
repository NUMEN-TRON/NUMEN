<template>
    <van-nav-bar
            :title="title || $route.meta.title"
            :left-text="leftArrow ? backText : ''"
            :right-text="rightText"
            :left-arrow="leftArrow"
            :border="false"
            fixed
            placeholder
            @click-left="onClickLeft"
            @click-right="onClickRight">
    </van-nav-bar>
</template>

<script>
    import { NavBar } from 'vant'

    export default {
        name: "Header",

        components: {
            [NavBar.name]: NavBar,
        },

        props: {
            title: String,
            backText: {
                type: String,
                default: '',
            },
            rightText: {
                type: String,
                default: '',
            },
            leftArrow: {
                type: Boolean,
                default: true,
            }
        },

        methods: {
            onClickLeft() {
                if (!this.$listeners['left-click']) {
                    this.$back();
                } else {
                    this.$emit('left-click');
                }
            },
            onClickRight() {
                this.$emit('right-click');
            },
        }
    }
</script>

<style scoped>

</style>
