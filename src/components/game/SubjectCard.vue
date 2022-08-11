<template>
    <div class="py1 clickable subject-card">
    <div class="subject-card-solved" v-if="resolved">
        <v-icon small color="green" size="20px">mdi-checkbox-marked-circle</v-icon>
    </div>
    <div class="subject-card-header text-center">
        已有{{ resolves }}人解决
    </div>
    <v-card shaped @click="openDialog">
        <!-- title -->
        <v-card-title>
            {{ title }}
        </v-card-title>
        <!-- comment -->
        <v-card-text>
            初始分值：{{ origin_score }}
        </v-card-text>
        <v-card-text>
            {{ comment }}
        </v-card-text>
    </v-card>
    <v-dialog v-model="dialog.show" max-width="800">
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title class="text-white">
                    {{ title }}
                </v-toolbar-title>
            </v-toolbar>
            <div class="py2 px2">
                <v-card-text>
                    {{ comment }}
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
                        靶机地址：iotshield.srmxy.cn:{{ status.port }} <br>
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
    api_competition_game_subject_commit_flag
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
            port : 0,
            remainder : 0,
            launching : false,
            timer : null,
            current_subject : {
                title : ''
            }
        },
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
                    this.status.port = data['data']['port']
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
                    this.status.port = 0
                    this.status.remainder = 0
                    this.status.current_subject.title = ''
                }
            }
        },
        openDialog() {
            this.dialog.show = true
            this.loadStatus()
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
        }
    }
}
</script>

<style>
.subject-card {
    position: relative;
}

.subject-card-solved {
    position: absolute;
    width: 20px;
    height: 20px;
    z-index: 5;
    right: 5px;
    top: 5px;
}

.subject-card-header {
    position: absolute;
    width: 70%;
    height: 29px;
    margin-left: 15%;
    top: -9px;
    color: #4CAF50;
    font-weight: 600;
    z-index: 5;
    box-shadow: 0 10px 20px rgb(0 0 0 / 10%), 0 6px 6px rgb(0 0 0 / 0%);
    background-color: white;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    /* border: solid 1px rgba(0,0,0,0.2); */
    border-radius: 10px
}
</style>