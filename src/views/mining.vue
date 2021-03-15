<template>
    <div class="min-full-h bg-page-2">
        <header-nav title="集卡挖矿"/>
        <div class="px16 py16">
            <div class="br4 bg-fill-2 px16 py16">
                <p class="f16 tc fw500">黄金星座卡</p>
                <div class="py05"></div>
                <div v-if="!goldList.length" class="py16 tc c-919 f16">暂无黄金星座卡～</div>
                <div v-else class="f-sb f-wrap flex-box">
                    <div v-for="item in goldList" :key="item.ID" class="pr mt16">
                        <img class="w-54" :src="item.fdcImage" alt="">
                        <p class="m tc f12">{{ item.fdcName }}</p>
                        <div class="pa card-num f20">x{{ +item.fdmAmt }}</div>
                    </div>
                    <div class="w-54" style="height: 0; visibility: hidden;"></div>
                    <div class="w-54" style="height: 0; visibility: hidden;"></div>
                </div>
            </div>
            <div class="br4 bg-fill-2 px16 py16 mt16">
                <p class="f16 tc fw500">普通星座卡</p>
                <div class="py05"></div>
                <div class="f-sb f-wrap flex-box">
                    <div v-for="item in cardList" :key="item.ID" class="pr mt16">
                        <img class="w-54" :src="item.fdcImage" alt="">
                        <p class="m tc f12">{{ item.fdcName }}</p>
                        <div v-if="item.fdmAmt > 0" class="pa card-num f20">x{{ +item.fdmAmt }}</div>
                    </div>
                    <div class="w-54" style="height: 0; visibility: hidden;"></div>
                    <div class="w-54" style="height: 0; visibility: hidden;"></div>
                </div>
            </div>
            <div class="mt20 flex">
                <div class="flex-1 mr30">
                    <van-button v-if="canMergeCard" block type="primary" class="br6" @click="mergeCardDlg = true">合成守护卡</van-button>
                    <van-button v-else block type="primary" class="br6 btn3" disabled>合成守护卡</van-button>
                </div>
                <div class="flex-1">
                    <van-button v-if="myGuardCardInfo.guardian > 0 && goldList.length > 0"
                                block type="primary" class="br6"
                                @click="mergeGodDlg = true">合成守护神</van-button>
                    <van-button v-else block type="primary" class="br6 btn3">合成守护神</van-button>
                </div>
            </div>
            <p class="mt30 f16 c-6">守护卡</p>
            <p class="f12 c-6 mt05">集齐全部12张星座卡可合成守护卡参与挖矿，每张守护卡每天可获得10枚MPS，有效周期为：30天，MPS可转让交易，到期后需要销毁200个获得持续挖矿的能力，月回报率为50%；守护卡持续60天未激活挖矿即自动失去守护能力，不能再激活挖矿。</p>
            <p class="mt30 f16 c-6">守护神</p>
            <p class="f12 c-6 mt05">守护卡+黄金星座卡合成可升级守护神，守护神是基于TRC-721协议发行的NFT数字货币（非同质化代币），并具有可编辑功能，包括修改需要守护的主人头像、座右铭、唯一性的署名等。获得NFT的同时也将获得挖矿收益能力，每一枚NFT都将获得100MPS/天的回报，有效周期为：30天，到期后需要销毁1500个获得持续的挖矿能力，月回报率100%。NFT守护神图腾卡每次修改都需要花费10000枚MPS。</p>
        </div>
        <div class="bg-fill-2 px20">
            <div class="py15 f15 flex border-bottom2">
                <div class="mr20">
                    <span class="mr10">我的守护卡</span>
                    <span class="c-7">{{ myGuardCardInfo.guardian }}</span>
                </div>
                <div class="">
                    <span class="mr10">我的守护神</span>
                    <span class="c-7">{{ myGuardCardInfo.patronsaint }}</span>
                </div>
            </div>
            <div class="py20 f-ct">
                <div class="flex-1">
                    <p>
                        <span class="mr15">当前可领取矿量</span>
                        <span>{{ +MPSInfo.minemps }} MPS</span>
                    </p>
                    <p class="mt05">
                        <span class="mr15">预估24h产矿量</span>
                        <span>{{ +MPSInfo.expectedminemps }} MPS</span>
                    </p>
                    <p class="mt05">
                        <span class="mr15">累计产矿量</span>
                        <span>{{ +MPSInfo.allminemps }} MPS</span>
                    </p>
                </div>
                <van-button class="br6"
                            type="primary"
                            size="small"
                            style="padding: 0 20px;" @click="takeMPSClick">领取</van-button>
            </div>
        </div>

        <!-- 合成守护卡 弹框 居中 -->
        <van-popup
                v-model="mergeCardDlg"
                :close-on-click-overlay="true"
                class="cus-popup cus-popup-bottom border-main br6">
            <div class="py25 px16 mx16">
                <p class="tc f18 fw600">合成守护卡</p>
                <div class="mt25 f16">
                    <img class="full-w" src="https://numentrx.oss-cn-hongkong.aliyuncs.com/guardian.jpeg" alt="">
                </div>
                <p class="mt10 tc f12">守护卡可参与挖矿，合成后将不可撤消或转让</p>
                <div class="mt25 flex">
                    <van-button
                            type="primary"
                            class="br6 flex-1"
                            size="small"
                            @click="mergeCardConfirm">
                        确认合成
                    </van-button>
                    <div class="mr25"></div>
                    <van-button
                            type="primary"
                            plain
                            size="small"
                            class="br6 flex-1 c-main"
                            style="background-color: #000000"
                            @click="mergeCardDlg = false">
                        取消
                    </van-button>
                </div>
            </div>
        </van-popup>

        <!-- 合成卡片loading 全屏 -->
        <van-overlay :show="showCardLoading" class="full-w full-h f-ct">
            <div class="" style="width: 80%;">
                <div class="tc h237">
                    <img class="w237" :class="{'run-roll': showCardLoading}" src="../assets/img/card_loading.png" alt="">
                </div>
                <div class="full-w">
                    <p class="tc mt30 f18 fw500">合成中...</p>
                    <div class="mx30 px33 mt10 f25 fw700 tc">
                        <van-count-down v-if="showCardLoading"
                                        :time="5300"
                                        @finish="(showCardLoading = false, showMergeSuccess = true)">
                            <template #default="timeData">
                                <span class="block">{{ timeData.seconds }}</span>
                            </template>
                        </van-count-down>
                    </div>
                </div>
            </div>
        </van-overlay>

        <!-- 合成成功 全屏 -->
        <van-overlay :show="showMergeSuccess" @click="showMergeSuccess = false">
            <div class="pa-center-y">
                <img class="full-w" src="../assets/img/card_bg.png" alt="">
                <p class="tc f18 fw500 pa full-w" style="top:15%;">恭喜成功合成{{ mergeType === 'card' ? '守护卡' : '守护神' }}</p>
                <img class="pa-center"
                     style="width: 64%;"
                     src="https://numentrx.oss-cn-hongkong.aliyuncs.com/guardian.jpeg" alt="">
            </div>
            <div class="pa full-w" style="left: 0; bottom: 12%;">
                <div class="mx30 px33 mt20">
                    <div class="px33">
                        <van-button
                                v-if="mergeType === 'card'"
                                type="primary"
                                block
                                class="btn-sd br44"
                                @click="showMergeSuccess = false">放入我的卡包</van-button>
                        <van-button
                                v-else
                                type="primary"
                                block
                                class="btn-sd br44"
                                @click="editGodClick">立即编辑</van-button>
                    </div>
                </div>
            </div>
        </van-overlay>

        <!-- 合成守护神 弹框 居中 -->
        <van-popup
                v-model="mergeGodDlg"
                :close-on-click-overlay="true"
                class="cus-popup cus-popup-bottom border-main br6"
                @closed="activeGodItem = ''">
            <div class="py25 px16 mx16">
                <p class="tc f18 fw600">合成守护神</p>
                <div class="mt25 f16 tc">
                    <img class="full-w" style="width: 50%" src="https://numentrx.oss-cn-hongkong.aliyuncs.com/guardian.jpeg" alt="">
                </div>
                <p class="f16 tc mt16">请选择黄金星座卡</p>
                <div class="flex mt10 py05" style="overflow-x: auto">
                    <div v-for="item in goldList" :key="item.ID" class="pr god-sel tc mr25 "
                         :class="{'active': item.ID === activeGodItem}"
                         @click="activeGodItem = item.ID">
                        <img class="w-54" :src="item.fdcImage" alt="">
                        <p>{{ item.fdcName }}</p>
                    </div>
                </div>
                <p class="mt10 tc f12">守护神可参与挖矿，合成后将不可撤消</p>
                <div class="mt25 flex">
                    <van-button
                            type="primary"
                            class="br6 flex-1"
                            size="small"
                            @click="mergeGodConfirm">
                        确认合成
                    </van-button>
                    <div class="mr25"></div>
                    <van-button
                            type="primary"
                            plain
                            size="small"
                            class="br6 flex-1 c-main"
                            style="background-color: #000000"
                            @click="mergeGodDlg = false">
                        取消
                    </van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "mining",
        data() {
            return {
                goldList: [],
                cardList: [],
                canMergeCard: false,
                mergeCardDlg: false,
                mergeGodDlg: false,
                showCardLoading: false,
                showMergeSuccess: false,
                mergeType: 'card',
                activeGodItem: '',
                myGuardCardInfo: {},
                MPSInfo: {},
            }
        },
        activated() {
            this.getGoldList();
            this.getCardList();
            this.getHeaderCardInfo();
            this.getMPSInfo();
        },
        methods: {
            takeMPSClick() {
                if(+this.MPSInfo.minemps === 0) {
                    this.$toast('暂无可领取MPS');
                    return;
                }
                let url = '/mobile/walletminemps/tackout';
                this.$http.post(url).then(res => {
                    this.$toast('领取成功');
                    this.getMPSInfo();
                });
            },
            async getMPSInfo() {
                let url = '/mobile/walletminemps/all';
                this.MPSInfo = await this.$http.get(url);
            },
            editGodClick() {
                this.showMergeSuccess = false;
                this.$go('/editGod?id=123');
            },
            mergeGodConfirm() {
                if (!this.activeGodItem) {
                    this.$toast('请选择黄金卡');
                    return;
                }
                this.mergeType = 'god';
                this.mergeGodDlg = false;
                this.showCardLoading = true;
                let body = {
                    constellationID: this.activeGodItem,  // 黄金卡ID
                }
                let url = '/mobile/patronsaint/create';
                this.$http.post(url, body).then(res => {
                    this.getCardList();
                }).catch(err => {
                    this.showCardLoading = false;
                }).finally(() => {
                    setTimeout(() => {
                        this.showCardLoading = false;
                    }, 6e3);
                });
            },
            mergeCardConfirm() {
                this.mergeType = 'card';
                this.mergeCardDlg = false;
                this.showCardLoading = true;
                let url = '/mobile/guardian/create';
                this.$http.post(url).then(res => {
                    this.getCardList();
                }).catch(err => {
                    this.showCardLoading = false;
                }).finally(() => {
                    setTimeout(() => {
                        this.showCardLoading = false;
                    }, 6e3);
                });
            },
            async getGoldList() {
                let params = {
                    page: 1,
                    num: 13,
                    gold: 1,
                };
                let url = '/mobile/constellation/mine';
                this.goldList = await this.$http.get(url, { params });
            },
            async getCardList() {
                let params = {
                    page: 1,
                    num: 13,
                    gold: 0,
                };
                let url = '/mobile/constellation/all';
                let res = await this.$http.get(url, { params });
                this.canMergeCard = res.every(item => item.fdmAmt > 0);
                this.cardList = res;
            },
            async getHeaderCardInfo() {
                let url = '/mobile/guardian/all';
                this.myGuardCardInfo = await this.$http.get(url);
            },
        }
    }
</script>

<style scoped>

    .card-num {
        top: -15px;
        right: -10px;
    }
    .flex-box > div:not(:nth-child(4n)) {
        margin-right: 4%;
    }

</style>