<template>
    <div>
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
                    @click="dialog = false"
                >
                    {{ btn1 }}
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <router-view></router-view>
    </div>
</template>

<script>
import { ui_trans_bus } from '../concat/bus'

export default {
    data : () => ({
        dialog : false,
        title : '',
        content : '',
        btn1 : '',
        color : ''
    }),
    mounted(){
        ui_trans_bus.$on('open-message', (color, title, content, btn1) => {
            this.color = color
            this.title = title
            this.content = content
            this.btn1 = btn1 || '确定'
            this.dialog = true
        })
    }
}
</script>