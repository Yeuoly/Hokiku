<template>
    <v-app-bar dense dark style="flex: none" v-if="avaliable">
        <v-app-bar-nav-icon @click.stop="changeNavigationStatus"></v-app-bar-nav-icon>
        <v-app-bar-title>Hokiku</v-app-bar-title>
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
    }
}
</script>