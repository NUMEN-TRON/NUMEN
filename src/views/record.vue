<template>
    <div style="overflow: initial">
        <header-nav :title="type + '明细'"></header-nav>
        <div class="bg-fill px20">
            <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad">
                <div v-for="(item, index) in dataList"
                     :key="index"
                     class="py10 border-bottom flex align-center">
                    <div class="flex-1">
                        <div class="c-3">转入</div>
                        <div class="f11 c-4">2019-11-25 19:20:13</div>
                    </div>
                    <div v-if="index % 2 === 0" class="c-deg fw500">+{{ item }}</div>
                    <div v-else class="c-3 fw500">-{{ item }}</div>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script>
    export default {
        name: "record",
        data: () => ({
            type: 'MSK',
            loading: false,
            finished: false,
            dataList: [],
        }),
        activated() {
            this.type = this.$route.query.type || 'MSK';
            this.loading = false;
            this.finished = false;
            this.dataList = [];
            this.onLoad();
        },
        methods: {
            onLoad() {
                setTimeout(() => {
                    for (let i = 0; i < 20; i++) {
                        this.dataList.push(this.dataList.length + 1);
                    }

                    // 加载状态结束
                    this.loading = false;

                    // 数据全部加载完成
                    if (this.dataList.length >= 100) {
                        this.finished = true;
                    }
                }, 1000);
            },
        }
    }
</script>

<style scoped>

</style>
