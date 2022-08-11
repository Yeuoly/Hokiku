<template>
    <v-navigation-drawer
        v-if="avaliable_nav"
        temporary
        absolute
        v-model="open"
    >
        <v-list
            dense
            nav
        >
            <v-card color="blue">
                <v-list>
                    <v-list-item class="px-2">
                        <v-list-item-avatar>
                            <v-img src="https://yeuoly.oss-cn-beijing.aliyuncs.com/irina/static/default_avatar.jpg"></v-img>
                        </v-list-item-avatar>
                    </v-list-item>

                    <v-list-item link>
                        <v-list-item-content>
                        <v-list-item-title class="text-h7" style="color: white;">
                            {{ $store.getters.getUserName }}
                        </v-list-item-title>
                        <v-list-item-subtitle style="color: white;">
                            {{ $store.getters.getUserEmail }}
                        </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
            
            <v-list-item
                v-for="item in routes"
                v-show="avaliable(item)"
                :key="item.name"
                link
                @click="router(item.path)"
            >
            <v-list-item-icon>
                <v-icon>{{ item.meta.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title style="color: grey">{{ item.meta.title }}</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list>
        <template v-if="$store.getters.getUserOnlineState" v-slot:append>
            <div class="px2 py2">
                <v-btn block color="red" class="text-white" @click="logout">
                    登出
                </v-btn>
            </div>
      </template>
    </v-navigation-drawer>
</template>

<script>
import { ui_trans_bus, openInfoMessageBox } from '../concat/bus'
import { isTeacher } from '../util/index'
import routes from '../router/routes'
import { setAuthToken } from '../util/auth'

export default {
    name : "Sider",
    data : () => ({
        avaliable_nav : true,
        open : false,
        routes : routes
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
    }
}
</script>

<style>

</style>