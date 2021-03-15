<template>
    <div class="min-full-h bg-page-2">
        <header-nav title="编辑守护神"/>
        <div class="py10 px16">
            <div class="tc">
                <img style="width: 80%" src="https://numentrx.oss-cn-hongkong.aliyuncs.com/guardian.jpeg" alt="">
                <canvas class="block-tc" id="myCanvas" width="275px" height="435px"></canvas>
            </div>
            <p class="mt16 tc f16">查看大图</p>
        </div>
        <div class="px16 mt20">
            <p class="px10 f16">卡片DIY</p>
            <div class="mt08 br8 px20 py25 bg-fill-2">
                <div class="f-sb tab-border pr">
                    <div class="flex c-919 cus-tab-box f17 fw500">
                        <div v-for="(item, index) in tabList"
                             :key="index" class="mr30 pr"
                             :class="{'active': activeTabIndex === index}"
                             @click="tabSwitchClick(index)">{{ item }}
                        </div>
                    </div>
                </div>
                <div class="flex mt40">
                    <p class="flex-7">色调</p>
                    <div class="flex-13 f-ct">
                        <van-slider
                                v-model="diyData[diyCurrentKey[activeTabIndex]].h"
                                :min="-50"
                                :max="50"
                                step="1"/>
                    </div>
                    <p class="flex-4 tr" @click="testClick">{{ diyData[diyCurrentKey[activeTabIndex]].h }}</p>
                </div>
                <div class="flex mt20">
                    <p class="flex-7">饱和度</p>
                    <div class="flex-13 f-ct">
                        <van-slider
                                v-model="diyData[diyCurrentKey[activeTabIndex]].s"
                                :min="-50"
                                :max="50"
                                step="1"/>
                    </div>
                    <p class="flex-4 tr">{{ diyData[diyCurrentKey[activeTabIndex]].s }}</p>
                </div>
                <div class="flex mt20">
                    <p class="flex-7">亮度</p>
                    <div class="flex-13 f-ct">
                        <van-slider
                                v-model="diyData[diyCurrentKey[activeTabIndex]].l"
                                :min="-50"
                                :max="50"
                                step="1"/>
                    </div>
                    <p class="flex-4 tr">{{ diyData[diyCurrentKey[activeTabIndex]].l }}</p>
                </div>
                <div class="flex mt20">
                    <p class="flex-7">清晰度</p>
                    <div class="flex-13 f-ct">
                        <van-slider
                                v-model="diyData[diyCurrentKey[activeTabIndex]].d"
                                :min="-50"
                                :max="50"
                                step="1"/>
                    </div>
                    <p class="flex-4 tr">{{ diyData[diyCurrentKey[activeTabIndex]].d }}</p>
                </div>
                <div class="flex mt20">
                    <p class="flex-1">背景图</p>
                    <div class="f-ct">
                        <span class="mr05">星空紫</span>
                        <van-icon name="arrow"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="px16 mt20">
            <p class="px10 f16">个人信息</p>
            <div class="mt08 br8 px20 py25 bg-fill-2">
                <div class="f-c-sb">
                    <p class="">头像</p>
                    <div class="f-ct">
                        <img class="wh-48 br-round mr05" src="../assets/img/card_loading.png" alt="">
                        <van-icon name="arrow"/>
                    </div>
                </div>
                <div class="f-c-sb mt16">
                    <p class="">呢称（唯一性）</p>
                    <div class="f-ct">
                        <span class="mr05">BTC皇后</span>
                        <van-icon name="arrow"/>
                    </div>
                </div>
                <div class="f-c-sb mt20">
                    <p class="">座右铭</p>
                    <div class="f-ct">
                        <span class="mr05">暴富就是我的座右铭</span>
                        <van-icon name="arrow"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt10 flex px25 py25">
            <div class="flex-1 mr30">
                <van-button block type="primary" class="br6" @click="">确认保存</van-button>
            </div>
            <div class="flex-1">
                <van-button block type="primary" class="br6 c-main" plain @click="">取消返回</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {hslToRgb, rgbToHsl, throttle} from '../utlis/tools'
    import {getNFTOwnerDetail, getNFTOwner} from '../utlis/tron'

    let mainCvs = null;
    let mainCtx = null;
    export default {
        name: "editGod",
        data() {
            return {
                currentId: '',
                activeTabIndex: 0,
                tabList: ['服饰', '头发', '兵器'],
                value1: 0,
                layerList: [],
                testValue: 0,
                diyData: {
                    dress: { // 服饰
                        h: 0,
                        s: 0,
                        l: 0,
                        d: 1,
                    },
                    hair: { // 头发
                        h: 0,
                        s: 0,
                        l: 0,
                        d: 1,
                    },
                    weapon: {   // 武器
                        h: 0,
                        s: 0,
                        l: 0,
                        d: 1,
                    }
                },
                imgList: [],
            }
        },
        computed: {
            diyCurrentKey() {
                return {
                    0: 'dress',
                    1: 'hair',
                    2: 'weapon',
                }
            },
        },
        watch: {
            diyData: {
                handler() {
                    this.initCanvasImage();
                    this.diyRedrawImage();
                },
                deep: true,
            }
        },
        async mounted() {
            this.currentId = this.$route.query.id || '';
            await this.initCanvasImage();
            await this.getImageList();
            this.diyRedrawImage();
            this.getCardDataInfo();
        },
        methods: {
            sliderValueToHls(val) {
                return val
            },
            tabSwitchClick(index) {
                if (this.activeTabIndex === index) return;
                this.activeTabIndex = index;
            },
            async getCardDataInfo() {
                getNFTOwner(this.currentId).then(res => {
                    console.log(123, res);
                });
                getNFTOwnerDetail(this.currentId).then(res => {
                    console.log(456, res);
                });
            },
            async getImageList() {
                let imgUrlList = [
                    {name: 'bg', img: 'http://img.numen-tron.io/guardian.jpeg'},
                    {
                        name: 'rr',
                        img: 'https://gd-filems.dancf.com/saas/cms/cd37d7c7-fc23-4285-a1d7-46eff5a5f6424399412.png?x-oss-process=image/resize,w_1080/interlace,1,image/format,webp'
                    },
                    {
                        name: 'bg2',
                        img: 'https://gd-filems.dancf.com/gaoding/gaoding/490569d0-408c-4c1c-a32c-30d02302a8bc1239472.png?x-oss-process=image/resize,w_1080/interlace,1,image/format,webp'
                    },
                ];
                let p = imgUrlList.map(async item => await this.loadImage(item.img));
                this.imgList = await Promise.all(p);
            },
            async initCanvasImage() {
                mainCvs = document.getElementById('myCanvas');
                mainCtx = mainCvs.getContext('2d');
                // mainCtx.globalCompositeOperation = 'source-over';//重叠部分可见，其他透明。
                // mainCtx.save();
            },
            diyRedrawImage() {
                // mainCtx.restore();
                // mainCtx.clearRect(0, 0, mainCvs.width, mainCvs.height);
                this.layerList = this.imgList.map((img, index) => {
                    let layerCvs = document.createElement('canvas');
                    layerCvs.width = mainCvs.width;
                    layerCvs.height = mainCvs.height;
                    let layerCtx = layerCvs.getContext('2d');
                    layerCtx.drawImage(img, 0, 0, img.width / 2, img.height / 2);

                    let offsetH = this.diyData[this.diyCurrentKey[index]].h / 100;
                    let offsetS = this.diyData[this.diyCurrentKey[index]].s / 100;
                    let offsetL = this.diyData[this.diyCurrentKey[index]].l / 100;

                    let pixels = layerCtx.getImageData(0, 0, layerCvs.width, layerCvs.height);
                    let len = pixels.data.length;
                    for (let i = 0; i < len; i += 4) {
                        let hslArr = rgbToHsl(pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]);//将canvas图像一个像素转成hsl
                        let h = Math.round(hslArr[0]) / 100;//色调，处理成0-1之前数据
                        let s = Math.round(hslArr[1]) / 100;//饱和度
                        let l = Math.round(hslArr[2]) / 100;//亮度
                        // d   通过改变canvas的快高改变清晰度
                        // let a = pixelData[i + 3];
                        h += offsetH;
                        s += offsetS;
                        l += offsetL;

                        let rgbArr = hslToRgb(h, s, l);//把处理后的hsl转成rgb
                        pixels.data[i] = rgbArr[0];
                        pixels.data[i + 1] = rgbArr[1];
                        pixels.data[i + 2] = rgbArr[2];
                    }
                    layerCtx.putImageData(pixels, 0, 0);//重新渲染图像
                    mainCtx.drawImage(layerCvs, 0, 0);
                });
            },
            loadImage(url) {
                let img = new Image();
                // img.crossOrigin = 'anonymous';
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = url;
                return new Promise((resolve, reject) => {
                    img.onload = () => {
                        resolve(img);
                    };
                    img.onerror = (err) => {
                        this.$toast('图片加载失败');
                        reject();
                    }
                })
            },
            testClick() {},
            // polyfill 提供了这个方法用来获取设备的 pixel ratio
            getPixelRatio(context) {
                let backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            },
        }
    }
</script>

<style scoped>

</style>