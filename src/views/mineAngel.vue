<template>
    <div class="min-full-h bg-page-2">
        <header-nav title="我的守护神"/>
        <div class="swiper-container mt20">
            <div class="swiper-wrapper">
                <div v-for="(item, index) in dataList" :key="index" class="swiper-slide">
                    <img class="full-w" :src="item.godPicture" alt="">
                </div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <div class="px25 py25 mt25">
            <div class="f-ct">
                <div class="mr15">
                    <van-button class="br4 h30" type="primary" plain @click="editorClick">编辑</van-button>
                </div>
                <div class="mr15">
                    <van-button class="br4 h30" type="primary" plain @click="rollOutClick">转出</van-button>
                </div>
                <div class="">
                    <van-button v-if="currentActive"
                                class="br4 h30 border-thr c-8 disabled"
                                disabled
                                type="" plain style="padding: 0 6px;">已激活</van-button>
                    <van-button v-else class="br4 h30" type="danger" plain style="padding: 0 6px;"
                                @click="activeClick">立即激活</van-button>
                </div>
            </div>
			<p class="mt25">守护神说明：</p>
			<p class="c-6 mt05 f12">守护神是基于TRC-721协议发行的NFT数字货币（非同质化代币），并具有可编辑功能，包括修改需要守护的主人头像、座右铭、唯一性的署名等。获得NFT的同时也将获得挖矿收益能力，每一枚NFT都将获得100MPS/天的回报，有效周期为：30天，到期后需要销毁1500个获得持续的挖矿能力，月回报率100%。NFT守护神图腾卡每次修改都需要花费10000枚MPS。</p>
        </div>

        <!-- 转赠 弹框 居中 -->
        <van-popup
                v-model="givingDlg"
                :close-on-click-overlay="true"
                class="cus-popup cus-popup-bottom border-main br6"
                @closed="popupClosed">
            <div class="py25 px16 mx16">
                <p class="tc f18 fw600">转赠</p>
                <div class="mt30 f16">
                    <p class="f16">您将送出一张 {{ currentName }} 卡</p>
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
    import Swiper from "swiper"
    import { getOwnerAllTokenId, getNFTDetail, transferNFT, restart, validityEndTimestamp } from '../utlis/tron'

    export default {
        name: "mineAngel",
        data() {
            return {
                cardId: '',
                mySwiper: null,
                dataList: [],
                givingDlg: false,
                givingAddress: '',
                dataIdList: [],
            }
        },
        async mounted() {
            this.cardId = this.$route.query.card;
            await this.getDataList();
        },
        beforeDestroy() {
            this.mySwiper = null;
        },
        computed: {
            currentId() {
                return this.dataIdList[this.mySwiper?.activeIndex] || '';
            },
            currentName() {
                return this.dataList[this.mySwiper?.activeIndex]?.constellation || '';
            },
            currentActive() {
                return this.dataList[this.mySwiper?.activeIndex]?.active || false;
            },
        },
        methods: {
            activeClick() {
                restart(this.currentId).then(res => {
                    this.$toast('激活成功');
                    this.getDataList();
                }).catch(err => {
                    this.$toast('激活失败');
                });
            },
            givingConfirm() {
                if (!this.givingAddress) {
                    this.$toast('请输入地址');
                    return;
                }
                this.givingDlg = false;
                transferNFT(this.givingAddress, this.currentId).then(res => {
                    console.log(res);
                    this.$toast('转出成功');
                    this.getDataList();
                }).catch(err => {
                    this.$toast('转出失败');
                })
            },
            async getDataList() {
                let dataID = await getOwnerAllTokenId();
                let list = dataID.map(async item => await getNFTDetail(item));
                let dList = await Promise.all(list);
                let endTimeListP = dList.map(async (item, index) => await validityEndTimestamp(dataID[index]));
                let endTimeList = await Promise.all(endTimeListP);
                // 格林 0区
                let offset = 0;
                let time = new Date();
                // 本地时间(分钟) + 本地时区偏移(分钟) + 指定时区()  => 得到指定时区的当前时间
                // time.setMinutes(time.getMinutes() + time.getTimezoneOffset() + offset * 60);
                this.dataIdList = dataID;
                this.dataList = dList.map((item, index) =>
                    ({...item, active: endTimeList[index] * 1000 - time.getTime() > 0})
                );
                this.initSwiper();
            },
			rollOutClick() {
                this.givingDlg = true;
			},
			editorClick() {
                // this.mySwiper.slideTo(4);
				// this.mySwiper.activeIndex index 0
				this.$go('/editGod?id=' + this.currentId);
			},
            popupClosed() {
                this.givingAddress = '';
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