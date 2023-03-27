<template>
    <div :style="style">
        <v-dialog
            v-model="dialog"
            width="500"
        >
            <v-card>
                <v-toolbar
                    dense
                    dark
                    :color="color"
                >
                    <v-card-title>
                        {{ title }}
                    </v-card-title>
                </v-toolbar>
                

                <v-card-text style="padding-top: 17px">
                    {{ content }}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    text
                    @click="btnclick"
                >
                    {{ btn1 }}
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar
            timeout="3000"
            v-model="snackbar"
            :color="snackbar_color"
        >
            {{ snackbar_text }}
            <template v-slot:action="{ attrs }">
                <v-btn
                dark
                text
                v-bind="attrs"
                @click="snackbar = false"
                >
                Close
                </v-btn>
            </template>
        </v-snackbar>
        <v-slide-y-transition mode="out-in">
            <router-view></router-view>
        </v-slide-y-transition>
    </div>
</template>

<script>
import { ui_trans_bus } from '../concat/bus'
import { index_background_lg_and_up } from '../resouce'
import {
    getHeaderWidth,
    eventBus
} from './communicate'

export default {
    data : () => ({
        dialog : false,
        title : '',
        content : '',
        btn1 : '',
        color : '',
        btncb : null,
        status : 0,
        snackbar: false,
        snackbar_text : '',
        snackbar_color : 'info',
        width : getHeaderWidth()
    }),
    computed : {
        style(){
            const style = {
                backgroundImage : '',
                height : '100%',
                width: this.width + 'px',
                backgroundSize :'50%',
                backgroundPosition : '10%'
            }
            if(['login', 'reg'].includes(this.$route.name) && this.$vuetify.breakpoint.mdAndUp){
                style.backgroundImage = `url(${index_background_lg_and_up})`
            }
            return style
        }
    },
    watch : {
        dialog : {
            handler(v){
                if(!v){
                    this.btncb(this.status)
                    this.status = 0
                }
            }
        }
    },
    methods : {
        btnclick(){
            this.status = 1
            this.dialog = false
        }
    },
    mounted(){
        ui_trans_bus.$on('open-message', (cb, color, title, content, btn1) => {
            this.btncb = cb
            this.color = color
            this.title = title
            this.content = content
            this.btn1 = btn1 || '确定'
            this.dialog = true
        })

        ui_trans_bus.$on('open-snackbar', (text, color) => {
            this.snackbar_text = text
            this.snackbar_color = color || 'info'
            this.snackbar = true
        })

        eventBus.$on('resize::header', (width) => {
            this.width = width
        })
    }
}
</script>