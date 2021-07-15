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
        <v-slide-y-transition mode="out-in">
            <router-view></router-view>
        </v-slide-y-transition>
    </div>
</template>

<script>
import { ui_trans_bus } from '../concat/bus'
import { index_background_lg_and_up } from '../resouce'

export default {
    data : () => ({
        dialog : false,
        title : '',
        content : '',
        btn1 : '',
        color : '',
        btncb : null,
    }),
    computed : {
        style(){
            const style = {
                backgroundImage : '',
                width : '100%',
                height : '100%',
                backgroundSize :'100%'
            }
            if(['login', 'reg'].includes(this.$route.name) && this.$vuetify.breakpoint.mdAndUp){
                style.backgroundImage = `url(${index_background_lg_and_up})`
            }
            return style
        }
    },
    methods : {
        btnclick(){
            this.dialog = false
            this.btncb(1)
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
    }
}
</script>