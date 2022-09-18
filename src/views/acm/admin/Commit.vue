<template>
    <v-row>
        <v-col :cols="12">
            <v-card flat>
                <v-card-title>
                    提交记录
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="testing_headers"
                        :items="testings"
                        :items-per-page="99999"
                        class="elevation-1"
                        hide-default-footer
                    >
                        <template v-slot:item.action="{ item }">
                            <v-btn
                                color="primary"
                                @click="openCodeDialog(item.code)"
                            >查看</v-btn>
                        </template>
                        <template v-slot:item.status="{ item }">
                            <div v-if="item.status == 1">
                                <v-chip color="grey" dark>未测试</v-chip>
                            </div>
                            <div v-else-if="item.status == 2">
                                <v-progress-circular
                                    :size="20"
                                    :width="2"
                                    indeterminate
                                ></v-progress-circular>
                            </div>
                            <div v-else-if="item.status == 3">
                                <div v-if="item.err == 0">
                                    <v-chip color="green" v-if="item.pass == item.total_case" dark>通过</v-chip>
                                    <v-chip color="red" v-else dark>未通过</v-chip>
                                </div>
                                <div v-else>
                                    <v-chip v-if="item.err == 1" color="orange" dark>传输错误</v-chip>
                                    <v-chip v-if="item.err == 2" color="orange" dark>编译/运行错误</v-chip>
                                    <v-chip v-if="item.err == 3" color="orange" dark>编译/运行错误</v-chip>
                                    <v-chip v-if="item.err == 4" color="orange" dark>超时</v-chip>
                                    <v-chip v-if="item.err == 5" color="orange" dark>内存超限</v-chip>
                                    <v-chip v-if="item.err == 6" color="orange" dark>未知</v-chip>
                                </div>
                            </div>
                        </template>
                        <template v-slot:item.ac_rate="{ item }">
                            {{ item.pass }} / {{ item.total_case }}
                        </template>
                        <template v-slot:item.time="{ item }">
                            {{ new Date(item.time * 1000).toLocaleString() }}
                        </template>
                        <template v-slot:item.exe_time="{ item }">
                            {{ item.exe_time / 1000000 }} ms
                        </template>
                        <template v-slot:item.exe_mem="{ item }">
                            {{ item.exe_mem / 1024 }} KB
                        </template>
                    </v-data-table>
                    <!-- <v-pagination
                        v-model="page"
                        :length="99999"
                        :total-visible="10"
                    ></v-pagination> -->
                </v-card-text>
            </v-card>
        </v-col>
        <v-dialog
            v-model="dialog"
            max-width="700px"
        >
            <v-card>
                <v-card-title class="headline">提交代码</v-card-title>
                <v-card-text>
                    <pre>
                        {{ current_code }}
                    </pre>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../../concat/bus'
import {
    api_acm_admin_testing_list
} from '../../../interface/api'

export default {
    data : () => ({
        testing_headers : [{
            text : '测试编号',
            value : 'id'
        },{
            text : '通过率',
            value : 'ac_rate'
        },{
            text : '用户uid',
            value : 'uid'
        },{
            text : '提交时间',
            value : 'time'
        },{
            text : '提交语言',
            value : 'language'
        }, {
            text : '执行时间',
            value : 'exe_time'
        }, {
            text : '执行内存',
            value : 'exe_mem'
        }, {
            text : '状态',
            value : 'status'
        },{
            text : '操作',
            value : 'action'
        }],
        testings : [],
        page : 1,
        question_id : 0,
        dialog : false,
        current_code : '',
    }),
    watch : {

    },
    methods : {
        async loadTestings() {
            const { data } = await api_acm_admin_testing_list(this.question_id)
            if (data && data['res'] == 0) {
                if (data['data']['testing']) {
                    this.testings = data['data']['testing']
                }
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        to(path) {
            this.$router.push(path)
        },
        openCodeDialog(code) {
            this.current_code = code
            this.dialog = true
        }
    },
    mounted() {
        this.question_id = parseInt(this.$route.params.pid)
        if (!this.question_id) {
            this.$router.push('/acm/admin')
        }
        this.loadTestings()
    }
}
</script>

<style>

</style>