<template>
    <div class="awd-checker">
        <v-container>
            <v-card>
                <v-card-title class="text-primary">
                    <h3>Checker管理</h3>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-row>
                        <v-col :cols="12">
                            <h3 class="text-primary">
                                Checker列表
                                <v-btn class="right" color="primary" @click="checker.dialog = true">新建Checker</v-btn>
                            </h3>
                        </v-col>
                        <v-col :cols="12">
                            <ul>
                                <li>这里展示的是该场AWD中所有的Checker</li>
                                <li>下列Checker默认为未运行状态，当竞赛题目启动时，Checker会跟随题目一起启动，除非Checker本身存在问题</li>
                            </ul>
                        </v-col>
                        <v-col :cols="12">
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">ID</th>
                                            <th class="text-left">题目ID</th>
                                            <th class="text-left">创建时间</th>
                                            <th class="text-left">命令</th>
                                            <th class="text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="checker in checkers" :key="checker.id">
                                            <td>{{ checker.id }}</td>
                                            <td>{{ checker.subject_id }}</td>
                                            <td>{{ 
                                                new Date(checker.time * 1000).toLocaleString()
                                            }}</td>
                                            <td>{{ checker.cmd }}</td>
                                            <td>
                                                <v-btn color="primary" @click="runChecker(checker)" small text>
                                                    <v-icon>
                                                        mdi-play
                                                    </v-icon>
                                                    运行
                                                </v-btn>
                                                <v-btn color="error" @click="deleteChecker(checker)" small text>
                                                    <v-icon>
                                                        mdi-delete
                                                    </v-icon>
                                                    删除
                                                </v-btn>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-col>
                        <v-col :cols="12">
                            <h3 class="text-primary">
                                当前运行中的Checker列表
                            </h3>
                        </v-col>
                        <v-col :cols="12">
                            <ul>
                                <li>以下是运行中的Checker</li>
                                <li>点击在测试环境运行，系统将会在测试环境中运行checker脚本检查服务状态</li>
                                <li>正式环境中的Checker默认会随机5~20分钟执行一次以检查选手服务状态，如果需要强制执行，请点击强制运行</li>
                            </ul>
                        </v-col>
                        <v-col :cols="12">
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">Checker ID</th>
                                            <th class="text-left">题目ID</th>
                                            <th class="text-left">题目名称</th>
                                            <th class="text-left">创建时间</th>
                                            <th class="text-left">状态</th>
                                            <th class="text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="checker in running_checkers" :key="checker.id">
                                            <td>{{ checker.checker_id }}</td>
                                            <td>{{ checker.subject_name }}</td>
                                            <td>{{ checker.subject_id }}</td>
                                            <td>{{ 
                                                new Date(checker.created_at * 1000).toLocaleString()
                                            }}</td>
                                            <td>{{ checker.status }}</td>
                                            <td>
                                                <v-btn color="primary" @click="runCheckerScript(checker)" small text>
                                                    <v-icon>
                                                        mdi-play
                                                    </v-icon>
                                                    在测试环境运行
                                                </v-btn>
                                                <v-btn color="primary" @click="fourceRunChecker(checker)" small text>
                                                    <v-icon>
                                                        mdi-play
                                                    </v-icon>
                                                    强制运行
                                                </v-btn>
                                                <v-btn color="red" dark @click="stopChecker(checker)" small text>
                                                    <v-icon>
                                                        mdi-stop
                                                    </v-icon>
                                                    停止
                                                </v-btn>
                                            </td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>
        <v-dialog
            v-model="checker.dialog"
            max-width="800px"
        >
            <v-card>
                <v-card-title>
                    <h3 class="text-primary">新建Checker</h3>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col :cols="12">
                            <ul>
                                <li>注意，Checker要求提供一个checker环境，这个环境可以由用户自己定义</li>
                                <li>您需要提供一个zip压缩包（context），其中包含构建一个checker的docker镜像所需要的全部文件</li>
                                <li>如果您没有准备好对应的镜像文件，也可以使用平台的在线工具创建context，这就需要您提前准备好了checker脚本，只需要在在线工具中简单替换文本即可</li>
                                <li>注意，dockerfile需要位于压缩文件的顶级目录中，并且镜像需要能够挂起在后台运行，然后提供执行命令用于运行checker</li>
                                <li>注意，如检查未修复漏洞，请脚本输出hack，如正常运行修复成功，请输出running，如服务异常，请输出down</li>
                                <li>context请不要大于8M</li>
                                <li>如仍不了解详细规则，可以进入平台在线编辑器查看示例</li>
                            </ul>
                        </v-col>
                        <v-col :cols="12">
                            <v-select
                                :items="subjects"
                                label="题目"
                                item-text="name"
                                item-value="id"
                                v-model="checker.subject_id"
                            ></v-select>
                        </v-col>
                        <v-col :cols="12">
                            <v-text-field
                                label="Checker命令"
                                placeholder="命令，如python3 checker.py $ip，端口号为正常服务端口号，如80,22，无需考虑映射，ip使用$ip代替"
                                v-model="checker.cmd"
                            ></v-text-field>
                        </v-col>
                        <v-col :cols="12">
                            <div class="left py3 text-14">
                                选择包含dockerfile的context（zip格式）
                            </div>
                            <UploadAttachment
                                class="left"
                                :size="32"
                                v-model="checker.checker_resource_id"
                            ></UploadAttachment>
                        </v-col>
                        <v-col :cols="12">
                            <v-btn color="primary" @click="createChecker">新建</v-btn>
                            <v-btn color="success" @click="toContextEditor">创建Context</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="checker.running_log_dialog"
            max-width="800px"
        >
            <v-card>
                <v-card-title>
                    <h3 class="text-primary">运行日志</h3>
                </v-card-title>
                <v-card-text>
                    <v-textarea
                        readonly
                        v-model="checker.running_log"
                        rows="10"
                    ></v-textarea>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import {
    api_awd_game_subject_checker_create,
    api_awd_game_subject_checker_list,
    api_awd_game_subject_checker_delete,
    api_awd_game_subject_check_test_run,
    api_awd_game_subject_check_test_stop,
    api_awd_game_subject_check_test_list,
    api_awd_game_subject_check_test_script
} from '../../interface/awd'
import {
    api_competition_awd_subject_list
} from '../../interface/api'

import UploadAttachment from '../../components/common/UploadAttachment.vue'

export default {
    components : {
        UploadAttachment
    },
    data : () => ({
        game_id : 0,
        checker : {
            dialog : false,
            subject_id : 0,
            checker_resource_id : 0,
            cmd : '',
            running_log : '',
            running_log_dialog : false,
        },
        checkers : [],
        running_checkers : [],
        subjects : [],
    }),
    methods : {
        async createChecker() {
            const { data } = await api_awd_game_subject_checker_create(this.checker.subject_id, this.checker.checker_resource_id, this.checker.cmd)
            if (data && data['res'] == 0) {
                this.checker.dialog = false
                this.getCheckers()
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async getCheckers() {
            const { data } = await api_awd_game_subject_checker_list(this.game_id)
            if (data && data['res'] == 0) {
                this.checkers = data['data']['list']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async getSubjects() {
            const { data } = await api_competition_awd_subject_list(this.game_id)
            if (data && data['res'] == 0) {
                this.subjects = data['data']['subject']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async deleteChecker(checker) {
            const { data } = await api_awd_game_subject_checker_delete(checker.id)
            if (data && data['res'] == 0) {
                this.getCheckers()
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        toContextEditor() {
            this.$router.push(`/awd/context`)
        },
        async getRunningCheckers() {
            const { data } = await api_awd_game_subject_check_test_list(this.game_id)
            if (data && data['res'] == 0) {
                this.running_checkers = data['data']['list']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async runChecker(checker) {
            this.checker.running_log = ''
            this.checker.running_log_dialog = true
            const { data } = await api_awd_game_subject_check_test_run(checker.id, message => {
                this.checker.running_log += message
            })
            if (data && data['res'] == 0) {
                this.getRunningCheckers()
                openSuccessSnackbar('运行成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async stopChecker(checker) {
            const { data } = await api_awd_game_subject_check_test_stop(checker.checker_id)
            if (data && data['res'] == 0) {
                this.getRunningCheckers()
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async runCheckerScript(checker) {
            const { data } = await api_awd_game_subject_check_test_script(checker.checker_id)
            if (data && data['res'] == 0) {
                this.getRunningCheckers()
                openSuccessSnackbar('运行成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async fourceRunChecker(checker) {
            console.log(checker)
        },
    },
    mounted() {
        const game_id = parseInt(this.$route.params.game_id)
        if (!game_id) {
            this.$router.back()
            return
        }

        this.game_id = game_id
        this.getCheckers()
        this.getSubjects()
        this.getRunningCheckers()
    }
}
</script>

<style>

</style>