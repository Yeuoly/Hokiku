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
                            <v-icon v-if="question.language == 'cpp'">
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
                    </v-col>
                    <v-col :cols="12">
                        <v-btn color="primary">提交</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import Markdown from '../../../components/common/Markdown.vue'
import CodeEditor from '../../../components/common/CodeEditor.vue'
import { openErrorMessageBox } from '../../../concat/bus'

import {
    api_acm_user_question_detail
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
        code : ''
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