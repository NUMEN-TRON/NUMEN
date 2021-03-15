<template>
    <div class="min-full-h bg-page-2">
        <header-nav title="我的卡包"/>
        <div class="px25 py10">
            <div class="br4 bg-fill-2 py16 border-main2 flex tc">
                <div class="flex-1" @click="headerCardInfo.guardian > 0 && $go('/mineCard?card=123')">
                    <p class="f22">{{ headerCardInfo.guardian }}</p>
                    <p class="f15 mt05">守护卡</p>
                </div>
                <div class="flex-1" @click="headerCardInfo.patronsaint > 0 && $go('/mineAngel?card=123')">
                    <p class="f22">{{ headerCardInfo.patronsaint }}</p>
                    <p class="f15 mt05">守护神</p>
                </div>
            </div>
            <van-list
                    class="mt10"
                    v-model="listLoading"
                    :finished="listFinished"
                    :loading-text="i18n('loading')"
                    :finished-text="i18n('noMore')"
                    :error-text="i18n('loadErr')"
                    :immediate-check="false"
                    @load="getDataList">
                <div v-for="item in dataList" :key="item.ID" class="py20 border-bottom f-sb">
                    <div class="pr mr20">
                        <img class="w-54 mt05" :src="item.fdcImage" alt="">
                        <div class="pa card-num f18">x{{ item.fdmAmt | filterDecimal(0) }}</div>
                    </div>
                    <div class="flex-1 f-column f-sb py03">
                        <div>
                            <span class="c-919">星座：</span>
                            <span>{{ item.fdcName }}</span>
                        </div>
                        <div class="flex">
                            <div class="mr30">
                                <van-button
                                        type="primary"
                                        class="h30 br4"
                                        plain
                                        @click="sellToMarket(item)">出售</van-button>
                            </div>
                            <van-button
                                    type="primary"
                                    class="h30 br4"
                                    plain @click="givingClick(item)">转赠</van-button>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>


        <!-- 出售 弹框 居中 -->
        <van-popup
                v-model="sellDlg"
                :close-on-click-overlay="true"
                class="cus-popup cus-popup-bottom border-main br6"
                @closed="popupClosed">
            <div class="py25 px16 mx16">
                <p class="tc f18 fw600">出售</p>
                <div class="mt30">
                    <p class="f16">您将出售一张 <span class="c-00c">{{ activeCardInfo.fdcName }}</span> 卡</p>
                    <p class="mt10 f16">价格：</p>
                    <div class="input-box mt10 h-44 br6">
                        <input type="text" v-model="sellPrice" placeholder="请输入出售的价格">
                    </div>
                </div>
                <div class="mt40">
                    <van-button
                            type="primary"
                            block
                            class="br6"
                            @click="sellToMarketConfirm">
                        {{ $t('confirm') }}
                    </van-button>
                </div>
                <div class="f-ct py10 mt10">
                    <span class="" @click="sellDlg = false">取消</span>
                </div>
            </div>
        </van-popup>

        <!-- 转赠 弹框 居中 -->
        <van-popup
                v-model="givingDlg"
                :close-on-click-overlay="true"
                class="cus-popup cus-popup-bottom border-main br6"
                @closed="popupClosed">
            <div class="py25 px16 mx16">
                <p class="tc f18 fw600">转赠</p>
                <div class="mt30 f16">
                    <p class="f16">您将送出一张 <span class="c-00c">{{ activeCardInfo.fdcName }}</span> 卡</p>
                    <div class="mt10">地址</div>
                    <div class="input-box mt10 h-44 br6">
                        <input type="text" v-model="givingAddress" placeholder="请输入对方的地址">
                    </div>
                </div>
                <div class="mt40">
                    <van-button
                            type="primary"
                            block
                            class="br6"
                            @click="givingConfirm">
                        {{ $t('confirm') }}
                    </van-button>
                </div>
                <div class="f-ct py10 mt10">
                    <span class="" @click="givingDlg = false">取消</span>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "bag",
        data() {
            return {
                pageNum: 1,
                pageSize: 10,
                listLoading: false,
                listFinished: false,
                dataList: [],
                sellDlg: false,
                givingDlg: false,
                activeCardInfo: {},
                givingAddress: '',
                headerCardInfo: {},
                sellPrice: '',
            }
        },
        computed: {
            i18n() {
                return this.$t;
            }
        },
        activated() {
            this.pageNum = 1;
            this.listLoading = false;
            this.listFinished = false;
            this.getDataList();
            this.getHeaderCardInfo();
        },
        methods: {
            givingClick(item) {
                this.givingDlg = true;
                this.activeCardInfo = item;
            },
            givingConfirm() {
                if (!this.givingAddress) {
                    this.$toast('请输入地址');
                    return;
                }
                let body = {
                    fdcNo: this.givingAddress,
                    constellationID: this.activeCardInfo.ID,
                }
                this.givingDlg = false;
                let url = '/mobile/ctran/create';
                this.$http.post(url, body).then(res => {
                    this.$toast('赠送成功');
                    this.pageNum = 1;
                    this.getDataList();
                });
            },
            sellToMarket(item) {
                this.sellDlg = true;
                this.activeCardInfo = item;
            },
            sellToMarketConfirm() {
                if (!this.sellPrice) {
                    this.$toast('请输入价格');
                    return;
                }
                let body = {
                    type: 2,
                    price: this.sellPrice,
                    constellationID: this.activeCardInfo.ID,
                }
                this.sellDlg = false;
                let url = '/mobile/gtran/create';
                this.$http.post(url, body).then(res => {
                    this.$toast('出售成功');
                    this.pageNum = 1;
                    this.getDataList();
                });
            },
            getDataList() {
                if (this.pageNum === 1) this.dataList = [];
                let params = {
                    gold: 0,
                    page: this.pageNum,
                    num: this.pageSize,
                };
                let url = '/mobile/constellation/mine';
                this.$http.get(url, { params }).then(res => {
                    this.pageNum ++;
                    this.dataList = this.dataList.concat(res);
                    if (res.length < this.pageSize) this.listFinished = true;
                }).catch(err => {
                    this.listFinished = true;
                });
            },
            async getHeaderCardInfo() {
                let url = '/mobile/guardian/all';
                this.headerCardInfo = await this.$http.get(url);
            },
            popupClosed() {
                this.activeCardInfo = {};
                this.sellPrice = '';
                this.givingAddress = '';
            },
        }
    }
</script>

<style scoped>
    .card-num {
        top: -8px;
        right: -10px;
    }
</style>