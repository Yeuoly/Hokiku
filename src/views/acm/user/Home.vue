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
                <span class="ml-2">个人信息</span>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model="user.id"
                            label="ID"
                            readonly
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model="user.username"
                            label="昵称"
                            readonly
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model="user.register_time"
                            label="注册时间"
                            readonly
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model="user.score"
                            label="当前分数"
                            readonly
                        ></v-text-field>
                    </v-col>
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

                    <v-col :cols="12" style="height : 400px">
                        <DateValueSmoothChart
                            :model="statistics.history"
                            title="历史提交统计"
                            subtext="提交数，橙色为PA，紫色为AC，蓝色为WA"
                         />
                    </v-col> 
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import PieCharts from '../../../components/charts/PieCharts.vue'
import DateValueSmoothChart from '../../../components/charts/DateValueSmoothChart.vue'

import { api_acm_user_statistics } from '../../../interface/api'
import { openErrorMessageBox } from '../../../concat/bus'

export default {
    name: "User",
    components : { PieCharts, DateValueSmoothChart },
    data : () => ({
        user : {
            id : 0,
            username : '',
            school : '',
            class : '',
            email : '',
            phone : '',
            register_time : '',
            score : 0,
        },
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
            history : {
                date : [],
                value : [[], [], []]
            },
        },
        difficulty : ['default', '有手就行', '简单', '中等', '难', '逆天'],
        problem_types : ['default', '字符串', '数学', '图论', '动态规划', '贪心', '数据结构', '搜索', '模拟', '其他'],
    }),
    mounted() {
        //load user info
        this.user.id = this.$store.getters.getUserUid
        this.user.username = this.$store.getters.getUserName

        this.loadStatistics()
    },
    methods: {
        async loadStatistics() {
            let { data } = await api_acm_user_statistics(1, 500)
            if (data && data['res'] == 0){
                if (data['data']['solves']) {
                    let score = 0
                    for (const solve of data['data']['solves']) {
                        if ((solve.flag & 2) == 2) {
                            if (solve.difficulty >= 0 && solve.difficulty <= 4) {
                                const difficulty_num = solve.difficulty
                                let difficulty_name = this.difficulty[difficulty_num]
                                for (const difficulty of this.statistics.ac_difficuty) {
                                    if (difficulty.name == difficulty_name) {
                                        difficulty.value += 1
                                        break
                                    }
                                }
                            }
                            if(this.problem_types.includes(solve.type)) {
                                for (const type of this.statistics.ac_type) {
                                    if (type.name == solve.type) {
                                        type.value += 1
                                        break
                                    }
                                }
                            } else {
                                for (const type of this.statistics.ac_type) {
                                    if (type.name == '其他') {
                                        type.value += 1
                                        break
                                    }
                                }
                            }
                        } else {
                            this.statistics.ac_rate[1].value += 1
                        }
                        score += solve.score
                    }
                    this.user.score = score
                }
                if (data['data']['commits']) {
                    for (const commit of data['data']['commits']) {
                        let date = new Date(commit.time * 1000).formatDate('Y-M-D')
                        // check if date exists, in the end of array
                        if (this.statistics.history.date[this.statistics.history.date.length - 1] != date) {
                            this.statistics.history.date.push(date)
                            this.statistics.history.value[0].push(0)
                            this.statistics.history.value[1].push(0)
                            this.statistics.history.value[2].push(0)
                        }
                        if (commit.pass == commit.total_case) {
                            this.statistics.history.value[0][this.statistics.history.value[0].length - 1] += 1
                        } else if (commit.pass > 0) {
                            this.statistics.history.value[1][this.statistics.history.value[1].length - 1] += 1
                        } else {
                            this.statistics.history.value[2][this.statistics.history.value[2].length - 1] += 1
                        }
                    }
                }
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        }
    },
}
</script>

<style>

</style>