<template>
    <v-container style="margin-top: 30px; margin-bottom: 30px">
        <v-card>
            <v-row>
                <v-col xl="12" lg="12" md="12" sm="12" cols="12">
                    <DateValueSmoothChart
                        title="得分情况"
                        subtext="七日内的分数情况"
                        :model="score"
                        style="width: 100%"
                     />
                </v-col>
                <v-col xl="4" lg="4" md="6" sm="6" cols="12" style="height : 300px">
                    <PieCharts 
                        title="作业完成比例" 
                        subtext="历史发布的作业中完成作业的占比" 
                        :model="{ data : rate_of_finished }" 
                    />
                </v-col>
                <v-col xl="4" lg="4" md="6" sm="6" cols="12" style="height : 300px">
                    <PieCharts 
                        title="作业类型比例" 
                        subtext="完成的作业的类型分布" 
                        :model="{ data : rate_of_type }" 
                    />
                </v-col>
                <v-col xl="4" lg="4" md="6" sm="6" cols="12" style="height : 300px">
                    <PieCharts 
                        title="正确率" 
                        subtext="flag提交正确率" 
                        :model="{ data : rate_of_correct }" 
                    />
                </v-col>
                <v-col cols="12">
                    <v-card-text style="color:rgba(0, 0, 0, 0.6)">作业提交记录</v-card-text>
                    <v-data-table
                        
                        :options.sync="table_options"
                        :headers="records_headers"
                        :items="records"
                        dense
                    ></v-data-table>
                    
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>

import PieCharts from '../components/charts/PieCharts.vue'
import DateValueSmoothChart from '../components/charts/DateValueSmoothChart.vue'
import { api_get_homework_record } from '../interface/api'

export default {
    components : { PieCharts, DateValueSmoothChart },
    data : () => ({
        rate_of_finished : [{
            name : '完成',
            value : 2
        }, {
            name : '未完成',
            value : 1
        }],
        rate_of_type : [{
            name : 'pwn',
            value : 0
        }, {
            name : 'web',
            value : 0
        }, {
            name : 'misc',
            value : 0
        }, {
            name : 'crypto',
            value : 0
        }],
        rate_of_correct : [{
            name : '正确',
            value : 32
        }, {
            name : '错误',
            value : 3
        }],
        score : {
            date : ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7'],
            value : [50, 70, 110, 0, 30, 50, 90]
        },
        records_headers : [{
            text : '作业ID',
            value : 'hid'
        }, {
            text : '标题',
            value : 'title'
        }, {
            text : '内容',
            value : 'desc'
        }, {
            text : '发布时间',
            value : 'time'
        }, {
            text : '结束时间',
            value : 'end_at'
        }],
        records : [],
        table_options : {}
    }),
    watch : {
        table_options : {
            handler(){
                const { page } = this.table_options
                this.injectRecords(page)
            },
            deep : true
        }
    },
    computed : {

    },
    methods : {
        async injectRecords(page){
            const data = await api_get_homework_record(page)
            this.records = data
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