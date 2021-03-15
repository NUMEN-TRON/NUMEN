<template>
    <div class="min-full-h bg-page-2">
        <header-nav title="我的守护卡"/>
        <div class="swiper-container mt20">
            <div class="swiper-wrapper">
                <div v-for="(item, index) in dataList" :key="index" class="swiper-slide">
                    <img src="https://numentrx.oss-cn-hongkong.aliyuncs.com/guardian.jpeg" class="full-w" alt="">
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <div class="px25 py25 mt25">
            <div class="f-ct">
                <div class="mr15">
                    <van-button
                            v-if="canMergeGod && goldList.length"
                            class="br4 h30"
                            type="primary"
                            plain
                            style="padding: 0 13px;"
                            @click="mergeGodDlg = true">合成守护神</van-button>
                    <van-button
                            v-else
                            class="br4 h30 border-thr c-8 disabled"
                            type=""
                            disabled
                            plain
                            style="padding: 0 13px;">合成守护神</van-button>

                </div>
                <div class="">
                    <van-button
                            v-if="dataList[currentSwipeIndex].fdiState === '1'"
                            class="br4 h30 border-thr c-8 disabled"
                            type=""
                            disabled
                            plain
                            style="padding: 0 13px;">已激活</van-button>
                    <van-button
                            v-else-if="dataList[currentSwipeIndex].fdiState === '2'"
                            class="br4 h30"
                            type="primary"
                            plain
                            style="padding: 0 13px;"
                            @click="activationClick">激活</van-button>
                    <van-button
                            v-else-if="dataList[currentSwipeIndex].fdiState === '3'"
                            class="br4 h30 border-thr c-8 disabled"
                            type=""
                            disabled
                            plain
                            style="padding: 0 13px;">已失效</van-button>
                </div>
            </div>
            <p class="mt25">守护卡说明：</p>
            <p class="c-6 mt05 f12">守护卡可参与挖矿，每张守护卡每天可获得10枚MPS，有效周期为：30天，MPS可转让交易，到期后需要销毁200个获得持续挖矿的能力，月回报率为50%；守护卡持续60天未激活挖矿即自动失去守护能力，不能再激活挖矿。</p>
        </div>

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
                <p class="tc f18 fw500 pa full-w" style="top:15%;">恭喜成功合成守护神</p>
                <img class="pa-center"
                     style="width: 64%;"
                     src="https://numentrx.oss-cn-hongkong.aliyuncs.com/guardian.jpeg" alt="">
            </div>
            <div class="pa full-w" style="left: 0; bottom: 12%;">
                <div class="mx30 px33 mt20">
                    <div class="px33">
                        <van-button
                                type="primary"
                                block
                                class="btn-sd br44"
                                @click="editGodClick">立即编辑</van-button>
                    </div>
                </div>
            </div>
        </van-overlay>
    </div>
</template>

<script>
    import Swiper from "swiper"

    export default {
        name: "mineCard",
        data() {
            return {
                cardId: '',
                mySwiper: null,
                dataList: [{fdiState: ''}],
                canMergeGod: false,
                mergeGodDlg: false,
                showCardLoading: false,
                showMergeSuccess: false,
                goldList: [],
                activeGodItem: '',
            }
        },
        activated() {
            this.cardId = this.$route.query.card;
            this.getDataList();
            this.getHeaderCardInfo();
            this.getGoldList();
        },
        deactivated() {
            this.mySwiper = null;
        },
        computed: {
            currentSwipeIndex() {
                return this.mySwiper?.activeIndex || 0;
            },
        },
        methods: {
            async getGoldList() {
                let params = {
                    page: 1,
                    num: 13,
                    gold: 1,
                };
                let url = '/mobile/constellation/mine';
                this.goldList = await this.$http.get(url, { params });
            },
            activationClick() {
                let url = '/mobile/guardian/active';
                this.$http.post(url).then(res => {
                    this.$toast('激活成功');
                    this.getDataList();
                });
            },
            async getDataList() {
                this.mySwiper = null;
                let url = '/mobile/guardian/list';
                this.dataList = await this.$http.get(url);
                this.initSwiper();
            },
            editGodClick() {
                this.showMergeSuccess = false;
                this.$go('/editGod?id=321');
            },
            rollOutClick() {
                console.log(123);
                this.mySwiper.slideTo(4);
            },
            mergeGodConfirm() {
                this.mergeGodDlg = false;
                this.showCardLoading = true;
                let url = '';
                this.$http.post(url).then(res => {
                    this.getDataList();
                }).finally(() => {
                    setTimeout(() => {
                        this.showCardLoading = false;
                    }, 6e3);
                });
            },
            editorClick() {
                // this.mySwiper.activeIndex index 0
                console.log(this.mySwiper.activeIndex);
            },
            async getHeaderCardInfo() {
                let url = '/mobile/guardian/all';
                let res = await this.$http.get(url);
                this.canMergeGod = res && res.guardian > 0;
            },
            initSwiper() {
                this.mySwiper = new Swiper(".swiper-container", {
                    direction: "horizontal",
                    loop: false,
                    slidesPerView: "auto",
                    centeredSlides: true,
                    watchSlidesProgress: true,
                    observer: true,
                    observeParents: true,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction',
                    },
					on: {
						setTranslate() {
							Array.from(this.slides).forEach((item, index) => {
                                this.slides.eq(index).transform(`scale(${1 - Math.abs(item.progress) / 8})`);
                            });
						},
						setTransition(tran) {
                            Array.from(this.slides).forEach((item, index) => {
                                this.slides.eq(index).transform(tran);
                            });
						}
					}
                });
            }
        }
    }
</script>

<style scoped>

</style>