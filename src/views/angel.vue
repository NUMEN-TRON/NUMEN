<template>
    <div class="min-full-h bg-page-2">
        <header-nav title="晉級使者"/>
        <div class="px25 py10">
            <p>V1使者:</p>
            <p>质押5000TRX即可晋级，可获得社群内盲盒销售额10%的奖励；</p>
            <p class="mt25">V2使者:</p>
            <p>质押15000TRX即可晋级，可获得社群内盲盒销售额20%的奖励；</p>
            <p class="mt25">V3使者:</p>
            <p>质押50000TRX即可晋级，可获得社群内盲盒销售额25%的奖励；</p>
            <p class="mt25">特别说明：</p>
            <p>1. 质押资金可随时赎回，赎回后所有奖励自动停止，且必须等到7天以后才可重新质押晋级；</p>
            <p>2. 如社群内出现低级别代理则需要扣除低级别使者奖金，如出现同级别者使者或更高级别使者则按收益的20%计算奖励；</p>
            <div class="mt30">选择质押金额</div>
            <div v-for="item in angelData"
                 :key="item.id"
                 class="h-44 br6 px16 bor border-sec f-ct pr fw600 f16 mt16"
                 :class="{'c-5 bg-sec' : activeTab === item.id}"
                 @click="pledgeItemClick(item.id)">
                <div class="pa-center-y" style="left: 17px;">V{{ item.level }}使者</div>
                <div class="">{{ item.num }} TRX</div>
            </div>
            <div class="mt30 flex">
                <div class="flex-1 mr30">
                    <van-button block type="primary" class="br6" @click="pledgeClick">质押</van-button>
                </div>
                <div class="flex-1">
                    <van-button block type="primary" class="br6 c-main" plain @click="redeemClick">赎回</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "angel",
        data() {
            return {
                activeTab: 1,
                angelData: [
                    {id: 1, level: 100, num: 5000 },
                    {id: 2, level: 200, num: 15000 },
                    {id: 3, level: 300, num: 50000 },
                ]
            }
        },
        created() {
            this.getInfo()
        },
        methods: {
            pledgeItemClick(id) {
                if (this.activeTab === id) return;
                this.activeTab = id;
            },
            getInfo() {
                this.$http.get('/mobile/member/info').then(res => {

                    let level = res.fdlLevelID

                    let selectedItem = this.angelData.find(item => item.level == level)

                    if (!selectedItem) {
                        this.activeTab = 0
                    } else {
                        this.activeTab = selectedItem.id
                    }
                }).finally(() => {
                    setTimeout(() => {
                        this.$toast.clear();
                    }, 2e3);
                })
            },
            pledgeClick() {
                let params = {
                    level: this.angelData.find(item => item.id === this.activeTab).level,
                }
                let url = '/mobile/pledge/create';
                this.$toast({
                    type: 'loading',
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });
                this.$http.post(url, params).then(res => {
                    this.$toast('质押成功');
                }).finally(() => {
                    setTimeout(() => {
                        this.$toast.clear();
                    }, 2e3);
                })
            },
            redeemClick() {
                let params = {
                    amt: this.angelData.find(item => item.id === this.activeTab).num,
                }
                let url = '/mobile/pledge/redeem';
                this.$toast({
                    type: 'loading',
                    message: '加载中...',
                    forbidClick: true,
                    duration: 0,
                });
                this.$http.post(url, params).then(res => {
                    this.$toast('赎回成功');
                }).finally(() => {
                    setTimeout(() => {
                        this.$toast.clear();
                    }, 2e3);
                })
            },
        }
    }
</script>

<style scoped>

</style>