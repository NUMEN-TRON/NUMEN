<template>
    <div class="h-56">
        <div class="f17 full-w hd-pf bb head-pd f-c-sb mt10" :class="{'bg-page': showHeaderBg}">
            <div class="f12 bg-fill px10 py03 br8">{{ selfAddr | filterAdrHeadTail }}</div>
            <div class="f-sb flex-sk-0">
                <div class="f-ct" @click="showLanguageDlg = true">
                    <span class="f12 mr08">{{ $t('name') }}</span>
                    <img class="w-18 mr05"
                         :src="require(`@/assets/img/${currentLanguage}.png`)" alt="">
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>

        <!-- 选择语言弹框 -->
        <van-popup
                v-model="showLanguageDlg"
                class="cus-popup">
            <div class="pop-box py15 px12">
                <van-radio-group
                        v-model="currentLanguage"
                        checked-color="#00B9C2"
                        @change="showLanguageDlg = false">
                    <van-cell-group :border="false">
                        <van-cell
                                v-for="item in languageList"
                                :title="item.name"
                                :key="item.order"
                                clickable
                                class="c-fff"
                                @click="currentLanguage = item.locale">
                            <template #right-icon>
                                <van-radio :name="item.locale" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "HeaderLogo",
        data() {
            return {
                showLanguageDlg: false,
                showHeaderBg: false,
            }
        },
        mounted() {
            // window.addEventListener('scroll', this.handleScroll);
        },
        computed: {
            selfAddr() {
                return window.tronWeb.defaultAddress.base58 || '';
            },
            currentLanguage: {
                get() {
                    return this.$i18n.locale;
                },
                set(val) {
                    this.$i18n.locale = val;
                    localStorage.setItem('lang', val);
                },
            },
            languageList() {
                const list = [];
                const messages = this.$i18n.messages;
                Object.keys(messages).forEach(item => {
                    list.push({
                        locale: item,
                        name: messages[item].name,
                        order: messages[item].order
                    })
                });
                list.sort((a, b) => a.order - b.order);
                return list
            },
        },
        methods: {
            handleScroll () {
                let scrollY = document.documentElement.scrollTop;
                this.showHeaderBg = scrollY > 120;
            }
        }
    }
</script>

<style scoped>
    /deep/ .van-cell-group { background-color: transparent }
    .head-pd { padding: 15px 2px 11px; }
    .h-56 { height: 56px; }
    .hd-pf { top: 0; left: 0; z-index: 999;}
</style>
