<template>
    <v-container>
        <v-card-title class="text-grey">
            编辑详情页html
        </v-card-title>
        <CodeEditor
            language="html"
            v-model="html_content"
        ></CodeEditor>
        <p></p>
        <v-btn @click="commitDetailPage" color="primary">提交详情页</v-btn>
        <v-row class="mt5">
            <v-col cols="6">
                <v-card-title style="padding: 0; padding-left: 15px">
                    编辑题单
                </v-card-title>
            </v-col>
            <v-col cols="6">
                <v-btn style="float: right" class="mr5" @click="openAddSubjectDialog" color="primary">新建</v-btn>
            </v-col>
        </v-row>
        <v-data-table
            :items="subjects"
            :headers="headers_game"
            disable-pagination
        >
            <template v-slot:item.type="{ item }">
                {{ getTypeName(item.type) }}
            </template>
            <template v-slot:item.action="{ item }">
                <v-btn
                    small
                    @click="openEditSubjectDialog(item)"
                    color="primary"
                >编辑</v-btn>
                <v-btn
                    small
                    @click="deleteSubject(item)"
                    color="error"
                >删除</v-btn>
            </template>
        </v-data-table>
        <v-btn @click="publish_message_dialog.open = true" color="primary">发布比赛动态</v-btn>
        <v-dialog v-model="dialog.open" max-width="800">
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title class="text-white">
                        编辑赛题
                    </v-toolbar-title>
                </v-toolbar>
                <div class="px5 py2">

                    <v-text-field
                        v-model="dialog.edit_subject_title"
                        label="题目"
                    ></v-text-field>
                    <v-text-field
                        v-model="dialog.edit_subject_comment"
                        label="备注"
                    ></v-text-field>
                    <v-text-field
                        v-model="dialog.edit_subject_origin_score"
                        label="原始分数"
                    ></v-text-field>
                    <v-text-field
                        v-model="dialog.edit_subject_ctf_flag"
                        label="默认flag"
                    ></v-text-field>
                    <v-switch
                        label="动态flag"
                        v-model="dialog.edit_subject_is_dynamic"
                    ></v-switch>
                    <v-radio-group
                        row
                        v-model="dialog.edit_subject_flag_type"
                    >
                        <v-radio
                            v-for="(i, k) in flag_types"
                            :key="k"
                            :label="flag_types[k]"
                            :value="k"
                        ></v-radio>
                    </v-radio-group>
                    <v-text-field
                        v-model="dialog.edit_subject_flag_path"
                        label="flag路径"
                    ></v-text-field>
                    <v-layout>
                        <!-- game_end_time -->
                        <v-col :cols="6">
                            <v-menu
                                v-model="dialog.open_date"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.edit_subject_start_date"
                                        label="题目放出日期"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="dialog.edit_subject_start_date"
                                    scrollable
                                    no-title
                                    @input="dialog.open_date = false"
                                    locale="zh-cn"
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col :cols="6">
                            <v-menu
                                ref="start_time_picker"
                                v-model="dialog.open_time"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="dialog.edit_subject_start_time"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                                min-height="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        dense
                                        v-model="dialog.edit_subject_start_time"
                                        label="题目放出时间"
                                        prepend-icon="mdi-timer-outline"
                                        readonly
                                        v-on="on"
                                        v-bind="attrs"
                                    ></v-text-field>
                                </template>
                                <v-time-picker
                                    v-if="dialog.open_time"
                                    v-model="dialog.edit_subject_start_time"
                                    full-width
                                    @click:minute="$refs.start_time_picker.save(dialog.edit_subject_start_time)"
                                ></v-time-picker>
                            </v-menu>
                        </v-col>
                    </v-layout>
                    <v-text-field
                        v-model="dialog.edit_subject_image"
                        label="镜像名"
                    ></v-text-field>
                    <v-text-field
                        v-model="dialog.edit_subject_port_protocol"
                        label="端口协议"
                    ></v-text-field>
                    <v-text-field
                        v-model="dialog.edit_subject_hint"
                        label="提示"
                    ></v-text-field>
                    <v-row>
                        <v-col :cols="12" class="text-grey">
                            附件：
                        </v-col>
                        <v-col :cols="3" v-for="(i, k) in dialog.edit_subject_attachments" :key="k">
                            <v-card color="green" dark :title="i.r_resource.extra" class="clickable">
                                <v-card-title>
                                    <!-- final 10 chars -->
                                    {{ i.r_resource.extra.substr(-12) }}
                                </v-card-title>
                            </v-card>
                        </v-col>
                        <v-col :cols="2">
                            <UploadAttachment :size="32" @change="hookUploadAttachment" v-model="dialog.tmp_attchement_rid" />
                        </v-col>
                    </v-row>
                    <v-radio-group
                        row
                        v-model="dialog.edit_subject_type"
                    >
                        <v-radio
                            v-for="(i, k) in subject_types"
                            :key="k"
                            :label="subject_types[k]"
                            :value="k"
                        ></v-radio>
                    </v-radio-group>
                <v-btn color="primary" @click="commitSubject">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog v-model="publish_message_dialog.open" width="600">
            <v-card>
                <v-card-text>
                    <v-textarea v-model="publish_message_dialog.message"></v-textarea>
                    <v-btn color="primary" @click="publishMessage">发布</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { 
    api_competition_game_detail, 
    api_competition_game_detail_upload,
    api_comeptition_game_subject_admin_list,
    api_competition_game_subject_admin_create,
    api_competition_game_subject_admin_update,
    api_competition_game_subject_admin_delete,
    api_competition_game_attachemnt_list,
    api_competition_game_attachemnt_upload,
    api_competition_game_message_publish,
} from '../../interface/api'
import CodeEditor from '../../components/common/CodeEditor'
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import UploadAttachment from '../../components/common/UploadAttachment.vue'

export default {
    components : { CodeEditor, UploadAttachment },
    computed : {
        subject_start_time () {
            return parseInt(new Date(this.dialog.edit_subject_start_date + ' ' + this.dialog.edit_subject_start_time).getTime() / 1000)
        }
    },
    data : () => ({
        subjects : [],
        html_content : '',
        competition_id : 0,
        headers_game : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '标题',
            value : 'title'
        }, {
            text : '初始分值',
            value : 'origin_score'
        }, {
            text : '完成人数',
            value : 'resolved'
        }, {
            text : '类型',
            value : 'type'
        }, {
            text : '开放端口与协议',
            value : 'port_protocol'
        }, {
            text: 'flag路径',
            value: 'flag_path'
        }, {
            text : '操作',
            value : 'action'
        }],
        dialog : {
            open : false,
            open_date : false,
            open_time : false,
            is_new : true,
            edit_subject_id : 0,
            edit_subject_title : '',
            edit_subject_image : '',
            edit_subject_origin_score : 0,
            edit_subject_type : 0,
            edit_subject_port_protocol : '',
            edit_subject_flag_type : 0,
            edit_subject_flag_path : '',
            edit_subject_ctf_flag : '',
            edit_subject_comment : '',
            edit_subject_resolved : 0,
            edit_subject_is_dynamic : false,
            edit_subject_start_date : '',
            edit_subject_start_time : '',
            edit_subject_hint : '',
            edit_subject_attachments : [],
            tmp_attchement_rid : 0
        },
        publish_message_dialog : {
            open : false,
            message : ''
        },
        subject_types : ['DEFAULT', 'WEB', 'PWN', 'MISC', 'REVERSE', 'CRYPTO', 'MOBILE'],
        flag_types: ['DEFAULT', '文件flag', '模板指令', '环境变量'],
    }),
    methods : {
        async load() {
            const { data } = await api_competition_game_detail(this.competition_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['data'] != '') {
                    this.html_content = data['data']['html_content']
                }
            }

            const { data: subjects } = await api_comeptition_game_subject_admin_list(this.competition_id)
            if (!subjects) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (subjects['data'] != null) {
                    this.subjects = subjects['data']
                }
            }
        },
        async commitDetailPage() {
            const { data } = await api_competition_game_detail_upload(this.competition_id, this.html_content)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    openInfoMessageBox('成功', '提交成功')
                }
            }
        },
        async publishMessage() {
            const { data } = await api_competition_game_message_publish(this.competition_id, this.publish_message_dialog.message)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    openInfoMessageBox('成功', '发布成功')
                    this.publish_message_dialog.message = ''
                }
            }
        },
        getTypeName(type) {
            return this.subject_types[type]
        },
        openAddSubjectDialog() {
            this.dialog.open = true
            this.dialog.is_new = true
            this.dialog.edit_subject_id = 0
            this.dialog.edit_subject_title = ''
            this.dialog.edit_subject_origin_score = 0
            this.dialog.edit_subject_type = 0
            this.dialog.edit_subject_port_protocol = ''
            this.dialog.edit_subject_flag_type = 1
            this.dialog.edit_subject_flag_path = '/home/ctf/flag'
            this.dialog.edit_subject_comment = ''
            this.dialog.edit_subject_resolved = 0
            this.dialog.edit_subject_is_dynamic = false
        },
        openEditSubjectDialog(subject) {
            this.dialog.open = true
            this.dialog.is_new = false
            this.dialog.edit_subject_id = subject['id']
            this.dialog.edit_subject_title = subject['title']
            this.dialog.edit_subject_origin_score = subject['origin_score']
            this.dialog.edit_subject_type = subject['type']
            this.dialog.edit_subject_port_protocol = subject['port_protocol']
            this.dialog.edit_subject_flag_type = subject['flag_type']
            this.dialog.edit_subject_flag_path = subject['flag_path']
            this.dialog.edit_subject_comment = subject['comment']
            this.dialog.edit_subject_resolved = subject['resolved']
            this.dialog.edit_subject_is_dynamic = (subject['flag'] & 2) == 2
            this.dialog.edit_subject_ctf_flag = subject['ctf_flag']
            const start_time = new Date(subject['start_time'] * 1000).formatDate('Y-M-D h:m:s')
            this.dialog.edit_subject_start_date = start_time.split(' ')[0]
            this.dialog.edit_subject_start_time = start_time.split(' ')[1]
            this.dialog.edit_subject_hint = subject['hint']
            this.dialog.edit_subject_image = subject['image']
            this.loadAttachments()
        },
        commitSubject() {
            if (this.dialog.is_new) {
                this.createSubject()
            } else {
                this.updateSubject()
            }
        },
        async loadAttachments() {
            const { data } = await api_competition_game_attachemnt_list(this.dialog.edit_subject_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['data'] != null) {
                    this.dialog.edit_subject_attachments = data['data']
                }
            }
        },
        async uploadAttchment(train_id, rid) {
            const { data } = await api_competition_game_attachemnt_upload(train_id, rid)
            if (data && data['res'] == 0) {
                this.loadAttachments()
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '网络错误')
            }
            this.dialog.tmp_attchement_rid = 0
        },
        hookUploadAttachment(rid) {
            this.uploadAttchment(this.dialog.edit_subject_id, rid)
        },
        async createSubject() {
            const { data } = await api_competition_game_subject_admin_create(
                this.dialog.edit_subject_image,
                this.dialog.edit_subject_comment,
                this.dialog.edit_subject_origin_score,
                this.dialog.edit_subject_ctf_flag,
                this.dialog.edit_subject_title,
                this.dialog.edit_subject_port_protocol,
                this.dialog.edit_subject_flag_type,
                this.dialog.edit_subject_flag_path,
                this.competition_id,
                this.subject_start_time,
                this.dialog.edit_subject_type,
                this.dialog.edit_subject_hint
            )
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    await openInfoMessageBox('成功', '提交成功')
                    this.dialog.open = false
                    this.load()
                }
            }
        },
        async updateSubject() {
            const { data } = await api_competition_game_subject_admin_update(this.competition_id, {
                id : this.dialog.edit_subject_id,
                title : this.dialog.edit_subject_title,
                origin_score : this.dialog.edit_subject_origin_score,
                type : this.dialog.edit_subject_type,
                port_protocol : this.dialog.edit_subject_port_protocol,
                flag_type : this.dialog.edit_subject_flag_type,
                flag_path : this.dialog.edit_subject_flag_path,
                comment : this.dialog.edit_subject_comment,
                resolved : this.dialog.edit_subject_resolved,
                is_dynamic : this.dialog.edit_subject_is_dynamic,
                start_time : this.subject_start_time,
                hint : this.dialog.edit_subject_hint,
                subject_type : this.dialog.edit_subject_type,
                image : this.dialog.edit_subject_image,
                ctf_flag : this.dialog.edit_subject_ctf_flag
            })
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    await openInfoMessageBox('成功', '提交成功')
                    this.dialog.open = false
                    this.load()
                }
            }
        },
        async deleteSubject(subject) {
            await openInfoMessageBox('提示', '确定要删除吗')
            const { data } = await api_competition_game_subject_admin_delete(this.competition_id, subject['id'])
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    await openInfoMessageBox('成功', '提交成功')
                    this.load()
                }
            }
        },
    },
    mounted() {
        const competition_id = parseInt(this.$route.params.competition_id);
        if (competition_id) {
            
            this.competition_id = competition_id;
            this.load();
        }
    }
}
</script>

<style>

</style>