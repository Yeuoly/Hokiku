<template>
    <v-container style="margin-top: 30px; margin-bottom: 30px">
        <v-row>
            <v-col xl="3" lg="2" md="1" v-if="$vuetify.breakpoint.mdAndUp"></v-col>
            <v-col xl="6" lg="8" md="10" sm="12" cols="12">
                <v-card>
                    <v-card color="primary" class="text-white px5 py4">
                        提交
                    </v-card>
                    <v-card-text class="px3 pt5 pb1 text-20">
                        {{ title }}
                    </v-card-text>
                    <v-card-text class="px3 pt1 pb1 text-11">
                        时限：{{ new Date(time*1000).formatDate('Y-M-D h:m:s') }}
                        ~ {{ new Date(end_at*1000).formatDate('Y-M-D h:m:s') }}
                        <v-chip small :color="status[1]">
                            {{ status[0] }}
                        </v-chip>
                    </v-card-text>
                    <v-card-text class="px3 pt1 pb1 text-10">
                        发布者：{{ publisher }}
                    </v-card-text>
                    <v-card-text class="px3 pt1 pb1 text-10">
                        简介：{{ desc }}
                    </v-card-text>
                    <rich-editor v-model="ans" class="px2 py2"></rich-editor>
                    <v-card-actions>
                        <v-btn small color="primary" :disabled="status[1] != 'primary'">
                            提交
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col xl="3" lg="2" md="1" v-if="$vuetify.breakpoint.mdAndUp"></v-col>
        </v-row>
    </v-container>
</template>

<script>
import { api_get_homework } from '../interface/api'
import { openErrorMessageBox } from '../concat/bus'

import RichEditor from '../components/common/RichEditor.vue'

export default {
    components : { RichEditor },
    data : () => ({
        hid : 0,
        title : '',
        publisher : '',
        desc : '',
        time : 0,
        end_at : 0,
        ans : ''
    }),
    watch : {

    },
    computed : {
        status(){
            const time = new Date().getTime() / 1000
            if (time < this.time){
                return ['未开始', 'grey']
            }else if(time > this.end_at){
                return ['已结束', 'red']
            }
            return ['进行中', 'primary']
        }
    },
    methods : {
        
    },
    async mounted(){
        const hid = parseInt(this.$route.params.hid)
        if(hid <= 0 || isNaN(hid)){
            await openErrorMessageBox('警告', '参数错误', '确定')
            this.$router.back()
            return
        }
        this.hid = hid
        const data = await api_get_homework(hid)
        if(!data){
            await openErrorMessageBox('警告', '获取作业失败', '确定')
        }else{
            if(data['res'] < 0){
                await openErrorMessageBox('警告', data['err'], '确定')
            }else{
                this.title = data['data']['title']
                this.desc = data['data']['desc']
                this.publisher = data['data']['publisher']
                this.time = data['data']['time']
                this.end_at = data['data']['end_at']
                this.ans = data['data']['ans']
            }
        }
    }
}
</script>

<style scoped>
    .theme--light.v-data-table{
        color: rgba(0, 0, 0, 0.6);
    }

    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td, .v-data-table > .v-data-table__wrapper > table > thead > tr > td, .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
        font-size: 11px;
    }
</style>