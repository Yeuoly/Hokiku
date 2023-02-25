<template>
    <div class="py2">
        <v-card flat>
            <v-card-title>
                {{ current_question_id == 0 ? '新建题目' : '编辑题目' }}
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                        <v-text-field
                            v-model="problem.title"
                            label="标题"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                        <v-text-field
                            v-model="problem.author"
                            label="作者"
                            required
                        >
                            <template v-slot:prepend>
                                <v-icon>mdi-account</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                        <v-text-field
                            v-model.number="problem.time_limit"
                            label="时间限制"
                            required
                        >
                            <template v-slot:append>
                                ns - {{ (problem.time_limit / 1000000).toFixed(2) }}ms
                            </template>
                            <template v-slot:prepend>
                                <v-icon>mdi-timer</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                        <v-text-field
                            v-model.number="problem.memory_limit"
                            label="内存限制"
                            required
                        >
                            <template v-slot:append>
                                bytes - {{ (problem.memory_limit / 1024).toFixed(2) }}KB
                            </template>
                            <template v-slot:prepend>
                                <v-icon>mdi-memory</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                        <v-text-field
                            v-model.number="problem.score"
                            label="分数"
                            required
                        >
                            <template v-slot:append>
                                <span>分</span>
                            </template>
                            <template v-slot:prepend>
                                <v-icon>mdi-star</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="4">
                        <v-text-field
                            v-model.number="problem.price"
                            label="价格"
                            required
                        >
                            <template v-slot:append>
                                <span>CNY</span>
                            </template>
                            <template v-slot:prepend>
                                <v-icon>mdi-bitcoin</v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                    难度：
                    <v-radio-group
                        row
                        v-model="problem.difficulty"
                    >
                        <v-radio
                            v-for="(i, k) in difficulty"
                            :key="k"
                            :label="difficulty[k]"
                            :value="k"
                        ></v-radio>
                    </v-radio-group>
                    </v-col>
                    <v-col cols="12">
                    分类：
                    <v-radio-group
                        row
                        v-model="problem.type"
                    >
                        <v-radio
                            v-for="(i, k) in problem_types"
                            :key="k"
                            :label="problem_types[k]"
                            :value="problem_types[k]"
                        ></v-radio>
                    </v-radio-group>
                    </v-col>
                    <v-col cols="12">
                    语言：
                    <v-radio-group
                        row
                        v-model="problem.language"
                    >
                        <v-radio
                            v-for="(i, k) in languages"
                            :key="k"
                            :label="languages[k]"
                            :value="languages[k]"
                        ></v-radio>
                    </v-radio-group>
                    </v-col>
                    <v-col :cols="12">
                        题目描述（markdown）：
                    </v-col>
                    <v-col :cols="12" :sm="12" :md="12" :lg="6" :xl="6">
                        <div class="px1">
                            <CodeEditor
                                :language="'markdown'"
                                v-model="problem.comment"
                            ></CodeEditor>
                        </div>
                    </v-col>
                    <v-col :cols="6" v-if="$vuetify.breakpoint.lgAndUp">
                        <Markdown
                            :content="problem.lazy_comment"
                        />
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col :cols="12">
                        测试集：
                        <v-btn @click="addTestcase" color="primary"> 添加 </v-btn>
                        <div v-if="problem.testcase.length > 0" class="px2 py2">
                            <v-tabs v-model="problem.current_testcase" 
                                grow
                                show-arrows
                            >
                                <v-tab
                                    v-for="(i, k) in problem.testcase"
                                    :key="k"
                                >
                                    测试{{ problem.testcase[k].id }}
                                    <v-icon v-if="problem.testcase[k].syncing" style="color: green">
                                        mdi-sync
                                    </v-icon>
                                    <v-icon v-else-if="problem.testcase[k].sync" style="color: green">
                                        mdi-check
                                    </v-icon>
                                    <v-icon v-else style="color: red">
                                        mdi-close
                                    </v-icon>
                                </v-tab>
                            </v-tabs>
                                <!-- 有换行 -->
                            <v-row>
                                <v-col :cols="6">
                                    <v-textarea
                                        v-model="problem.testcase[problem.current_testcase].input"
                                        label="输入"
                                        @input="tempUpdateTestcase"
                                    ></v-textarea>
                                </v-col>
                                <v-col :cols="6">
                                    <v-textarea
                                        v-model="problem.testcase[problem.current_testcase].output"
                                        label="输出"
                                        @input="tempUpdateTestcase"
                                    ></v-textarea>
                                </v-col>
                                <v-col :cols="12">
                                    <v-switch 
                                        v-model="problem.testcase[problem.current_testcase].public" 
                                        :label="'是否公开测试集' + (problem.testcase[problem.current_testcase].id)"
                                        @click="tempUpdateTestcase"
                                    ></v-switch>
                                    <v-btn color="error" @click="delTestcase(problem.testcase[problem.current_testcase].id)"> 删除 </v-btn>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-else class="px2 py2 w100 text-center">
                            暂无测试集
                        </div>
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col :cols="12">
                        题解（Writeup）：
                        <v-btn @click="addWriteup" color="primary"> 添加 </v-btn>
                    </v-col>
                    <v-col :cols="12" v-if="problem.writeup.length == 0">
                         <v-card flat>
                            <v-card-title>
                                <v-icon>mdi-alert-circle</v-icon> 提示
                            </v-card-title>
                            <v-card-text>
                                暂无题解
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col v-else :cols="12">
                        <v-row>
                            <v-col :cols="12">
                                <v-tabs
                                    v-model="problem.current_writeup"
                                    grow
                                    show-arrows
                                >
                                    <v-tab
                                        v-for="(i, k) in problem.writeup"
                                        :key="k"
                                    >
                                        题解{{ problem.writeup[k].id }}
                                        <v-icon v-if="problem.writeup[k].syncing" style="color: green">
                                            mdi-sync
                                        </v-icon>
                                        <v-icon v-else-if="problem.writeup[k].sync" style="color: green">
                                            mdi-check
                                        </v-icon>
                                        <v-icon v-else style="color: red">
                                            mdi-close
                                        </v-icon>
                                    </v-tab>
                                </v-tabs>
                            </v-col>
                            <v-col :cols="12">
                                <v-text-field 
                                    v-model.number="problem.writeup[problem.current_writeup].price" 
                                    label="价格"
                                    @input="tempUpdateWriteup"
                                >
                                    <template v-slot:append>
                                        CNY
                                    </template>
                                    <template v-slot:prepend>
                                        <v-icon>mdi-currency-usd</v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col :cols="12" :sm="12" :md="12" :lg="6" :xl="6">
                                <div class="px1">
                                    <CodeEditor
                                        :language="'markdown'"
                                        v-model="problem.writeup[problem.current_writeup].content"
                                        @input="tempUpdateWriteup"
                                    ></CodeEditor>
                                </div>
                            </v-col>
                            <v-col :cols="6" v-if="$vuetify.breakpoint.lgAndUp">
                                <Markdown
                                    :content="problem.writeup[problem.current_writeup].content"
                                />
                            </v-col>
                        </v-row>
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
import CodeEditor from '../../../components/common/CodeEditor.vue'
import Markdown from '../../../components/common/Markdown.vue'
import { openErrorMessageBox } from '../../../concat/bus'

import {
    api_acm_admin_question_create, api_acm_admin_question_edit, api_acm_admin_question_get,
    api_acm_admin_testcase_create, api_acm_admin_testcase_list, api_acm_admin_testcase_delete, api_acm_admin_testcase_edit,
    api_acm_admin_question_writeup_list, api_acm_admin_question_writeup_create, api_acm_admin_question_writeup_delete, api_acm_admin_question_writeup_edit,
} from '../../../interface/api'

export default {
    components : { CodeEditor, Markdown },
    data : () => ({
        current_question_id : 0,
        problem : {
            title : '',
            comment : '',
            comment_type : 2,
            time_limit : 100000000,
            memory_limit : 1024 * 1024 * 2,
            score : 500,
            difficulty : 1,
            type : 'default',
            author : '未知',
            price : 0,
            language : 'c',
            lazy_comment : '',
            testcase : [],
            writeup : [],
            current_testcase : 0,
            current_writeup : 0,
        },
        is_exam : false,
        exam_id : 0,
        message_bar : false,
        message_content : '',
        comment_types : ['default', 'html', 'markdown'],
        languages : ['c', 'c++', 'python2', 'python3'],
        difficulty : ['default', '有手就行', '简单', '中等', '难', '逆天'],
        problem_types : ['default', '字符串', '数学', '图论', '动态规划', '贪心', '数据结构', '搜索', '模拟', '其他'],
        update_timer : null,
        thirdpart_update_timer : null,
        global_update_mutex : false,
    }),
    watch : {
        'problem.comment' : function (val) {
            // lazy update, 1s, if there is alreay a timer, clear it
            if (this.update_timer) {
                clearTimeout(this.update_timer)
            }
            this.update_timer = setTimeout(() => {
                this.problem.lazy_comment = val
            }, 200)
        },
    },
    methods : {
        snackMessage(message) {
            this.message_content = message
            this.message_bar = true
        },
        tempUpdateTestcase() {
            this.problem.testcase[this.problem.current_testcase].sync = false
        },
        tempUpdateWriteup() {
            console.log('temp update')
            this.problem.writeup[this.problem.current_writeup].sync = false
        },
        async addWriteup() {
            //check if current question has been created
            if (this.current_question_id === 0) {
                await this.submit()
                if (this.current_question_id === 0) {
                    return
                }
                this.snackMessage('创建题目成功')
            }
            let { data } = await api_acm_admin_question_writeup_create(this.current_question_id, '## ' + this.problem.title + ' 题解', 0)
            if (data && data['res'] == 0){
                const writeup = data['data']['writeup']
                this.problem.writeup.push({
                    id : writeup['id'],
                    content : writeup['content'],
                    price : writeup['price'],
                })
                this.problem.current_writeup = this.problem.writeup.length - 1
                this.snackMessage('添加writeup成功')
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async delWriteup(writeup_id) {
            let { data } = await api_acm_admin_question_writeup_delete(writeup_id)
            if (data && data['res'] == 0){
                this.problem.writeup.splice(this.problem.current_writeup, 1)
                this.problem.current_writeup = 0
                this.snackMessage('删除writeup成功')
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async updateWriteup(writeup_id) {
            for (let i = 0; i < this.problem.writeup.length; i++) {
                if (this.problem.writeup[i].id == writeup_id) {
                    this.problem.writeup[i].syncing = true
                    let { data } = await api_acm_admin_question_writeup_edit(writeup_id, this.problem.writeup[i].content, this.problem.writeup[i].price)
                    if (data && data['res'] == 0){
                        this.problem.writeup[i].sync = true
                        this.snackMessage('更新writeup成功')
                    } else {
                        openErrorMessageBox('错误', data ? data['err'] : '未知错误')
                    }
                    this.problem.writeup[i].syncing = false
                    break
                }
            }
        },
        async addTestcase () {
            //check if current question has been created
            if (this.current_question_id === 0) {
                await this.submit()
                if (this.current_question_id === 0) {
                    return
                }
                this.snackMessage('创建题目成功')
            }
            // add testcase
            const { data } = await api_acm_admin_testcase_create(this.current_question_id, '1', '1', 0)
            if (data && data['res'] === 0) {
                this.problem.testcase.push({
                    id : data['data']['testcase_id'],
                    input : '1',
                    output : '1',
                    public : false,
                    sync : true,
                    syncing : false
                })
                this.problem.current_testcase = this.problem.testcase.length - 1
                this.snackMessage('添加测试集成功')
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async delTestcase(testcase_id) {
            const { data } = await api_acm_admin_testcase_delete(testcase_id)
            if (data && data['res'] === 0) {
                this.problem.testcase.splice(this.problem.current_testcase, 1)
                this.problem.current_testcase = 0
                this.snackMessage('删除测试集成功')
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async submit() {
            //check if current question has been created
            if (this.current_question_id === 0) {
                await this.createQuestion()
            } else {
                await this.updateQuestion()
            }
        },
        async createQuestion() {
            const { data } = await api_acm_admin_question_create(
                this.problem.title,
                this.problem.comment_type,
                this.problem.comment,
                this.problem.score,
                this.problem.author,
                this.problem.price,
                this.problem.difficulty,
                this.problem.language,
                this.problem.time_limit,
                this.problem.memory_limit,
                this.problem.type,
                this.exam_id
            )
            if (!data || data['res'] != 0) {
                openErrorMessageBox('错误', data ? data['err'] + '，请确保题目参数（非测试集）如标题等不为空' : '未知错误')
                return
            }
            this.current_question_id = data['data']['question_id']
            this.$router.push({ params : { pid : this.current_question_id } })
        },
        async updateQuestion() {
            this.global_update_mutex = true
            const { data } = await api_acm_admin_question_edit(
                this.current_question_id,
                this.problem.title,
                this.problem.comment_type,
                this.problem.comment,
                this.problem.author,
                this.problem.price,
                this.problem.difficulty,
                this.problem.language,
                this.problem.time_limit,
                this.problem.memory_limit,
                this.problem.type,
            )
            if (!data || data['res'] != 0) {
                openErrorMessageBox('错误', data ? data['err'] + '，请确保题目参数（非测试集）如标题等不为空' : '未知错误')
                return
            }
            // update testcase
            for (let i = 0; i < this.problem.testcase.length; i++) {
                if (!this.problem.testcase[i].sync && this.problem.testcase[i].input != '' && this.problem.testcase[i].output != '') {
                    this.problem.testcase[i].syncing = true
                    const { data } = await api_acm_admin_testcase_edit(
                        this.problem.testcase[i].id,
                        this.problem.testcase[i].input,
                        this.problem.testcase[i].output,
                        this.problem.testcase[i].public ? 1 : 0
                    )
                    this.problem.testcase[i].syncing = false
                    if (!data || data['res'] != 0) {
                        openErrorMessageBox('错误', data ? data['err'] + '，请确保测试集参数如输入输出等不为空' : '未知错误')
                        return
                    }
                    this.problem.testcase[i].sync = true
                }
            }
            this.global_update_mutex = false
            this.snackMessage('更新题目成功')
        },
        async loadQuestion() {
            const { data } = await api_acm_admin_question_get(this.current_question_id)
            if (!data || data['res'] != 0) {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
                return
            }
            const question = data['data']['question']
            this.problem.title = question['title']
            this.problem.comment = question['comment']
            this.problem.comment_type = question['comment_type']
            this.problem.time_limit = question['time_limit']
            this.problem.memory_limit = question['memory_limit']
            this.problem.score = question['score']
            this.problem.difficulty = question['difficulty']
            this.problem.type = question['type']
            this.problem.author = question['author']
            this.problem.price = question['price']
            this.problem.language = question['target_language']

            const { data : testcase_data } = await api_acm_admin_testcase_list(this.current_question_id)
            if (!testcase_data || testcase_data['res'] != 0) {
                openErrorMessageBox('错误', testcase_data ? testcase_data['err'] : '未知错误')
                return
            }
            if (testcase_data['data']['testcases']) {
                this.problem.testcase = testcase_data['data']['testcases'].map(v => {
                    return {
                        id : v['id'],
                        input : v['input'],
                        output : v['output'],
                        public : (v['flag'] & 2) !== 2,
                        sync : true,
                        syncing : false,
                    }
                })
            }

            const { data : writeup_data } = await api_acm_admin_question_writeup_list(this.current_question_id)
            if (!writeup_data || writeup_data['res'] != 0) {
                openErrorMessageBox('错误', writeup_data ? writeup_data['err'] : '未知错误')
                return
            }
            if (writeup_data['data']['writeups']) {
                this.problem.writeup = writeup_data['data']['writeups'].map(v => {
                    return {
                        id : v['id'],
                        content : v['content'],
                        price : v['price'],
                        sync : true
                    }
                })
            }
        },
    },
    mounted() {
        //get current question id
        const pid = this.$route.params.pid
        // check if @ is in pid
        if (pid.indexOf('@') !== -1) {
            this.current_question_id = parseInt(pid.split('@')[0])
            this.exam_id = parseInt(pid.split('@')[1])
            this.is_exam = true
        } else {
            this.current_question_id = parseInt(pid)
        }
        this.current_question_id = parseInt(this.$route.params.pid)
        //test current question id is valid
        if (isNaN(this.current_question_id)) {
            this.current_question_id = 0
        }
        if (this.current_question_id !== 0) {
            this.loadQuestion()
        }

        this.thirdpart_update_timer = setInterval(async () => {
            //walk through all testcase
            if (this.global_update_mutex) {
                return
            }
            for (let i = 0; i < this.problem.testcase.length; i++) {
                if (!this.problem.testcase[i].sync && this.problem.testcase[i].input != '' && this.problem.testcase[i].output != '') {
                    //update testcase
                    this.problem.testcase[i].syncing = true
                    const { data } = await api_acm_admin_testcase_edit(
                        this.problem.testcase[i].id,
                        this.problem.testcase[i].input,
                        this.problem.testcase[i].output,
                        this.problem.testcase[i].public ? 1 : 0
                    )
                    this.problem.testcase[i].syncing = false
                    if (!data || data['res'] != 0) {
                        openErrorMessageBox('错误', data ? data['err'] + '，请确保测试集参数如输入输出等不为空' : '未知错误')
                        return
                    }
                    this.problem.testcase[i].sync = true
                }
            }
            //walk through all writeup
            for (let i = 0; i < this.problem.writeup.length; i++) {
                if (!this.problem.writeup[i].sync && this.problem.writeup[i].content != '') {
                    //update writeup
                    this.updateWriteup(this.problem.writeup[i].id)
                }
            }
        }, 2000)
    }
}
</script>

<style>

</style>