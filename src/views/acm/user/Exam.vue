<template>
    <div>
        <v-row>
            <v-col :cols="12">
                <v-data-table
                    :headers="exam_headers"
                    :items="exams"
                    :items-per-page="50"
                    class="elevation-1"
                    hide-default-footer
                >
                    <template v-slot:item.action="{ item }">
                        <v-btn
                            :disabled="status(new Date(item.start_time * 1000), new Date(item.end_time * 1000)) != 1"
                            color="primary"
                            @click="to(`/acm/user/exam_problem/${item.id}`)"
                        >进入</v-btn>
                    </template>
                    <template v-slot:item.start_time="{ item }">
                        {{ new Date(item.start_time * 1000).toLocaleString() }}
                    </template>
                    <template v-slot:item.end_time="{ item }">
                        {{ new Date(item.end_time * 1000).toLocaleString() }}
                    </template>
                    <template v-slot:item.status="{ item }">
                        <v-chip color="green" v-if="status(new Date(item.start_time * 1000), new Date(item.end_time * 1000)) == 0" dark>未开始</v-chip>
                        <v-chip color="blue" v-if="status(new Date(item.start_time * 1000), new Date(item.end_time * 1000)) == 1" dark>进行中</v-chip>
                        <v-chip color="red" v-if="status(new Date(item.start_time * 1000), new Date(item.end_time * 1000)) == 2" dark>已结束</v-chip>
                    </template>
                </v-data-table>
                <v-pagination
                    v-model="page"
                    :length="99999"
                    :total-visible="10"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../../concat/bus'
import { api_acm_exam_list } from '../../../interface/api'

export default {
    data : () => ({
        exam_headers : [{
            text : '考试号',
            value : 'id'
        },{
            text : '标题',
            value : 'title'
        }, {
            text : '发布于',
            value : 'organization_name'
        },{
            text : '通过率',
            value : 'ac_rate'
        },{
            text : '提交数',
            value : 'commits'
        },{
            text : '通过数',
            value : 'accepts'
        },{
            text : '开始时间',
            value : 'start_time'
        },{
            text : '结束时间',
            value : 'end_time'
        },{
            text : '状态',
            value : 'status'
        },{
            text : '操作',
            value : 'action'
        }],
        exams : [],
        page : 1
    }),
    watch : {
        page : {
            handler() {
                this.loadExams()
            },
            immediate : true
        }
    },
    methods :{
        async loadExams() {
            const { data } = await api_acm_exam_list(this.page, 50)
            if (data && data['res'] == 0) {
                for (let i = 0; i < data['data']['exams'].length; i++) {
                    data['data']['exams'][i]['ac_rate'] = `${data['data']['exams'][i]['accepts']}/${data['data']['exams'][i]['commits']}`
                }
                this.exams = data['data']['exams']
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        to(path) {
            this.$router.push(path)
        },
        status(start_time, end_time) {
            const now = new Date().getTime()
            if (now < start_time) {
                return 0
            } else if (now > end_time) {
                return 2
            } else {
                return 1
            }
        }
    }
}
</script>

<style>

</style>