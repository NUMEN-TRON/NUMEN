<template>
    <div class="pr flex f-column">
        <div class="f-ct pr mt90">
            <img class="wh-139" src="../assets/image/logo.png" alt="">
        </div>
        <div class="flex-1 f-column px16">
            <div class="f16 fw500 px16 f18" style="margin-top: 10vh;">请输入您的密码</div>
            <div class="pr mt25">
                <van-password-input
                        :gutter="1"
                        :focused="isFocus"
                        v-model="loginPwd"
                />
                <input type="number" class="pa full-w full-h pa-input"
                       @focus="isFocus = true"
                       @blur="isFocus = false"
                       ref="loginInput"
                       v-model="loginPwd">
            </div>
            <div class="px16">
                <van-button
                        class="br10"
                        type="primary"
                        style="margin-top: 20vh;"
                        size="large"
                        @click="loginClick">
                    {{ $t('confirm') }}
                </van-button>
            </div>
        </div>

        <!-- 完善信息 注册 弹框 居中 -->
        <van-popup
                v-model="registerDlg"
                :close-on-click-overlay="false"
                @opened="regOpenCallBack"
                @closed="isFocusReg = false"
                class="cus-popup">
            <div class="py25">
                <p class="tc f18 fw600"><!--完善信息-->{{ $t('perfectInfo') }}</p>
                <div class="px16 mt20">
                    <div class="px16 f16 fw500 mt20"><!--請設置密碼-->{{ $t('setPwdP') }}</div>
                    <div class="pr mt10">
                        <van-password-input
                                :gutter="1"
                                :focused="isFocusReg"
                                v-model="reg.pwd1"
                        />
                        <input type="number" style="color:transparent"
                               class="pa full-w full-h pa-input"
                               ref="regInput"
                               v-model="reg.pwd1">
                    </div>
                    <div class="px16 f16 fw500 mt20"><!--請重複密碼-->{{ $t('repPwdP') }}</div>
                    <div class="pr mt10">
                        <van-password-input
                                :gutter="1"
                                :focused="isFocusReg2"
                                v-model="reg.pwd2"
                        />
                        <input type="number" style="color:transparent"
                               class="pa full-w full-h pa-input"
                               ref="regInput2"
                               v-model="reg.pwd2">
                    </div>
                    <template v-if="reg.sharecode">
                        <div class="px16 f16 fw500 mt20">{{ $t('shareLink') }}</div>
                        <div  class="input-box mt10 border-main h-44 mx15 br10">
                            <div class="van-ellipsis">{{ reg.sharecode }}</div>
                        </div>
                    </template>
                    <div class="mt40 f15 c-deg px16">*{{ $t('pwdTips') }}</div>
                </div>
            </div>
            <div class="f-sb">
                <div class="flex-1">
                    <van-button
                            size="large"
                            @click="registerDlg = false">
                        {{ $t('cancel') }}
                    </van-button>
                </div>
                <div class="flex-1">
                    <van-button
                            type="primary"
                            size="large"
                            @click="registerClick">
                        {{ $t('confirm') }}
                    </van-button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    const Env = require('@/env.js');

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    export default {
        name: "login",
        data: () => ({
            registerDlg: false,
            loginPwd: '',
            reg: {
                phone: '',
                pwd1: '',
                pwd2: '',
                sharecode: '',
            },
            isFocus: false,
            isFocusReg: false,
            isFocusReg2: false,
        }),
        activated() {
            this.getIsRegister();
        },
        watch: {
            loginPwd(val) {
                if (val.length > 6) {
                    this.loginPwd = val.slice(0, 6);
                }
                if (val.length === 6) {
                    this.loginPwd = val.slice(0, 6);
                    this.loginClick();
                }
            },
            'reg.pwd1'(val) {
                if (val.length > 6) {
                    this.reg.pwd1 = val.slice(0, 6);
                }
                if (val.length === 6) {
                    this.reg.pwd1 = val.slice(0, 6);
                    this.isFocusReg2 = true;
                    this.$refs.regInput2.focus();
                }
            },
            'reg.pwd2'(val) {
                if (val.length > 6) {
                    this.reg.pwd2 = val.slice(0, 6);
                }
                if (val.length === 6) {
                    this.registerClick();
                }
            },
        },
        methods: {
            ...mapMutations({
                setToken: 'SET_TOKEN',
                setUserInfo: 'SET_USER_INFO',
            }),
            async getIsRegister() {
                let selfAddr = window.tronWeb.defaultAddress.base58;
                let params = {
                    address: selfAddr,
                };
                let url = 'mobile/card/isregister';
                let res = await this.$http.get(url, { params });
                if (!res) {
                    this.reg.sharecode = getQueryString('code') || '';
                    this.registerDlg = true;
                } else {
                    this.isFocus = true;
                    this.$refs.loginInput.focus();
                }
            },
            regOpenCallBack() {
                this.isFocusReg = true;
                this.$refs.regInput.focus();
            },
            registerClick() {
                if (this.reg.pwd1.length < 6) {
                    // this.$toast('請輸入6位數字');
                    this.$toast(this.$t('pwdType'));
                    return;
                }
                if (!this.reg.pwd1) {
                    // this.$toast('請輸入密碼');
                    this.$toast(this.$t('pwdNull'));
                    return;
                }
                if (!this.reg.pwd2) {
                    // this.$toast('請再次輸入密碼');
                    this.$toast(this.$t('repPwdNull'));
                    return;
                }
                if (this.reg.pwd1 !== this.reg.pwd2) {
                    // this.$toast('兩次輸入密碼不一至');
                    this.$toast(this.$t('noEqual'));
                    return;
                }
                let body = {
                    ...this.reg,
                    type: 1,
                    phone: window.tronWeb.defaultAddress.base58,
                };
                let url = 'mobile/card/reg';
                this.$http.post(url, body).then(res => {
                    this.registerDlg = false;
                    // this.$toast('注册成功');
                    this.$toast(this.$t('regSuc'));
                }).finally(() => {
                    this.$resetObj(this.reg);
                })
            },
            loginClick() {
                if (!this.loginPwd) {
                    // this.$toast('請輸入登錄密碼');
                    this.$toast(this.$t('loginPwdNull'));
                    return;
                }
                let body = {
                    phone: window.tronWeb.defaultAddress.base58,
                    pwd: this.loginPwd
                };
                let url = 'mobile/card/login';
                this.$http.post(url, body).then(res => {
                    const { setting, token, user } = res;
                    this.setToken(token);
                    this.setUserInfo(user);
                    this.$go('/home');
                }).finally(() => {
                    this.loginPwd = '';
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .wh-139 { @include wh(105, 103); }
    .pa-input {
        opacity: 0;
        top: 0;
        background-color: transparent;
        border: none;
        outline: none;
    }
    .mt90 { margin-top: 90px; }
    .wh47 {
        @include wh(46);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        box-sizing: border-box;
        border: 1px solid #00B9C2;
        background-color: #161616;
    }
    .pit {
        background-color: #ffffff;
        @include wh(8);
        border-radius: 50%;
    }
    /deep/ {
        .cus-popup {
            .van-password-input__security {
                height: 40px;
            }
            .van-password-input__security li {
                width: 40px;
                flex: initial;
                border-radius: 3px;
                box-sizing: border-box;
                border: 1px solid #D2E3E9;
                background-color: #D2E3E9;
            }
        }
        .van-password-input__security {
            height: 47px;
            justify-content: space-between;
        }
        .van-password-input__security li {
            width: 47px;
            flex: initial;
            border-radius: 3px;
            box-sizing: border-box;
            border: 1px solid #D2E3E9;
            background-color: #D2E3E9;
        }
        .van-password-input__security i {
            background-color: #0E7079;
        }
    }
</style>
