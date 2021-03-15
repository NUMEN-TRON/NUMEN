<template>
    <div class="pr home-page">
        <HeaderLogo class="px18"/>
        <div class="px25">
            <div class="f-ct mt20">
                <img class="h-89" src="../assets/img/logo.png" alt="">
            </div>
            <div class="bg-fill-2 br6 flex py20 tc mt16">
                <div class="flex-1">
                    <div class="c-1">累計交易额（TRX)</div>
                    <div class="mt08 f16">{{ headerInfo.trx_trade_num | filterDecimal }}</div>
                </div>
                <div class="flex-1">
                    <div class="c-1">24h交易额（TRX)</div>
                    <div class="mt08 f16">{{ headerInfo.trx_day_trade_num | filterDecimal }}</div>
                </div>
            </div>
            <div class="bg-fill-2 br6 flex py20 tc mt16">
                <div class="flex-1" @click="takeTRXClick">
                    <div class="c-1">TRX 余额(可提)</div>
                    <div class="mt08 f16">{{ headerInfo.trx_num | filterDecimal }}</div>
                </div>
                <div class="flex-1" @click="takeMPSClick">
                    <div class="c-1">MPS 余额(可提)</div>
                    <div class="mt08 f16">{{ headerInfo.mps_num | filterDecimal }}</div>
                </div>
            </div>
            <van-notice-bar
                    color="#fff"
                    background="transparent"
                    scrollable
                    style="padding: 0 2px;"
                    :text="noticeInfo.fdcName" >
                <template #left-icon>
                    <span>公告：</span>
                </template>
            </van-notice-bar>
            <div class="mt10 f-sb tc">
                <div @click="$go('/exchange')">
                    <img class="h-52" src="../assets/img/tab1.png" alt="">
                    <p class="mt05">交易广场</p>
                </div>
                <div @click="$go('/angel')">
                    <img class="h-52" src="../assets/img/tab2.png" alt="">
                    <p class="mt05">晋级使者</p>
                </div>
                <div @click="$go('/mining')">
                    <img class="h-52" src="../assets/img/tab3.png" alt="">
                    <p class="mt05">集卡挖矿</p>
                </div>
                <div @click="$go('/bag')">
                    <img class="h-52" src="../assets/img/tab4.png" alt="">
                    <p class="mt05">我的卡包</p>
                </div>
            </div>
            <p class="mt30 tc fw600 f17">卡牌盲盒</p>
            <div class="f-sb f-wrap">
                <div v-for="item in 12"
                     :key="item"
                     class="cd-item mt20"
                     :class="{'active': chooseCardList.includes(item)}"
                     @click="cardItemClick(item)">
                    <img v-if="chooseCardList.includes(item)" src="../assets/img/card_back_active.png" alt="">
                    <img v-else src="../assets/img/card_back.png" alt="">
                </div>
            </div>
            <div class="mt40 mx30 px33">
                <van-button
                        type="primary"
                        block
                        class="btn-sd fw500 br44"
                        @click="buyCardClick">
                    <span v-if="chooseCardList.length">{{ chooseCardList.length * 100 }} TRX</span>购买
                </van-button>
            </div>
            <p class="mt20 tc c-1">
                <span @click="gameIntroduceDlg = true">玩法介绍</span>
            </p>
            <div class="mt16 br6 bg-fill-2 py20 px10 tc">
                <p class="f16 fw500">周直推排行</p>
                <div class="flex mt20">
                    <p class="flex-5">排名</p>
                    <p class="flex-12">地址</p>
                    <p class="flex-7">直推数量</p>
                </div>
                <div v-for="(item, index) in rankList" :key="item.ID" class="flex mt14">
                    <p class="flex-5">{{ index + 1 }}</p>
                    <p class="flex-12">{{ item.fdcTel | filterAdrHeadTail(7, 4) }}</p>
                    <p class="flex-7">{{ item.fdiDRegister }}</p>
                </div>
            </div>
            <p class="tc f16 fw500 mt20">社区奖池</p>
            <div class="mt16 bg-fill-2 br6 py20 px10 tc flex">
                <div class="flex-13">
                    <div class="f-ct">
                        <span class="mr05">精英奖池</span>
                        <van-popover
                                v-model="showPopoverElite"
                                :get-container="getContainer"
                                placement="bottom"
                                trigger="click">
                            <div class="f13 py05 px10" style="width: 250px">活动期间，每销售一张卡牌盲盒所得的1.5%进入精英奖池，以每周为一个计算周期，分享的第一代粉丝新购买盲盒总数排名，奖励前10名分享者，第一名获得本周精英奖池的30%，第二名：20%，第三名10%，第四名10%，第5-10名、各6%，每周数据清零从新计算。</div>
                            <template #reference>
                                <div class="f-ct">
                                    <img class="w-17" src="../assets/img/question.png" alt="">
                                </div>
                            </template>
                        </van-popover>
                    </div>
                    <div class="c-1 f16 fw500 mt10">{{ footerInfo.inv_pool | filterDecimal }} TRX</div>
                </div>
                <div class="flex-11" @click="showBuyCard = true">
                    <div class="">倒计时</div>
                    <van-count-down
                            class="f16 fw500 mt10"
                            :time="footerInfo.inv_time * 1000"
                            @finish="getFooterInfo"/>
                </div>
            </div>
            <div class="mt16 bg-fill-2 br6 py20 px10 tc flex">
                <div class="flex-13">
                    <div class="f-ct">
                        <span class="mr05">尾单奖池</span>
                        <van-popover
                                v-model="showPopoverTail"
                                :get-container="getContainer"
                                placement="bottom"
                                trigger="click">
                            <div class="f13 px10 py05" style="width: 250px">每销售一张卡牌盲盒所得的1.5%进入尾单奖池，新参与一次即可延后60分钟开奖，如最后一名购买盲盒卡牌者60分钟后没有新用户参与，则自动获得尾单奖池内50%的资产，倒数第二名获得15%的资产，第三名获得7%的资产，第4-10名均分剩下的28%，分配完之后有新用户购买则从新启动尾单奖池。</div>
                            <template #reference>
                                <div class="f-ct">
                                    <img class="w-17" src="../assets/img/question.png" alt="">
                                </div>
                            </template>
                        </van-popover>
                    </div>
                    <div class="c-1 f16 fw500 mt10">{{ footerInfo.tail_poll | filterDecimal }} TRX</div>
                </div>
                <div class="flex-11">
                    <div class="">倒计时</div>
                    <van-count-down
                            class="f16 fw500 mt10"
                            :time="footerInfo.tail_time * 1000"
                            @finish="getFooterInfo"/>
                </div>
            </div>
            <div class="mt50 flex tc">
                <div class="flex-1 mr17 h-36 lh36 border-main br6 c-1">商务合作</div>
                <div class="flex-1 mr17 h-36 lh36 border-main br6 bg-main">NUMEN介绍</div>
                <div class="flex-1 h-36 lh36 border-main br6 c-1" @click="sourceCodeClick">代碼公开</div>
            </div>
            <div class="py20"></div>
        </div>

        <!-- 充值金额 底部弹框 -->
        <van-popup
                v-model="currencyConfirmDlg"
                closeable
                position="bottom"
                :close-on-click-overlay="false"
                close-icon-position="top-left"
                class="py15 cus-popup-bottom"
                @closed="popClosedCallback">
            <div class="tc f17 fw500">购买确认</div>
            <div class="px20 mt30">
                <div class="input-box h-50">
                    <input class="mr10" type="number" v-model="currencyValue" :placeholder="i18n('flowCountP')">
                    <span class="f17">TRX</span>
                </div>
                <p class="mt20 lh2"><!--溫馨提示-->{{ i18n('warmPrompt') }}：</p>
                <p class="c-c2c f12 lh2">本次将在您的绑定钱包余额中支持，请确保余额充足；</p>
                <p class="c-c2c f12 lh2">支付成功后您将获得一张随机的星座卡牌，包括普通星座卡和 黄金星座卡；</p>
                <div class="py10 mt20">
                    <van-button
                            class="f16 br6"
                            type="primary"
                            block
                            @click="currencyConfirmClick">
                        <div class="f-ct">
                            <van-loading v-if="currencyLoading" color="#ffffff" type="spinner" size="20" class="mr10" />
                            <span><!--確 認-->{{ i18n('conf') }}</span>
                        </div>
                    </van-button>
                </div>
            </div>
        </van-popup>

        <!-- 完善信息 邀请地址 弹框 居中 -->
        <van-popup
                v-model="registerInviteDlg"
                :close-on-click-overlay="false"
                class="cus-popup cus-popup-bottom border-main br6">
            <div class="py25 px16 mx16">
                <p class="tc f18 fw600"><!--完善信息-->{{ i18n('perfectInfo') }}</p>
                <div class="mt30">
                    <div class="f15"><!--請先完善信息再進行後續操作-->{{ i18n('perfectInfoP') }}</div>
                    <div class="input-box mt20 h-44 br6">
                        <input type="text" v-model="shareCode" :placeholder="$t('inviteP')">
                    </div>
                </div>
                <div class="mt20 f15 c-deg">* {{ i18n('perfectInfoTip') }}</div>
                <div class="mt40">
                    <van-button
                            type="primary"
                            block
                            class="br6"
                            @click="inviteRegisterClick">
                        {{ $t('confirm') }}
                    </van-button>
                </div>
                <div class="f-ct py10 mt10">
                    <span class="c-deg" @click="setRegisterInviteDlg(false)">{{ $t('cancel') }}</span>
                </div>
            </div>
        </van-popup>

        <!-- 玩法介绍 弹框 居中 -->
        <van-popup
                v-model="gameIntroduceDlg"
                :close-on-click-overlay="true"
                class="cus-popup cus-popup-bottom border-main br6">
            <div class="py25 px16 mx16">
                <p class="tc f18 fw600">玩法介绍</p>
                <div class="mt30">
                    委屈委屈委屈委屈啊实打实大苏打实打实的大苏打实打实大苏打撒旦
                </div>
                <div class="f-ct py10 mt10">
                    <span class="" @click="gameIntroduceDlg = false">关闭</span>
                </div>
            </div>
        </van-popup>

        <!-- 购买卡牌盲盒结果 全屏 -->
        <van-overlay :show="showBuyCard">
            <div class="pa-center-y">
                <img class="full-w" src="../assets/img/card_bg.png" alt="">
                <template v-for="(item, index) in winCardList">
                    <img v-show="winCardIndex === index" :key="index"
                         class="pa-center"
                         style="width: 67%;"
                         :src="item.fdcImage" alt="">
                </template>
            </div>
            <div class="pa full-w" style="left: 0; bottom: 8%;">
                <p class="tc mt30 f18 fw500">恭喜获得{{ winCardList[winCardIndex].num }}张{{ winCardList[winCardIndex].fdcName }}</p>
                <div class="mx30 px33 mt20">
                    <div class="px33">
                        <van-button
                                type="primary"
                                block
                                class="btn-sd br44"
                                @click="cardNextClick">放入我的卡包</van-button>
                    </div>
                </div>
            </div>
        </van-overlay>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    import HeaderLogo from "@/components/HeaderLogo"
    import Env from '../env'
    import { getQueryString, isAddress, depositTRX, getAccountTRXBalance } from '../utlis/tron'
    import { subtract } from '../utlis/tools'

    export default {
        name: "home",
        data() {
            return {
                shareCode: '',
                currencyLoading: false,
                chooseCardList: [],
                showPopoverElite: false,
                showPopoverTail: false,
                currencyConfirmDlg: false,
                gameIntroduceDlg: false,
                showBuyCard: false,
                headerInfo: {},
                rankList: [],
                footerInfo: {},
                currencyValue: '',
                winCardList: [{}],
                winCardIndex: 0,
                noticeInfo: {},
            }
        },
        components: {
            HeaderLogo,
        },
        computed: {
            ...mapState(['token', 'registerInviteDlg']),
            Env() {
                return Env;
            },
            i18n() {
                return this.$t;
            }
        },
        activated() {
            this.getIsRegister();
        },
        methods: {
            ...mapMutations({
                setToken: 'SET_TOKEN',
                setUserInfo: 'SET_USER_INFO',
                setRegisterInviteDlg: 'SET_REGISTER_INVITE_DLG',
            }),
            takeTRXClick() {
                if (!+this.headerInfo.trx_num){
                    this.$toast('暂无可提现余额');
                    return;
                }
                let url = 'mobile/withdraw/withdraw';
                this.$dialog({
                    message: `本次提现金额：${+this.headerInfo.trx_num}TRX`,
                    showCancelButton: true,
                }).then(() => {
                    this.$http.post(url).then(res => {
                        this.$toast('提现成功');
                        this.getHeaderInfo();
                    });
                }).catch(() => {
                })
            },
            takeMPSClick() {
                if (!+this.headerInfo.mps_num){
                    this.$toast('暂无可提现余额');
                    return;
                }
                let url = 'mobile/withdrawmps/withdraw';
                this.$dialog({
                    message: `本次提现金额：${+this.headerInfo.mps_num}MPS`,
                    showCancelButton: true,
                }).then(() => {
                    this.$http.post(url).then(res => {
                        this.$toast('提现成功');
                        this.getHeaderInfo();
                    });
                }).catch(() => {
                })
            },
            cardNextClick() {
                if (this.winCardList.length > this.winCardIndex + 1) {
                    this.winCardIndex ++;
                } else {
                    this.showBuyCard = false;
                    setTimeout(() => {
                        this.winCardIndex = 0;
                    }, 1000)
                }
            },
            async buyCardClick() {
                if (!this.chooseCardList.length) return;
                let rechargeNum = this.chooseCardList.length * 100;
                if (+this.headerInfo.trx_num < rechargeNum) {
                    this.currencyValue = subtract(rechargeNum, this.headerInfo.trx_num);
                    this.currencyConfirmDlg = true;
                } else {
                    this.buyCard();
                }
            },
            buyCard() {
                let url = 'mobile/blindbox/create';
                this.$http.post(url, {num: this.chooseCardList.length}).then(res => {
                    let arr = [];
                    res.forEach(item => {
                        let tt = arr.find(sub => sub.fdcName === item.fdcName);
                        if (tt) {
                            tt.num++;
                        } else {
                            arr.push({
                                num: 1,
                                fdcName: item.fdcName,
                                fdcImage: item.fdcImage,
                            })
                        }
                    });
                    this.winCardList = arr;
                    this.showBuyCard = true;
                    // this.$dialog({message: '购买成功'});
                    this.getHeaderInfo();
                    this.getFooterInfo();
                }).catch(err => {
                    this.$dialog({message: '购买失败'});
                }).finally(() => {
                    this.chooseCardList.length = 0;
                });
            },
            async currencyConfirmClick() {
                let { currencyValue } = this;
                if (!currencyValue) {
                    this.$toast('請輸入数量');
                    return;
                }
                if (this.currencyLoading) return;
                this.currencyLoading = true;
                let accountBalance = await getAccountTRXBalance();
                if (+accountBalance < +currencyValue) {
                    this.$toast(this.$t('sellMoney'));
                    this.currencyLoading = false;
                    return;
                }
                depositTRX(currencyValue).then(res => {
                    let url = 'mobile/contract/create';
                    this.$http.post(url, {txID: res.txid}).then(r => {
                        this.$dialog({message: this.$t('rechargeSuc')});
                    })
                }).finally(() => {
                    this.currencyLoading = false;
                    this.currencyValue = '';
                    setTimeout(() => {
                        this.currencyConfirmDlg = false;
                    }, 300);
                });
            },
            async getHeaderInfo() {
                let url = 'mobile/amount/all';
                this.headerInfo = await this.$http.get(url);
            },
            async getRankList() {
                let url = 'mobile/member/invweek';
                this.rankList = await this.$http.get(url);
            },
            async getFooterInfo() {
                let url = 'mobile/amount/pool';
                this.footerInfo = await this.$http.get(url);
            },
            getContainer() {
                return document.querySelector('.home-page');
            },
            cardItemClick(key) {
                if (this.chooseCardList.includes(key)) {
                    this.chooseCardList.splice(this.chooseCardList.findIndex(sub => sub === key), 1);
                } else {
                    this.chooseCardList.push(key);
                }
            },
            pollingTimerInterval() {
                if (!this.token) return;
                this.getHeaderInfo();
                this.getRankList();
                this.getFooterInfo();
                this.getNoticeInfo();
                let reloadTimer = setInterval(() => {
                    this.getHeaderInfo();
                    this.getFooterInfo();
                }, 20e3);
                this.$once('hook:deactivated', () => {
                    clearInterval(reloadTimer);
                });
            },
            inviteRegisterClick() {
                let { shareCode } = this;
                if (!shareCode) {
                    this.$toast(this.$t('inviteP'));
                    return;
                }
                if (!isAddress(shareCode)) {
                    // this.$toast('請輸入正確的邀請地址');
                    this.$toast(this.$t('errAddress'));
                    this.shareCode = '';
                    return;
                }
                this.setRegisterInviteDlg(false);
                let url = 'mobile/card/reg';
                let selfAddr = window.tronWeb.defaultAddress.base58;
                let params = {
                    sharecode: shareCode,
                    phone: selfAddr,
                };
                this.$http.post(url, params).then(res => {
                    this.$toast('绑定成功');
                    this.getIsRegister();
                }).then(err => {

                })
            },
            async getIsRegister() {
                let selfAddr = window.tronWeb.defaultAddress.base58;
                let params = {
                    phone: selfAddr,
                };
                let url = '/mobile/card/login';
                this.$http.post(url, params).then(res => {
                    this.setUserInfo(res.user);
                    this.setToken(res.token);
                    this.pollingTimerInterval();
                }).catch(() => {
                    this.setRegisterInviteDlg(true);
                    this.shareCode = getQueryString('code') || '';
                });
            },
            popClosedCallback() {
               this.currencyValue = '';
            },
            sourceCodeClick() {
                window.location.href = "https://github.com/usdtmixer/turbo";
            },
            async getNoticeInfo() {
                let params = {
                    type: 1,
                    page: 1,
                    num: 10,
                }
                let url = 'mobile/Aqanda/getAqandaList';
                let res = await this.$http.get(url, {params});
                this.noticeInfo = res[0] || {};
            }
        }
    }
</script>

<style scoped>
    /deep/ .van-notice-bar {
        font-size: 13px;
    }
    .mh100 { max-height: 300px; }
    .cd-item {
        width: 54px;
        height: 73px;
        position: relative;
        margin-right: 8%;
    }
    .cd-item:nth-child(4n) {
        margin-right: 0;
    }
    .cd-item > img {
        width: 100%;
        height: 100%;
        position: absolute;
        transform: scale(1);
        transition: all .1s linear;
    }
    .cd-item.active > img {
        transform: scale(1.2);
    }
</style>
