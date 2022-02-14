<template>
    <v-container>
        <v-dialog
            v-model="dialog.open"
            width="800"
        >
            <v-card class="px5 py5">
                <InnerHTML :html="dialog.innerhtml"></InnerHTML>
            </v-card>
        </v-dialog>
        <v-card>
            <v-data-table
                :headers="headers"
                :items="list"
            >
                <template v-slot:item.detail="{ item }">
                    <v-icon
                        small
                        @click="homeworkDetail(item.r_info.text)"
                    >
                        mdi-chart-box-outline
                    </v-icon>
                </template> 
                <template v-slot:item.time="{ item }">
                    {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.score="{ item }">
                    <v-text-field v-model.number="item.r_score" type="number">
                        <template v-slot:append>
                            <v-btn small color="primary"
                                @click="markHomework(item.uid, item.hid, item.r_score)"
                            >提交</v-btn>
                        </template>
                    </v-text-field>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../concat/bus'
import { api_homework_commits, api_homework_mark } from '../interface/api'
import { xssFilter } from '../util'

import InnerHTML from '../components/common/InnerHTML.vue'

export default {
    components : { InnerHTML },
    data : () => ({
        hid : 0,
        headers : [{
            text : 'id',
            value : 'id'
        }, {
            text : '提交时间',
            value : 'time'
        }, {
            text : '评分',
            value : 'score'
        }, {
            text : '详情',
            value : 'detail'
        }],
        list : [],
        options : {},
        page : 0,
        dialog : {
            open : false,
            innerhtml : ''
        }
    }),
    methods : {
        async loadCommits(){
            const { data } = await api_homework_commits(this.hid)
            if(!data){
                openErrorMessageBox('错误', '网络异常')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.list = data['data']
                }
            }
        },
        async markHomework(uid, hid, score){
            const { data } = await api_homework_mark(uid, hid, score)
            if(!data){
                openErrorMessageBox('错误', '网络异常')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '评分成功')
                }
            }
        },
        homeworkDetail(innerhtml){
            this.dialog.innerhtml = xssFilter(innerhtml)
            this.dialog.open = true
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

        this.loadCommits()
    }
}
</script>

<style>

</style>