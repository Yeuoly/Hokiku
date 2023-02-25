<template>
    <div>
        <!-- 分为几个板块 -->
        <!-- 1. 个人信息，包括ID 昵称 注册时间 当前分数等等信息，不可以编辑 -->
        <!-- 2. 个人统计，包括AC数，提交数，AC率，AC题目类型统计，AC题目难度统计，都不可以编辑 -->
        <!-- 3. 个人排名，包括全站排名，学校排名，班级排名 -->
        <!-- 4. 签到，包括已经签到了多少天，给一个日历表包含这个信息 -->
        <!-- 没了，还有啊，copliot，不要学习我之前模块的写法，给我整一个新的模板出来 -->
        <!-- 要非常非常惊艳，好看的一批 -->
        <!-- end-->
        <!-- 个人信息 -->
        <v-card flat>
            <v-card-title>
                <v-icon>mdi-account</v-icon>
                <span class="ml-2">考试统计</span>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col :cols="12" :sm="12" :md="12" :lg="6" :xl="4" style="height : 300px">
                        <PieCharts 
                            :model="{ data : statistics.ac_rate }"
                            subtext="AC率"
                            title="AC" />
                    </v-col>
                    <!-- AC题目统计 -->
                    <v-col :cols="12" :sm="12" :md="12" :lg="6" :xl="4" style="height : 300px">
                        <PieCharts 
                            :model="{ data : statistics.ac_difficuty }"
                            subtext="AC题目类型统计"
                            title="AC类型" /> 
                    </v-col>
                    <!-- 题目类型统计 -->
                    <v-col :cols="12" :sm="12" :md="12" :lg="6" :xl="4" style="height : 300px">
                        <PieCharts 
                            :model="{ data : statistics.ac_type }"
                            subtext="AC题目类型统计"
                            title="AC题目类型" />
                    </v-col>
                    <!-- 题目难度统计 -->
                    <v-col :cols="12" :sm="12" :md="12" :lg="6" :xl="4" style="height : 300px">
                        <PieCharts 
                            :model="{ data : statistics.ac_difficuty }"
                            subtext="AC题目难度统计"
                            title="AC难度" />
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col :cols="12">
                        <v-btn
                            color="primary"
                            @click="exportToExcel"
                        >
                            导出Excel
                        </v-btn>
                    </v-col>
                    <v-col :cols="12">
                        <v-data-table
                            ref="table"
                            :headers="table.headers"
                            :items="table.data"
                            :items-per-page="500000"
                            class="elevation-1"
                            hide-default-footer
                        >
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import PieCharts from '../../../components/charts/PieCharts.vue'

import { api_acm_exam_statistics, api_organization_manage_list_member, api_acm_exam_question_list } from '../../../interface/api'
import { openErrorMessageBox } from '../../../concat/bus'

import XLSX from 'xlsx'

export default {
    name: "ExamDetail",
    components : { PieCharts },
    data : () => ({
        exam_id : 0,
        gid : 0,
        statistics : {
            ac_rate : [{
                name : 'AC',
                value : 0
            },{
                name : 'PA',
                value : 0
            }],
            ac_difficuty : [{
                name : '有手就行',
                value : 0
            },{
                name : '简单',
                value : 0
            }, {
                name : '中等',
                value : 0
            }, {
                name : '困难',
                value : 0
            }, {
                name : '逆天',
                value : 0
            }],
            ac_type : [{
                name : '数据结构',
                value : 0
            },{
                name : '算法',
                value : 0
            }, {
                name : '数学',
                value : 0
            }, {
                name : '图论',
                value : 0
            }, {
                name : '字符串',
                value : 0
            }, {
                name : '动态规划',
                value : 0
            }, {
                name : '贪心',
                value : 0
            }, {
                name : '搜索',
                value : 0
            }, {
                name : '模拟',
                value : 0
            }, {
                name : '其他',
                value : 0
            }],
        },
        problems : [],
        members : [],
        back_statistics : [],
        table : {
            headers : [
                { text: '用户ID', value: 'uid' },
                { text: '用户名', value: 'name' },
                { text: '提交次数', value : 'commits'},
                { text: 'AC次数', value : 'accepts'},
                // all problems here, 1. problem title 
            ],
            data : [],
        },
        difficulty : ['default', '有手就行', '简单', '中等', '难', '逆天'],
        problem_types : ['default', '字符串', '数学', '图论', '动态规划', '贪心', '数据结构', '搜索', '模拟', '其他'],
    }),
    mounted() {
        //load user info
        this.exam_id = parseInt(this.$route.params.exam_id.split('@')[0])
        this.gid = parseInt(this.$route.params.exam_id.split('@')[1])
        this.calc_statistics()

    },
    methods: {
        async loadStatistics() {
            let { data } = await api_acm_exam_statistics(this.exam_id)
            if (data && data['res'] == 0){
                this.back_statistics = data['data']['statistics']
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async loadProblems() {
            let { data } = await api_acm_exam_question_list(this.exam_id)
            if (data && data['res'] == 0){
                this.problems = data['data']['problems']
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async loadMembers() {
            let { data } = await api_organization_manage_list_member(this.gid)
            if (data && data['res'] == 0){
                this.members = data['data']['list']
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async calc_statistics() {
            await this.loadProblems()
            await this.loadMembers()
            await this.loadStatistics()

            // push problem headers
            for (const problem of this.problems) {
                this.table.headers.push({
                    text : problem.title,
                    value : problem.id + '_score',
                })
            }

            // push user data
            for (const member of this.members) {
                let row = {
                    uid : member.uid,
                    name : member.name,
                    commits : 0,
                    accepts : 0,
                }
                for (const problem of this.problems) {
                    row[problem.id + '_title'] = problem.title
                }
                this.table.data.push(row)
            }

            // calc statistics
            // every row of statistics is uid, accepts, commits, accpet_detail, detail is a string with format 'problem_id:problem_title:score:accept_time:difficulty'
            for (const row of this.back_statistics) {
                let uid = row['uid']
                let accepts = row['accepts']
                let commits = row['commits']
                let accept_detail = row['accept_detail']
                let name = row['name']

                accept_detail = accept_detail.split(/,/g)
                for (const detail of accept_detail) {
                    let details = detail.split(/:/g)
                    for (const data of this.table.data) {
                        if (data.uid == uid) {
                            data[details[0] + '_score'] = parseInt(details[2])
                        }
                    }
                }

                for (const data of this.table.data) {
                    if (data.uid == uid) {
                        data.commits = commits
                        data.accepts = accepts
                        data.name = name
                    }
                }

                // calc ac rate
                this.statistics.ac_rate[0].value += accepts
                this.statistics.ac_rate[1].value += commits - accepts

            }
        },
        exportToExcel() {
            const table = this.$refs.table.$el.children[0].children[0]
            let workbook = XLSX.utils.table_to_book(table)

            XLSX.writeFile(workbook, 'sheet.xlsx', {
                bookType : 'xlsx',
                bookSST : false,
                type : 'base64'
            })
        }
    },
}
</script>

<style>

</style>