<template>
    <div class="py2">
        <v-card flat>
            <v-card-title>
                {{ exam_id == 0 ? '新建考试' : '编辑考试' }}
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                        <v-text-field
                            v-model="exam.title"
                            label="标题"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                        <v-text-field
                            v-model="exam.description"
                            label="描述"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col :cols="6">
                        <v-menu
                            v-model="dialog_switch.exam_start_date_picker"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    dense
                                    v-model="exam.start_time.date"
                                    label="比赛开始日期"
                                    prepend-icon="mdi-timer-outline"
                                    readonly
                                    v-on="on"
                                    v-bind="attrs"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="exam.start_time.date"
                                scrollable
                                no-title
                                @input="dialog_switch.exam_start_date_picker = false"
                                locale="zh-cn"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="6">
                        <v-menu
                            ref="exam_start_time_picker"
                            v-model="dialog_switch.exam_start_time_picker"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="exam.start_time.time"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                            min-height="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    dense
                                    v-model="exam.start_time.time"
                                    label="比赛开始时间"
                                    prepend-icon="mdi-timer-outline"
                                    readonly
                                    v-on="on"
                                    v-bind="attrs"
                                ></v-text-field>
                            </template>
                            <v-time-picker
                                v-if="dialog_switch.exam_start_time_picker"
                                v-model="exam.start_time.time"
                                full-width
                                @click:minute="$refs.exam_start_time_picker.save(exam.start_time.time)"
                            ></v-time-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="6">
                        <v-menu
                            v-model="dialog_switch.exam_end_date_picker"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    dense
                                    v-model="exam.end_time.date"
                                    label="比赛结束日期"
                                    prepend-icon="mdi-timer-outline"
                                    readonly
                                    v-on="on"
                                    v-bind="attrs"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="exam.end_time.date"
                                scrollable
                                no-title
                                @input="dialog_switch.exam_end_date_picker = false"
                                locale="zh-cn"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="6">
                        <v-menu
                            ref="exam_end_time_picker"
                            v-model="dialog_switch.exam_end_time_picker"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="exam.end_time.time"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                            min-height="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    dense
                                    v-model="exam.end_time.time"
                                    label="比赛结束时间"
                                    prepend-icon="mdi-timer-outline"
                                    readonly
                                    v-on="on"
                                    v-bind="attrs"
                                ></v-text-field>
                            </template>
                            <v-time-picker
                                v-if="dialog_switch.exam_end_time_picker"
                                v-model="exam.end_time.time"
                                full-width
                                @click:minute="$refs.exam_end_time_picker.save(exam.end_time.time)"
                            ></v-time-picker>
                        </v-menu>
                    </v-col>
                    <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3" v-if="this.exam_id == 0">
                        <v-select
                            label="发布到组织"
                            :items="organizations"
                            item-text="name"
                            item-value="id"
                            menu-props="auto"
                            single-line
                            v-model="exam.gid"
                        ></v-select>
                    </v-col>
                    <v-col :cols="12">
                        题目集：
                        <v-btn @click="addProblem" color="primary"> 添加 </v-btn>
                        <div v-if="exam.problems.length > 0" class="px2 py2">
                            <v-data-table
                                :headers="problem_headers"
                                :items="exam.problems"
                                :items-per-page="50"
                                hide-default-footer
                            >
                                <template v-slot:item.action="{ item }">
                                    <v-btn
                                        color="primary"
                                        @click="$router.push(`/acm/user/problem/detail/${item.id}`)"
                                    >进入</v-btn>
                                    <v-btn
                                        color="primary"
                                        @click="$router.push(`/acm/admin/edit-problem/${item.id}@${exam_id}`)"
                                    >编辑</v-btn>
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
                        </div>
                        <div v-else class="px2 py2 w100 text-center">
                            暂无题目
                        </div>
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col :cols="12">
                        <v-btn color="primary" @click="submit"> 提交 </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-snackbar
            v-model="message_bar"
            :timeout="6000"
            :top="true"
            color="success"
        >  
            {{ message_content }}
        </v-snackbar>
    </div>
</template>

<script>
import { openErrorMessageBox, openErrorSnackbar } from '../../../concat/bus'

import {
  api_acm_exam_create,
  api_organization_manage_list_orgs,
  api_acm_exam_get,
  api_acm_exam_question_list,
  api_acm_exam_update
} from '../../../interface/api'

export default {
    components : {  },
    data : () => ({
        exam_id : 0,
        exam : {
            title : '',
            description : '',
            start_time : {
                date : '',
                time : '',
            },
            end_time : {
                date : '',
                time : '',
            },
            gid : 0,
            problems : [],
        },
        message_bar : false,
        message_content : '',
        dialog_switch : {
            exam_start_date_picker : false,
            exam_start_time_picker : false,
            exam_end_date_picker : false,
            exam_end_time_picker :false,
        },
        organizations : [],
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
    }),
    computed : {
        exam_start_time() {
            return parseInt(new Date(this.exam.start_time.date + ' ' + this.exam.start_time.time).getTime() / 1000)
        },
        exam_end_time() {
            return parseInt(new Date(this.exam.end_time.date + ' ' + this.exam.end_time.time).getTime() / 1000)
        }
    },
    methods : {
        snackMessage(message) {
            this.message_content = message
            this.message_bar = true
        },
        async loadExam() {
            let { data } = await api_acm_exam_get(this.exam_id)
            if (data && data['res'] == 0){
                this.exam.title = data['data']['exam']['title']
                this.exam.description = data['data']['exam']['description']
                const start_time = new Date(data['data']['exam']['start_time'] * 1000)
                const end_time = new Date(data['data']['exam']['end_time'] * 1000)
                this.exam.start_time = {
                    date : start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate(),
                    time : start_time.getHours() + ':' + start_time.getMinutes() + ':' + start_time.getSeconds(),
                }
                this.exam.end_time = {
                    date : end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate(),
                    time : end_time.getHours() + ':' + end_time.getMinutes() + ':' + end_time.getSeconds(),
                }
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async loadOrganizations() {
            let { data } = await api_organization_manage_list_orgs()
            if (data && data['res'] == 0){
                this.organizations = data['data'] ? data['data'] : []
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async loadProblems() {
            let { data } = await api_acm_exam_question_list(this.exam_id)
            if (data && data['res'] == 0){
                this.exam.problems = data['data']['problems'] ? data['data']['problems'] : []
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        addProblem() {
            if (this.exam_id === 0) {
                openErrorSnackbar('请先提交比赛信息')
                return
            }
            this.$router.push('/acm/admin/edit-problem/0@' + this.exam_id)
        },
        submit() {
            if (this.exam_id === 0) {
                this.createExam()
            } else {
                this.updateExam()
            }
        },
        async createExam() {
            const { data } = await api_acm_exam_create(
                this.exam.title,
                this.exam.description,
                this.exam_start_time,
                this.exam_end_time,
                this.exam.gid,
            )
            if (data && data['res'] == 0) {
                this.exam_id = data['data']['id']
                this.snackMessage('创建成功')
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async updateExam() {
            const { data } = await api_acm_exam_update(
                this.exam_id,
                this.exam.title,
                this.exam.description,
                this.exam_start_time,
                this.exam_end_time,
            )
            if (data && data['res'] == 0) {
                this.snackMessage('更新成功')
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
    },
    mounted() {
        //get current question id
        this.exam_id = parseInt(this.$route.params.eid)
        //test current question id is valid
        if (isNaN(this.exam_id)) {
            this.exam_id = 0
        }
        if (this.exam_id !== 0) {
            this.loadExam()
            this.loadProblems()
        } else {
            this.loadOrganizations()
        }
    }
}
</script>

<style>

</style>