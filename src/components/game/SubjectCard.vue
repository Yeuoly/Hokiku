<template>
    <div class="py1 clickable subject-card">
    <div class="subject-card-solved" v-if="resolved">
        <v-icon small color="green" size="20px">mdi-checkbox-marked-circle</v-icon>
    </div>
    <div class="subject-card-header text-center">
        已有{{ resolves }}人解决
    </div>
    <v-card shaped @click="openDialog" style="background-color: transparent;">
        <!-- title -->
        <v-card-text class="text-white text-center w100 text-20">
            {{ title }}
        </v-card-text>
        <!-- comment -->
        <v-card-text class="text-center text-25" style="color: rgb(145,221,255);font-weight: 800;">
            {{ origin_score }}
        </v-card-text>
        <v-card-text class="text-white text-center">
            {{ comment }}
        </v-card-text>
    </v-card>
    <v-dialog v-model="dialog.show" max-width="800">
        <v-card>
            <div class="py2 px2">
                <v-card-title>
                        {{ title }}
                </v-card-title>
                <v-card-text>
                    题目描述：{{ comment }}
                </v-card-text>
                <v-card-text>
                    <v-row>
                        <v-col :cols="3" v-for="(i, k) in attachments" :key="k">
                            <v-card color="green" dark :title="i.r_resource.extra" class="clickable" @click="downloadAttachment(i.r_resource.extra)">
                                <v-card-text>
                                    <!-- final 10 chars -->
                                    附件{{k + 1}}
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-text-field
                    class="px5"
                    label="flag"
                    v-model="flag"
                >
                    <template
                        v-slot:append
                    >
                        <v-btn @click="commit" color="primary" small>提交</v-btn>
                    </template>
                </v-text-field>
                <v-progress-linear
                    :active="status.launching"
                    indeterminate
                    color="cyan"
                ></v-progress-linear>
                <v-btn color="primary" @click="launch">启动靶机</v-btn>
                <v-btn color="error" @click="stop">关闭靶机</v-btn>
                <p></p>
                <v-divider></v-divider>
                <v-card-text>
                    靶机状态：{{ status.status ? '运行中' : '已关闭' }}
                    <div v-if="status.status">
                        靶机地址：{{ status.host_port }} <br>
                        靶机剩余时间：{{ status.remainder }}秒左右 <br>
                        当前靶机：{{ status.current_subject.title }}
                    </div>
                </v-card-text>
            </div>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { 
    api_competition_game_subject_status,
    api_competition_game_subject_launch,
    api_competition_game_subject_stop,
    api_competition_game_subject_request_result,
    api_competition_game_subject_commit_flag,
    api_competition_game_attachemnt_list
} from '../../interface/api'
import { sleep } from '../../util'

export default {
    props : {
        title : {
            type : String,
            default : ''
        },
        comment : {
            type : String,
            default : ''
        },
        resolved : {
            type : Boolean,
            default : false
        },
        resolves : {
            type : Number,
            default : 0
        },
        origin_score : {
            type : Number,
            default : 0
        },
        subject_id : {
            type : Number,
            default : 0
        },
        competition_id : {
            type : Number,
            default : 0
        },
    },
    data : () => ({
        dialog : {
            show : false,
            title : '',
            content : ''
        },
        status : {
            status : 0,
            host_port : '',
            remainder : 0,
            launching : false,
            timer : null,
            current_subject : {
                title : ''
            }
        },
        attachments : [],
        flag : ''
    }),
    methods : {
        async launch() {
            this.status.launching = true
            const { data } = await api_competition_game_subject_launch(this.competition_id, this.subject_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
                this.status.launching = false
            } else {
                const request_id = data['data']
                while(request_id) {
                    const { data : result } = await api_competition_game_subject_request_result(request_id)
                    if (result && result['data'] != '') {
                        if (result['data']['res'] != 1) {
                            openErrorMessageBox('错误', '该题无靶机')
                        } else if (result['data']['res'] == 1) {
                            this.loadStatus()
                        }
                        break
                    }
                    await sleep(1000)
                }
                this.status.launching = false
            }
        },
        async stop() {
            this.status.launching = true
            const { data } = await api_competition_game_subject_stop(this.competition_id, this.subject_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
                this.status.launching = false
            } else {
                const request_id = data['data']
                while(request_id) {
                    const { data : result } = await api_competition_game_subject_request_result(request_id)
                    if (result && result['data'] != '') {
                        if (result['data']['res'] != 1) {
                            openErrorMessageBox('错误', '关闭失败')
                        } else if (result['data']['res'] == 1) {
                            this.loadStatus()
                        }
                        break
                    }
                    await sleep(1000)
                }
                this.status.launching = false
            }
        },
        async loadStatus() {
            const { data } = await api_competition_game_subject_status()
            if(!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['data'] != null) {
                    this.status.status = true
                    this.status.host_port = data['data']['host_port']
                    this.status.remainder = data['data']['max_duration'] - data['data']['duration']
                    this.status.current_subject.title = data['data']['r_subject']['title']
                    if (this.status.timer) {
                        clearInterval(this.status.timer)
                    }
                    this.status.timer = setInterval(() => {
                        this.status.remainder--
                        if (this.status.remainder <= 0) {
                            this.status.status = false
                            clearInterval(this.status.timer)
                        }
                    }, 1000)
                } else {
                    this.status.status = false
                    this.status.host_port = ''
                    this.status.remainder = 0
                    this.status.current_subject.title = ''
                }
            }
        },
        async loadAttachments() {
            const { data } = await api_competition_game_attachemnt_list(this.subject_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                this.attachments = data['data']
            }
        },
        openDialog() {
            this.dialog.show = true
            this.loadStatus()
            this.loadAttachments()
        },
        async commit() {
            const { data } = await api_competition_game_subject_commit_flag(this.subject_id, this.flag)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    openInfoMessageBox('成功', 'flag正确')
                }
            }
        },
        downloadAttachment(url) {
            window.open(url)
        },
    }
}
</script>

<style>
.subject-card {
    color: white;
    position: relative;
    background-color: rgba(0,0,0,.2);
    height: 200px;
}

.subject-card-solved {
    position: absolute;
    width: 20px;
    height: 20px;
    z-index: 5;
    right: 5px;
    top: 5px;
}

</style>