<template>
    <div
        :style="{ 
            width: width + 'px',
        }"
    >
        <div
            v-if="avaliable_nav"
            :style="{ 
                width: width + 'px',
                height : '100vh',
                backgroundColor : '#1e1e2d',
                color: 'white',
            }"
            style="position: fixed;overflow: hidden;"
        >
            <div
                style="height: 100%; position: relative;"
            >
                <v-list
                    dense
                    nav
                    style="background-color: transparent;"
                >
                    <div style="background-color: rbg(45, 30, 30); border-bottom: 1px soild black">
                        <v-list style="background-color: transparent; border-raduis: 8px">
                            <v-list-item class="px-2">
                                <div class="irina-sider-title">
                                    IrinaGame
                                </div>
                            </v-list-item>
                        </v-list>
                    </div>
                    
                    <v-list-item></v-list-item>
                    <v-list-item
                        v-for="item in routes"
                        v-show="avaliable(item)"
                        :key="item.name"
                        link
                        @click="router(item.path)"
                    >
                        <v-list-item-icon>
                            <v-icon style="color: #a2a3b7">{{ item.meta.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title style="color: #a2a3b7">{{ item.meta.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <div 
                    v-if="$store.getters.getUserOnlineState"
                    style="position: absolute; bottom: 10px; width: 100%;"
                >
                    <div class="px2 py2">
                        <v-btn block color="red" class="text-white" @click="logout">
                            登出
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ui_trans_bus, openInfoMessageBox } from '../concat/bus'
import { isTeacher } from '../util/index'
import routes from '../router/routes'
import { setAuthToken } from '../util/auth'
import {
    getSiderWidth,
    eventBus
} from './communicate'
export default {
    name : "Sider",
    data : () => ({
        avaliable_nav : true,
        open : false,
        routes : routes,
        avatar : '',
        width : getSiderWidth()
    }),
    methods : {
        router(to){
            this.$router.push(to)
        },
        avaliable(item){
            return item.meta.inNav 
                && ( !item.meta.required.online || this.$store.getters.getUserOnlineState )
                && ( !item.meta.required.offline || !this.$store.getters.getUserOnlineState )
                && ( !item.meta.required.teacher || isTeacher(this.$store.getters.getUserStatus) )
        },
        async logout(){
            setAuthToken('')
            await openInfoMessageBox('消息', '登出成功', '确定')
            window.location.href = '/'
        }
    },
    mounted(){
        ui_trans_bus.$on('change-navigation-status', () => {
            this.open = !this.open
        })
        ui_trans_bus.$on('disable-navigation', () => {
            this.avaliable_nav = false
        })
        this.avatar = this.$store.getters.getUserAvatar
        eventBus.$on('resize::sider', (width) => {
            this.width = width
        })
    }
}
</script>

<style>
.irina-sider-title {
    display: block;
    text-align: center;
    font-size: 1.5rem;
    color: white;
    width: 100%;
}
</style>