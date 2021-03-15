<template>
    <div v-if="tabsList.map(item => item.path).includes(currentTabPath)"
         class="h-38">
        <div class="px20 bg-head pf full-w hd-pf bb p13 f-ct" style="z-index: 99">
            <div class="f-ct pr f17 c-fff fw500 tabs">
                <div v-for="(item, index) in tabsList"
                     :key="item.path"
                     class="tab-item"
                     :class="{'active': currentTabPath === item.path}"
                     @click="tabItemClick(item.path)">
                    {{ item.name }}
                </div>
            </div>
            <div class="pa head-add">
                <img class="wh-20"
                     src="../assets/img/add.png" alt=""
                     @click="showDropdown = true">
                <div v-if="showDropdown"
                     class="dropdown pa">
                    <div class="page-mask"
                         @click="showDropdown = false"></div>
                    <ul class="bg-fill br8 ofh c-fff f16 py05 pr" style="z-index: 100">
                        <li v-for="item in dropdownList"
                            :key="item.img"
                            class="f-c-sb"
                            @click="$router.push(item.path)">
                            <img class="w-18 mx15"
                                 :src="require(`../assets/img/${item.img}.png`)" alt="">
                            <p class="py25 border-b w-74">{{ item.name }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HeaderTab",
        props: {
            path: {
                type: String,
                default: '/home'
            }
        },
        data() {
            return {
                showDropdown: false,
                showLanguageDlg: false,
                tabsList: [
                    {path: '/home', name: '首頁'},
                    {path: '/assets', name: '資產'},
                    {path: '/mixing', name: '混合記錄'},
                ],
                currentTabPath: '/home',
                dropdownList: [
                    {path: '/invite', img: 'invite', name: '邀請好友'},
                    {path: '/plan', img: 'plan', name: '聯盟計劃'},
                    {path: '/record', img: 'record', name: '賬戶記錄'},
                    {path: '/team', img: 'team', name: '我的團隊'},
                    {path: '/help', img: 'help', name: '幫助中心'},
                ]
            }
        },

        watch: {
            path(v) {
                this.currentTabPath = v;
                this.showDropdown = false;
            }
        },

        methods: {
            tabItemClick(v) {
                if (this.currentTabPath === v) return;
                this.currentTabPath = v;
                this.$router.push(v);
            },
        }
    }
</script>

<style lang="scss" scoped>
    .dropdown {
        right: -8px;
        top: 30px;

        &:after {
            content: '';
            position: absolute;
            top: -4px;
            right: 15px;
            z-index: 102;
            width: 6px;
            height: 6px;
            border-style: solid;
            border-width: 1px 0 0 1px;
            border-color: #383838 transparent transparent #383838  ;
            background: #383838;
            transform: rotate(45deg);
        }
        li:last-child .border-b {
            border: none;
        }
    }
    .page-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .ml15 { margin-left: 15px; }
    .w-74 { width: 94px; }
    .border-b { border-bottom: 1px solid #777777; }
    .w-18 { width: 18px; }
    .head-add {
        top: 2px;
        right: 20px;
        line-height: 0;
    }
    .wh-20 { width: 20px; height: 20px; }
    .p13 { padding: 0 0 13px 0; }
    .tabs {
        .tab-item {
            padding: 0 15px;
        }
        .active {
            color: #06FCFB;
        }
    }
    .h-38 { height: 38px; }

</style>
