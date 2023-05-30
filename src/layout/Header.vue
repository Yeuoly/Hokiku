<template>
    <v-app-bar 
        style="flex: none; box-shadow: none; border-bottom: 1px solid rgb(235,237,243) !important;" 
        v-show="avaliable"
        :style="{
            width : width + 'px',
        }"
        color="primary"
    >
        <!-- <v-app-bar-nav-icon @click.stop="changeNavigationStatus"></v-app-bar-nav-icon> -->
        <v-btn text depressed dark @click="to('/index')">
            <v-img
                :width="50"
                :src="require('../assets/irina-1.png')"
            ></v-img>
            <span class="pl5">
                IrinaGame
            </span>
        </v-btn>
        <v-menu
            offset-y
            bottom
            open-on-hover
            open-delay="100"
            
        >
            <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                text
                dark
            >
                <v-icon color="white" class="pr3" >
                    mdi-account-box-outline
                </v-icon>
                个人
                <v-icon class="pl3">mdi-chevron-down</v-icon>
            </v-btn>
            </template>

            <v-list class="px0" style="padding: 0;">
                <v-list-item style="padding: 0" v-if="this.$store.getters.getUserOnlineState">
                    <v-btn 
                        class="w100" text 
                        @click="to('/home')"
                    >
                        <v-icon class="pr3" color="primary">
                            mdi-account
                        </v-icon>
                        主页
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0" v-if="this.$store.getters.getUserOnlineState">
                    <v-btn 
                        class="w100" text 
                        @click="to('/blog')"
                    >
                        <v-icon class="pr3" color="primary">
                            mdi-message-processing-outline
                        </v-icon>
                        博客
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0" v-if="this.$store.getters.getUserOnlineState">
                    <v-btn 
                        class="w100" text 
                        @click="to('/home/org')"
                    >
                        <v-icon class="pr3" color="primary">
                            mdi-account-multiple-plus-outline
                        </v-icon>
                        班级
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0" v-if="this.$store.getters.getUserOnlineState">
                    <v-btn class="w100" text
                        @click="logout()"
                    >
                        <v-icon class="pr3" color="red">
                            mdi-exit-to-app
                        </v-icon>
                        退出
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0" v-if="!this.$store.getters.getUserOnlineState">
                    <v-btn 
                        class="w100" text depressed
                        @click="to('/login')"
                    >
                        <v-icon color="green">
                            mdi-bell
                        </v-icon>
                        登录
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0" v-if="!this.$store.getters.getUserOnlineState">
                    <v-btn class="w100" text depressed v-if="!this.$store.getters.getUserOnlineState"
                        @click="to('/reg')"
                    >
                        <v-icon color="green">
                            mdi-account-plus
                        </v-icon>
                        注册
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-menu
            offset-y
            bottom
            open-on-hover
            open-delay="100"
            
        >
            <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                text
                dark
            >
                <v-icon color="white" class="pr3" >
                    mdi-shield-lock-outline
                </v-icon>
                网安
                <v-icon class="pl3">mdi-chevron-down</v-icon>
            </v-btn>
            </template>

            <v-list class="px0" style="padding: 0;">
                <v-list-item style="padding: 0" v-if="this.$store.getters.getUserOnlineState">
                    <v-btn class="w100" text depressed
                        @click="to('/competition')"
                    >
                        <v-icon color="green" class="pr3">
                            mdi-flag-outline
                        </v-icon>
                        CTF
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0" v-if="this.$store.getters.getUserOnlineState">
                    <v-btn class="w100" text depressed
                        @click="to('/competition/awd')"
                    >
                        <v-icon color="green" class="pr3">
                            mdi-shield-sun-outline
                        </v-icon>
                        AWD
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0" v-if="this.$store.getters.getUserOnlineState">
                    <v-btn class="w100" text depressed
                        @click="to('/competition/service')"
                    >
                        <v-icon color="green" class="pr3">
                            mdi-fedora
                        </v-icon>
                        渗透
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0">
                    <v-btn class="w100" text depressed
                        @click="to('/tools')"
                    >
                        <v-icon color="green" class="pr3">
                            mdi-security
                        </v-icon>
                        工具箱
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-btn text depressed dark
            @click="to('/acm')"
        >
            <v-icon class="pr3">
                mdi-code-braces
            </v-icon>
            OJ
        </v-btn>
        <v-btn text depressed dark
            @click="to('/knowledge')"
        >
            <v-icon class="pr3">
                mdi-book-open-page-variant
            </v-icon>
            学习
        </v-btn>

        <v-menu
            offset-y
            bottom
            v-if="isTeacher()"
            open-on-hover
            open-delay="100"
            
        >
            <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                text
                dark
            >
                <v-icon color="white" class="pr3" >
                    mdi-console-line
                </v-icon>
                后台
                <v-icon class="pl3">mdi-chevron-down</v-icon>
            </v-btn>
            </template>

            <v-list class="px0" style="padding: 0;">
                <v-list-item style="padding: 0" v-if="isTeacher()">
                    <v-btn class="w100" text
                        @click="to('/teacher')"
                    >
                        <v-icon class="pr3" color="red">
                            mdi-human-male-board
                        </v-icon>
                        教师
                    </v-btn>
                </v-list-item>
                <v-list-item style="padding: 0" v-if="isSA()">
                    <v-btn class="w100" text depressed
                        @click="to('/admin')"
                    >
                        <v-icon class="pr3" color="red">
                            mdi-image-filter-center-focus-strong-outline
                        </v-icon>
                        总控
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-spacer></v-spacer>

        <v-btn text depressed dark>
            {{ $store.getters.getUserName }}
        </v-btn>
        <v-btn icon dark
            @click="to('/message')"
            v-if="this.$store.getters.getUserOnlineState"
        >
            <v-badge
                color="pink"
                overlap
                :content="hash_new_message.count"
                :value="hash_new_message.count"
            >
                <v-icon>
                    mdi-bell-outline
                </v-icon>
            </v-badge>
        </v-btn>
        <v-btn icon>
            <v-avatar size="36">
                <v-img :src="$store.getters.getUserAvatar"></v-img>
            </v-avatar>
        </v-btn>
    </v-app-bar>
</template>

<script>

import { isTeacher, isSA } from '../util/index'

import { applyChangeNavigationStatus, ui_trans_bus, openInfoMessageBox } from '../concat/bus'
import {
    getHeaderWidth,
    eventBus,
} from './communicate'
import { setAuthToken } from '../util/auth'

import {
    api_message_has_new
} from '../interface/message'

export default {
    data : () => ({
        avaliable : false,
        width : getHeaderWidth(),
        hash_new_message : {
            has_new : false,
            count : 0
        }
    }),
    methods : {
        async load_new_message() {
            const { data } = await api_message_has_new()
            if(data && data['res'] == 0) {
                this.hash_new_message.has_new = data['data']['yes']
                this.hash_new_message.count = data['data']['count']
            }
        },
        changeNavigationStatus() {
            applyChangeNavigationStatus()
        },
        isTeacher() {
            return isTeacher(this.$store.getters.getUserStatus)
        },
        isSA() {
            return isSA(this.$store.getters.getUserStatus)
        },
        to(path) {
            this.$router.push(path)
        },
        async logout(){
            setAuthToken('')
            await openInfoMessageBox('消息', '登出成功', '确定')
            window.location.href = '/'
        }
    },
    mounted(){
        ui_trans_bus.$on('disable-header', () => {
            this.avaliable = false
        })

        ui_trans_bus.$on('launch-header', () => {
            this.avaliable = true
        })
        eventBus.$on('resize::header', (width) => {
            this.width = width
        })
        ui_trans_bus.$on('refresh-new-message', () => {
            this.load_new_message()
        })

        if (this.$store.getters.getUserOnlineState) {
            this.load_new_message()
        }
    },
    destroyed(){
        ui_trans_bus.$off('launch-header')
        eventBus.$off('resize::header')
    }
}
</script>