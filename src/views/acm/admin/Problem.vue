<template>
    <div class="py2">
        <v-row>
            <v-col :cols="12" style="float: right">
                <!-- 新建 -->
                <v-btn
                    color="primary"
                    @click="to('/acm/admin/edit-problem/0')"
                >新建</v-btn>
            </v-col>
            <v-col :cols="12">
                <v-data-table
                    :headers="problem_headers"
                    :items="problems"
                    class="elevation-1"
                >
                    <template v-slot:item.action="{ item }">
                        <v-btn
                            color="primary"
                            @click="to(`/acm/admin/edit-problem/${item.id}`)"
                        >编辑</v-btn>
                        <v-btn
                            color="error"
                            @click="deleteProblem(item.id)"
                        >删除</v-btn>
                        <v-btn
                            color="green"
                            @click="to(`/acm/admin/commit/${item.id}`)"
                            dark
                        >查看提交</v-btn>
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
import { openErrorMessageBox, openInfoMessageBox } from '../../../concat/bus'

import { 
    api_acm_admin_question_list, api_acm_admin_question_delete
} from '../../../interface/api'

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
            value : 'submit'
        },{
            text : '通过数',
            value : 'ac'
        }, {
            text : '操作',
            value : 'action'
        }],
        problems : [],
        page : 1
    }),
    watch : {
        page : {
            handler(){
                this.load_problems()
            },
            immediate : true
        }
    },
    methods : {
        to(path) {
            this.$router.push(path)
        },
        async load_problems() {
            let { data } = await api_acm_admin_question_list(this.page, 25)
            if (data && data['res'] == 0){
                if(data['data']['questions']){
                    this.problems = data['data']['questions']
                }
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async deleteProblem(id) {
            let { data } = await api_acm_admin_question_delete(id)
            if (data && data['res'] == 0){
                this.load_problems()
                openInfoMessageBox('提示', '删除成功')
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        }
    },
}
</script>

<style>

</style>