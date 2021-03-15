<template>
    <div class="min-full-h bg-page-2">
        <header-nav title="交易广场"/>
        <div class="px25 py10">
            <div class="f-sb tab-border pr">
                <div class="flex c-919 cus-tab-box f17 fw500" @click="tabSwitchClick">
                    <div class="mr30 pr" data-tab="buy"
                         :class="{'active': activeTab === 'buy'}">我要买</div>
                    <div class="pr" data-tab="sell"
                         :class="{'active': activeTab === 'sell'}">我要卖</div>
                </div>
                <van-popover
                        v-show="activeTab === 'buy'"
                        v-model="showPopoverBuy"
                        trigger="click"
                        placement="bottom-end"
                        :actions="actionsCardList"
                        @select="onPopoverSelect">
                    <template #reference>
                        <div class="f-ct c-1">
                            <span class="mr05">{{ activeCardItem.text }}</span>
                            <van-icon name="arrow-down" />
                        </div>
                    </template>
                </van-popover>
                <van-popover
                        v-show="activeTab === 'sell'"
                        v-model="showPopoverSell"
                        trigger="click"
                        placement="bottom-end"
                        :actions="actionsSellList"
                        @select="onPopoverSelect">
                    <template #reference>
                        <div class="f-ct c-1">
                            <span class="mr05">{{ activeCardItem.text }}</span>
                            <van-icon name="arrow-down" />
                        </div>
                    </template>
                </van-popover>
            </div>
            <van-list
                    v-model="listLoading"
                    :finished="listFinished"
                    :loading-text="i18n('loading')"
                    :finished-text="i18n('noMore')"
                    :error-text="i18n('loadErr')"
                    :immediate-check="false"
                    @load="getDataList">
                <div v-for="item in dataList" :key="item.ID" class="py20 border-bottom f-sb">
                    <img class="h-74 mr20 py05" src="../assets/card/card_aquarius_big_2@2x.png" alt="">
                    <div class="flex-1 f-sb">
                        <div class="f-column justify-between">
                            <p><span class="f18 fw600 mr10">{{ +item.fdmPrice }}</span><span class="f12">TRX</span></p>
                            <p>{{ item.fdcName }}</p>
                            <p>{{ item.fdcSaleTel | filterAdrHeadTail(6, 4) }}</p>
                        </div>
                        <div v-show="activeTab === 'buy'" class="f-column justify-end">
                            <van-button
                                    type="primary"
                                    class="h30 br4"
                                    :class="item === 1 ? 'btn2' : item === 2 ? 'btn3' : ''"
                                    :disabled="item < 3"
                                    @click="exchangeClick(item)">購買</van-button>
                        </div>
                        <div v-show="activeTab === 'sell'" class="f-column justify-end">
                            <van-button
                                    v-if="item.fdiState === '1'"
                                    type="primary"
                                    class="h30 br4"
                                    @click="backOutClick(item)">撤单</van-button>
                            <van-button
                                    v-if="item.fdiState === '2'"
                                    type="primary"
                                    class="h30 br4 btn3"
                                    disabled>已出售</van-button>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script>
    export default {
        name: "exchange",
        data() {
            return {
                activeTab: 'buy',
                showPopoverBuy: false,
                showPopoverSell: false,
                actionsCardList: [
                    {id: "0", text: "全部星座"},
                ],
                activeCardItem: {id: "0", text: '全部星座'},
                actionsSellList: [
                    {id: '0', text: '全部状态'},
                    {id: '1', text: '出售中'},
                    {id: '2', text: '已出售'},
                ],
                activeSellItem: {id: 0, text: '全部状态'},
                pageNum: 1,
                pageSize: 10,
                listLoading: false,
                listFinished: false,
                dataList: [],
            }
        },
        computed: {
            i18n() {
                return this.$t;
            }
        },
        activated() {
            this.activeTab = 'buy';
            this.activeCardItem = {id: "0", text: '全部星座'};
            this.activeSellItem = {id: '0', text: '全部状态'};
            this.pageNum = 1;
            this.listLoading = false;
            this.listFinished = false;
            this.getActionsCardList();
            this.getDataList();
        },
        methods: {
            backOutClick(item) {
                let body = {
                    fdcNo: item.fdcNo,    // cardID
                }
                let url = '/mobile/gtran/cancel';
                this.$dialog.confirm({
                    message: `确认撤销${item.fdcName}卖单？`,
                }).then(res => {
                    this.$http.post(url, body).then(res => {
                        this.$toast('撤销成功');
                        this.pageNum = 1;
                        this.getDataList();
                    });
                }).catch(err => {

                })
            },
            exchangeClick(item) {
                let body = {
                    type: this.activeTab === 'buy' ? 1 : 2,               // 1 买   2 卖
                    ID: item.ID,    // cardID
                }
                let url = '/mobile/gtran/tran';
                this.$dialog.confirm({
                    message: `确认${this.activeTab === 'buy' ? '购买' : '出售'}${item.fdcName}？`,
                }).then(res => {
                    this.$http.post(url, body).then(res => {
                        this.$toast((this.activeTab === 'buy' ? '购买' : '出售') + '成功');
                        this.pageNum = 1;
                        this.getDataList();
                    });
                }).catch(err => {

                })
            },
            async getActionsCardList() {
                let url = '/mobile/constellation/list';
                let res = await this.$http.get(url, { params: {gold: 0} });
                let arr = res.map(sub => ({
                    id: sub.ID,
                    text: sub.fdcName,
                }));
                this.actionsCardList = [{id: "0", text: '全部星座'}, ...arr];
            },
            getDataList() {
                if (this.pageNum === 1) this.dataList = [];
                let params = {
                    page: this.pageNum,
                    num: this.pageSize,
                    state: this.activeCardItem.id,
                    constellationID: this.activeCardItem.id,    // cardID
                };
                let url = '/mobile/gtran/mine';
                let url2 = '/mobile/gtran/salelist';
                this.$http.get(this.activeTab === 'buy' ? url2 : url, { params }).then(res => {
                    this.pageNum ++;
                    this.dataList = this.dataList.concat(res);
                    if (res.length < this.pageSize) this.listFinished = true;
                }).catch(err => {
                    this.listFinished = true;
                });
            },
            tabSwitchClick(e) {
                let val = e.target.getAttribute('data-tab');
                if (!val) return;
                if (this.activeTab === val) return;
                this.activeTab = val;
                if (val === 'buy') {
                    this.activeCardItem = {id: "0", text: '全部星座'};
                } else {
                    this.activeCardItem = {id: "0", text: '全部状态'};
                }
                this.pageNum = 1;
                this.getDataList();
            },
            onPopoverSelect(action) {
                this.activeCardItem = { ...action };
                this.pageNum = 1;
                this.getDataList();
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>