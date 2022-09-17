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
                    <v-col :cols="12">
                        <v-divider></v-divider>
                    </v-col>

                    <v-col :cols="12" style="height : 400px">
                        <DateValueSmoothChart
                            :model="statistics.history"
                            title="历史提交统计"
                            subtext="提交数"
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
                name : 'WA',
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
                date : ['2020-01-01', '2020-01-02', '2020-01-03', '2020-01-04', '2020-01-05', '2020-01-06', '2020-01-07'],
                value : [[1, 2, 3, 4, 5, 6, 7], [1, 3, 4, 5, 6, 6, 6]]
            },
        }
    }),
    mounted() {
        //load user info
        this.user.id = this.$store.getters.getUserUid
        this.user.username = this.$store.getters.getUserName

    },
    methods: {
    },
}
</script>

<style>

</style>