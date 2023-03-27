<template>
    <v-app-bar 
        style="flex: none; box-shadow: none; border-bottom: 1px solid rgb(235,237,243) !important;" 
        v-show="avaliable"
        :style="{
            width : width + 'px',
        }"
        color="white"
    >
        <v-app-bar-nav-icon @click.stop="changeNavigationStatus"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <v-btn text depressed>
            {{ $store.getters.getUserName }}
        </v-btn>
        <v-btn icon>
            <v-avatar size="32">
                <v-img :src="$store.getters.getUserAvatar"></v-img>
            </v-avatar>
        </v-btn>
        <v-menu
            left
            bottom
        >
            <template v-slot:activator="{ on, attrs }">
            <v-btn
                icon
                v-bind="attrs"
                v-on="on"
            >
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            </template>

            <v-list>
                <!-- <v-list-item>
                    <v-list-item-title>退出</v-list-item-title>
                </v-list-item> -->
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script>

import { applyChangeNavigationStatus, ui_trans_bus } from '../concat/bus'
import {
    getHeaderWidth,
    eventBus
} from './communicate'

export default {
    data : () => ({
        avaliable : false,
        width : getHeaderWidth()
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
        eventBus.$on('resize::header', (width) => {
            this.width = width
        })
    },
    destroyed(){
        ui_trans_bus.$off('launch-header')
        eventBus.$off('resize::header')
    }
}
</script>