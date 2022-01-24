<template>
    <v-row>
        <v-col xl="12" lg="12" md="12" sm="12" cols="12">
            <v-card-text style="color:rgba(0, 0, 0, 0.6)">作业列表</v-card-text>
            <v-data-table
                :loading="homework_loading"
                :options.sync="table_options"
                :headers="homeworks_headers"
                :items="homeworks"
                :server-items-length="999999"
                dense
            >
                <template v-slot:item.time="{ item }">
                    {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.end_at="{ item }">
                    {{ new Date(item.end_at * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.finished="{ item }">
                    {{ (item.flag & 2) != 0 ? '已提交' : '未提交' }}
                </template>
                <template v-slot:item.submit="{ item }">
                    <v-btn icon small 
                        @click="toSubmitHomeWork(item.hid)"
                        :disabled="current_time > item.end_at"
                    >
                        <v-icon small>
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_homework_list } from '../../interface/api'

export default {
    components : {},
    data : () => ({
        homeworks_headers : [{
            text : '作业ID',
            value : 'hid'
        }, {
            text : '标题',
            value : 'title'
        }, {
            text : '发布者',
            value : 'owner'
        }, {
            text : '发布时间',
            value : 'time'
        }, {
            text : '结束时间',
            value : 'end_at'
        }, {
            text : '分数',
            value : 'score'
        }, {
            text : '是否提交',
            value : 'finished'
        }, {
            text : '提交',
            value : 'submit'
        }],
        homeworks : [],
        table_options : {},
        homework_loading : false
    }),
    watch : {
        table_options : {
            handler(){
                const { page } = this.table_options
                this.injectHomewroks(page)
            },
            deep : true
        }
    },
    computed : {
        current_time(){
            return parseInt(new Date().getTime() / 1000)
        }
    },
    methods : {
        async injectHomewroks(page){
            this.homework_loading = true
            const { data } = await api_homework_list(page, 10)
            if(!data){
                openErrorMessageBox('错误', '网络异常')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else if(data['data']){    
                    this.homeworks.splice(0, this.homeworks.length)
                    for(const i of data['data']){
                        this.homeworks.push({
                            hid : i.r_homework.id,
                            title : i.r_homework.title,
                            desc : i.r_homework.desc,
                            time : i.r_homework.time,
                            end_at : i.r_homework.endtime,
                            owner : i.r_homework.r_owner.name,
                            score : i.score,
                            flag : i.flag
                        })
                    }
                }
                this.homework_loading = false
            }
        },
        toSubmitHomeWork(hid){
            this.$router.push(`/homework/${hid}`)
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