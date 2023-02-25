<template>
    <div class="py2">
        <v-row>
            <v-col :cols="12" style="float: right">
                <!-- 新建 -->
                <v-btn
                    color="primary"
                    @click="to('/acm/admin/edit-exam/0')"
                >新建</v-btn>
            </v-col>
            <v-col :cols="12">
                <v-data-table
                    :headers="exams_headers"
                    :items="exams"
                    class="elevation-1"
                >
                    <template v-slot:item.action="{ item }">
                        <v-btn
                            color="primary"
                            @click="to(`/acm/admin/edit-exam/${item.id}`)"
                        >编辑</v-btn>
                        <v-btn
                            color="error"
                            @click="editExam(item.id)"
                        >删除</v-btn>
                        <v-btn
                            color="primary"
                            @click="to(`/acm/admin/exam_staistics/${item.id}@${item.gid}`)"
                        >详情</v-btn>
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
  api_acm_exam_delete,
    api_acm_exam_list
} from '../../../interface/api'

export default {
    data : () => ({
        exams_headers : [{
            text : '考试号',
            value : 'id'
        },{
            text : '标题',
            value : 'title'
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
            text : '发布在',
            value : 'organization_name'
        },{
            text : '操作',
            value : 'action'
        }],
        exams : [],
        page : 1
        
    }),
    
    watch : {
        page : {
            handler(){
                this.load_exams()
            },
            immediate : true
        }
    },
    methods : {
        to(path) {
            this.$router.push(path)
        },
        async load_exams() {
            let { data } = await api_acm_exam_list(this.page, 25)
            if (data && data['res'] == 0){
                if(data['data']['exams']){
                    for (let i = 0; i < data['data']['exams'].length; i++) {
                        data['data']['exams'][i]['ac_rate'] = `${data['data']['exams'][i]['accepts']}/${data['data']['exams'][i]['commits']}`
                    }
                    this.exams = data['data']['exams']
                }
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async deleteProblem(id) {
            let { data } = await api_acm_exam_delete(id)
            if (data && data['res'] == 0){
                this.load_exams()
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