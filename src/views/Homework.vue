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
                        ~ {{ new Date(endtime*1000).formatDate('Y-M-D h:m:s') }}
                        <v-chip small :color="status[1]">
                            {{ status[0] }}
                        </v-chip>
                    </v-card-text>
                    <v-card-text class="px3 pt1 pb1 text-10">
                        发布者：{{ owner }}
                    </v-card-text>
                    <v-card-text class="px3 pt1 pb1 text-10">
                        简介：<InnerHTML :html="desc"></InnerHTML>
                    </v-card-text>
                    <rich-editor v-model="ans" class="px2 py2"></rich-editor>
                    <v-card-actions>
                        <v-btn color="primary" 
                            @click="commit" 
                            :disabled="status[1] != 'primary'"
                        >
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
import { api_homework_get, api_homework_result_commit, api_homework_result_get } from '../interface/api'
import { openErrorMessageBox, openInfoMessageBox } from '../concat/bus'

import RichEditor from '../components/common/RichEditor.vue'
import InnerHTML from '../components/common/InnerHTML.vue'

export default {
    components : { RichEditor, InnerHTML },
    data : () => ({
        hid : 0,
        title : '',
        owner : '',
        desc : '',
        time : 0,
        endtime : 0,
        ans : ''
    }),
    computed : {
        status(){
            const time = new Date().getTime() / 1000
            if (time < this.time){
                return ['未开始', 'grey']
            }else if(time > this.endtime){
                return ['已结束', 'red']
            }
            return ['进行中', 'primary']
        },
    },
    methods : {
        async loadResult(){
            const { data } = await api_homework_result_get(this.hid)
            if(!data){
                openErrorMessageBox('警告', '获取提交记录失败')
            }else{
                if(data['res'] == 0){
                    this.ans = data['data']['r_info']['text']
                }
            }
        },
        async loadHomework(){
            const { data } = await api_homework_get(this.hid)
            if(!data){
                await openErrorMessageBox('警告', '获取作业失败', '确定')
            }else{
                if(data['res'] < 0){
                    await openErrorMessageBox('警告', data['err'], '确定')
                }else{
                    this.title = data['data']['title']
                    this.desc = data['data']['desc']
                    this.owner = data['data']['r_owner']['name']
                    this.time = data['data']['time']
                    this.endtime = data['data']['endtime']
                    this.ans = data['data']['ans']
                }
            }
        },
        async commit(){
            const { data } = await api_homework_result_commit(this.hid, this.ans)
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '提交成功')
                }
            }
        }
    },
    async mounted(){
        const hid = parseInt(this.$route.params.hid)
        if(hid <= 0 || isNaN(hid)){
            await openErrorMessageBox('警告', '参数错误', '确定')
            this.$router.back()
            return
        }
        this.hid = hid
        this.loadHomework()
        this.loadResult()
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