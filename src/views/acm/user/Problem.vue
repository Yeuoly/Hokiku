<template>
    <div>
        <v-row>
            <v-col :cols="12">
                <v-data-table
                    :headers="problem_headers"
                    :items="problems"
                    :items-per-page="50"
                    hide-default-footer
                >
                    <template v-slot:item.action="{ item }">
                        <v-btn
                            color="primary"
                            @click="to(`/acm/user/problem/detail/${item.id}`)"
                        >进入</v-btn>
                    </template>
                    <template v-slot:item.difficulty="{ item }">
                        <v-chip color="grey" v-if="item.difficulty == 1" dark>有手就行</v-chip>
                        <v-chip color="green" v-if="item.difficulty == 2" dark>简单</v-chip>
                        <v-chip color="blue" v-if="item.difficulty == 3" dark>中等</v-chip>
                        <v-chip color="orange" v-if="item.difficulty == 4" dark>困难</v-chip>
                        <v-chip color="red" v-if="item.difficulty == 5" dark>逆天</v-chip>
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
import { api_acm_user_question_list } from '../../../interface/api'

export default {
    data : () => ({
        problem_headers : [{
            text : '题号',
            value : 'id'
        },{
            text : '标题',
            value : 'title'
        },{
            text : '通过率',
            value : 'ac_rate'
        },{
            text : '难度',
            value : 'difficulty'
        },{
            text : '类型',
            value : 'type'
        },{
            text : '提交数',
            value : 'commited'
        },{
            text : '通过数',
            value : 'accepted'
        }, {
            text : '操作',
            value : 'action'
        }],
        problems : [],
        page : 1
    }),
    watch : {
        page : {
            handler() {
                this.loadProblems()
            },
            immediate : true
        }
    },
    methods :{
        async loadProblems() {
            const { data } = await api_acm_user_question_list(this.page, 50)
            if (data && data['res'] == 0) {
                for (let i = 0; i < data['data']['question'].length; i++) {
                    data['data']['question'][i]['ac_rate'] = `${data['data']['question'][i]['accepted']}/${data['data']['question'][i]['commited']}`
                }
                this.problems = data['data']['question']
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        to(path) {
            this.$router.push(path)
        }
    }
}
</script>

<style>

</style>