<template>
    <div class="py2 px2">
        <v-card flat>
            <v-card-title>
                {{ question.title }}
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col :cols="12">
                        作者：{{ question.author }} | 难度：
                        <v-chip v-if="question.difficulty == 1" color="grey" dark>有手就行</v-chip>
                        <v-chip v-if="question.difficulty == 2" color="green" dark>简单</v-chip>
                        <v-chip v-if="question.difficulty == 3" color="blue" dark>中等</v-chip>
                        <v-chip v-if="question.difficulty == 4" color="orange" dark>困难</v-chip>
                        <v-chip v-if="question.difficulty == 5" color="red" dark>逆天</v-chip>
                        | 分值：<v-chip color="green" dark>{{ question.score }}</v-chip>
                        | 类型：<v-chip color="blue" dark>{{ question.type }}</v-chip>
                    </v-col>
                    <v-col :cols="12">
                        支持语言：
                        <v-chip color="primary">
                            <v-icon v-if="question.language == 'c'">
                                mdi-language-c
                            </v-icon>
                            <v-icon v-if="question.language == 'c++'">
                                mdi-language-cpp
                            </v-icon>
                            <v-icon v-if="question.language == 'java'">
                                mdi-language-java
                            </v-icon>
                            <v-icon v-if="question.language == 'python2'">
                                mdi-language-python
                            </v-icon>
                            <v-icon v-if="question.language == 'python3'">
                                mdi-language-python
                            </v-icon>
                        </v-chip>
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                        <p></p>
                        <v-icon>mdi-memory</v-icon> 内存限制：{{ question.memory_limit / 1024 }} KB | <v-icon>mdi-timer</v-icon> 时间限制：{{ question.time_limit / 1000000 }} ms
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                        <p></p>
                        <v-icon>mdi-format-list-bulleted</v-icon> 题目描述
                    </v-col>
                    <v-col :cols="12" v-if="question.comment_type == 2">
                        <Markdown
                            :content="question.comment"
                        ></Markdown>
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                        <p></p>
                        <v-icon>    
                            mdi-format-list-bulleted
                        </v-icon> 样例输入输出
                    </v-col>
                    <v-col :cols="12" v-for="(i, k) in testcases" :key="k">
                        <v-row>
                            <v-col :cols="6">
                                <v-card flat>
                                    <v-card-title>
                                        <v-icon>mdi-arrow-right</v-icon> 样例输入 {{ k + 1 }}
                                    </v-card-title>
                                    <v-card-text>
                                        <div class="sample">{{ i.input }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col :cols="6">
                                <v-card flat>
                                    <v-card-title>
                                        <v-icon>mdi-arrow-left</v-icon> 样例输出 {{ k + 1 }}
                                    </v-card-title>
                                    <v-card-text>
                                        <div class="sample">{{ i.output }}</div>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                        <p></p>
                        <v-icon>    
                            mdi-code-json
                        </v-icon> 提交代码
                    </v-col>
                    <v-col :cols="12" sm="12" md="12" lg="6" xl="6">
                        <CodeEditor
                            v-model="code"
                            :language="language"
                        ></CodeEditor>
                    </v-col>
                    <v-col :cols="12" sm="12" md="12" lg="6" xl="6">
                        <div v-if="commits.length == 0">
                            <v-card flat>
                                <v-card-title>
                                    <v-icon>mdi-alert-circle</v-icon> 提示
                                </v-card-title>
                                <v-card-text>
                                    暂无提交记录
                                </v-card-text>
                            </v-card>
                        </div>
                        <div v-else>
                            <v-card flat>
                                <v-card-title>
                                    <v-icon>mdi-history</v-icon> 提交记录
                                </v-card-title>
                                <v-card-text>
                                    <v-simple-table>
                                        <thead>
                                            <tr>
                                                <th>测试ID</th>
                                                <th>提交时间</th>
                                                <th>提交结果</th>
                                                <th>通过率</th>
                                                <th>占用内存</th>
                                                <th>运行时间</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(i, k) in commits" :key="k">
                                                <td>
                                                    <v-chip color="primary" dark>{{ i.id }}</v-chip>
                                                </td>
                                                <td>
                                                    {{ new Date(i.time * 1000).toLocaleString() }}
                                                </td>
                                                <td>
                                                    <div v-if="i.status == 1">
                                                        <v-chip color="grey" dark>未测试</v-chip>
                                                    </div>
                                                    <div v-else-if="i.status == 2">
                                                        <v-progress-circular
                                                            :size="20"
                                                            :width="2"
                                                            indeterminate
                                                        ></v-progress-circular>
                                                    </div>
                                                    <div v-else-if="i.status == 3">
                                                        <div v-if="i.err == 0">
                                                            <v-chip color="green" v-if="i.pass == i.total_case" dark>通过</v-chip>
                                                            <v-chip color="red" v-else dark>未通过</v-chip>
                                                        </div>
                                                        <div v-else>
                                                            <v-chip v-if="i.err == 1" color="orange" dark>传输错误</v-chip>
                                                            <v-chip v-if="i.err == 2" color="orange" dark>编译/运行错误</v-chip>
                                                            <v-chip v-if="i.err == 3" color="orange" dark>编译/运行错误</v-chip>
                                                            <v-chip v-if="i.err == 4" color="orange" dark>超时</v-chip>
                                                            <v-chip v-if="i.err == 5" color="orange" dark>内存超限</v-chip>
                                                            <v-chip v-if="i.err == 6" color="orange" dark>未知</v-chip>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {{ i.pass }} / {{ i.total_case }}
                                                </td>
                                                <td>
                                                    {{ i.exe_mem / 1024}} KB
                                                </td>
                                                <td>
                                                    {{ i.exe_time / 1000000 }} ms
                                                </td>
                                                <td>
                                                    <v-btn
                                                        color="primary"
                                                        @click="showCommit(i.id)"
                                                    >
                                                        <v-icon>
                                                            mdi-eye
                                                        </v-icon>
                                                        查看
                                                    </v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-simple-table>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-col>
                    <v-col :cols="12">
                        <v-btn color="primary" @click="submit">
                            <v-icon>
                                mdi-send
                            </v-icon>
                            提交测试
                            </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog.show" max-width="800">
            <v-card>
                <v-card-title>
                    <v-icon>mdi-eye</v-icon> 提交测试
                </v-card-title>
                <v-card-text>
                    <CodeEditor
                        v-model="dialog.code"
                        :language="dialog.language"
                    ></CodeEditor>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Markdown from '../../../components/common/Markdown.vue'
import CodeEditor from '../../../components/common/CodeEditor.vue'
import { openErrorMessageBox } from '../../../concat/bus'

import {
    api_acm_user_question_detail,
    api_acm_user_testing_submit,
    api_acm_user_testing_submit_check,
} from '../../../interface/api'

export default {
    components : { Markdown, CodeEditor },
    data : () => ({
        current_question_id : 0,
        question : {
            title : '',
            comment_type : 0,
            comment : '',
            testcases : [],
            score : 0,
            difficulty : 0,
            type : 0,
            time_limit : 0,
            memory_limit : 0,
            author : '',
            language : ''
        },
        testcases : [],
        commits : [],
        code : '',
        dialog : {
            show : false,
            code : '',
            language : ''
        }
    }),
    computed : {
        language () {
            if (this.question.language == 'c') {
                return 'c_cpp'
            } else if (this.question.language == 'cpp') {
                return 'c_cpp'
            } else if (this.question.language == 'java') {
                return 'java'
            } else if (this.question.language == 'python2') {
                return 'python'
            } else if (this.question.language == 'python3') {
                return 'python'
            }
            return 'plain'
        }
    },
    methods : {
        showCommit (id) {
            const commit = this.commits.find(i => i.id == id)
            this.dialog.code = commit.code
            this.dialog.language = this.language
            this.dialog.show = true
        },
        async loadQuestion() {
            const { data } = await api_acm_user_question_detail(this.current_question_id)
            if (data && data['res'] == 0) {
                const question = data['data']['question']
                this.question.title = question['title']
                this.question.comment_type = question['comment_type']
                this.question.comment = question['comment']
                this.question.testcases = question['testcases']
                this.question.score = question['score']
                this.question.difficulty = question['difficulty']
                this.question.type = question['type']
                this.question.time_limit = question['time_limit']
                this.question.memory_limit = question['memory_limit']
                this.question.author = question['author']
                this.question.language = question['target_language']

                this.testcases = data['data']['testcases']
                this.commits = data['data']['testings']
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async submit() {
            const { data } = await api_acm_user_testing_submit(this.current_question_id, this.code, this.question.language)
            if (data && data['res'] == 0) {
                const response_id = data['data']['response_id']
                let check = false
                this.commits = [{
                    id : 0,
                    time : Math.floor(Date.now() / 1000),
                    status : 2,
                    pass : 0,
                    total_case : 0,
                    exe_mem : 0,
                    exe_time : 0,
                    err : 0
                }, ...this.commits]
                while(!check) {
                    const { data : check_data } = await api_acm_user_testing_submit_check(response_id)
                    if (check_data && check_data['res'] == 0) {
                        const _continue = check_data['data']['continue']
                        if (_continue) {
                            await new Promise(resolve => setTimeout(resolve, 1000))
                        } else {
                            check = true
                        }
                    } else {
                        openErrorMessageBox('错误', check_data ? check_data['err'] + '，若未引发关键错误，后台将继续测试' : '未知错误，若未引发关键错误，后台将继续测试')
                        check = true
                    }
                }
                this.loadQuestion()
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        }
    },
    mounted() {
        this.current_question_id = parseInt(this.$route.params.pid)
        if (!this.current_question_id) {
            this.$router.push('/acm/user/problem')
        }
        this.loadQuestion()
    }
}
</script>

<style>
    .sample {
        white-space: pre-wrap;
        word-wrap: break-word;
        /** 要很好看，灰色背景，稍微粗体一点 */
        background-color: #f5f5f5;
        font-weight: 500;
        padding: 8px;
        border-radius: 5px;
    }
</style>