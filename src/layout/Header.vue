<template>
    <v-app-bar dense dark style="flex: none" v-show="avaliable">
        <v-app-bar-nav-icon @click.stop="changeNavigationStatus"></v-app-bar-nav-icon>
        <v-app-bar-title>湖南烟草技能培训训练平台</v-app-bar-title>
    </v-app-bar>
</template>

<script>

import { applyChangeNavigationStatus, ui_trans_bus } from '../concat/bus'

export default {
    data : () => ({
        avaliable : false
    }),
    methods : {
        changeNavigationStatus() {
            applyChangeNavigationStatus()
        }
    },
    mounted(){
        ui_trans_bus.$on('disable-header', () => {
            this.avaliable = false
        })

        ui_trans_bus.$on('launch-header', () => {
            this.avaliable = true
        })
    },
    destroyed(){
        ui_trans_bus.$off('launch-header')
    }
}
</script>