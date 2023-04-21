<template>
    <div class="irina-train">
        <v-row class="px2 py2">
            <v-col :cols="12">
                <v-card>
                    <v-card-title>
                        <v-icon color="primary" class="px5">
                            mdi-book-open-variant
                        </v-icon>
                        训练题
                    </v-card-title>
                </v-card>
                <v-divider></v-divider>
            </v-col>
            <v-col
                v-for="(i, k) in trains"
                :key="k"
                cols="6"
                sm="6"
                md="6"
                lg="4"
                xl="3"
            >
                <v-card class="clickable train-card" height="250" @click="openDialog(k)">
                    <div class="train-card-solved" v-if="i.r_solved_time">
                        <v-icon small color="green" size="20px">mdi-checkbox-marked-circle</v-icon> {{ new Date(i.r_solved_time * 1000).formatDate('Y-M-D h:m:s') }}
                    </div>
                    <v-card-title>
                        <div style="text-align: center" class="text-20 w100">
                            {{ i.title }}
                        </div>
                        <div style="text-align: center" class="text-20 w100">
                            {{ i.grade }}
                        </div>
                    </v-card-title>
                    <div style="text-align: center" class="text-16 text-grey px5 pb5 w100">
                        {{ i.comment }}
                    </div>
                    <div>
                        <v-chip-group>
                            <v-chip
                                v-for="(j, l) in i.r_tags"
                                :key="l"
                                color="primary"
                                label
                                text-color="white"
                                class="ma-1"
                                small
                            >{{ j.name }}</v-chip>
                        </v-chip-group>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog
            v-model="dialog_open"
            width="500"
        >
            <v-tabs v-model="tab">
                <v-tab :key="1">
                    <v-icon>mdi-code-tags</v-icon>
                    <span>题目描述</span>
                </v-tab>
                <v-tab :key="2">
                    <v-icon>
                        mdi-file-document
                    </v-icon>
                    <span>WriteUp</span>
                </v-tab>
                <v-tab-item :key="1">
                    <v-card v-if="dialog_open" class="py2 px2">
                        <v-card-title>
                            {{ trains[current_index].title }}
                        </v-card-title>
                        <v-card-subtitle>
                            作者：{{ trains[current_index].author }}
                        </v-card-subtitle>
                        <v-card-text>
                            备注：{{ trains[current_index].comment }}
                        </v-card-text>
                        <v-card-text>
                            <v-row>
                                <v-col :cols="3" v-for="(i, k) in attachments" :key="k">
                                    <v-card color="green" dark :title="i" class="clickable" @click="downloadAttachment(i)">
                                        <v-card-text>
                                            <!-- final 10 chars -->
                                            附件{{k + 1}}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-btn color="primary" v-if="!opened" @click="openEnvironment()">
                            开启环境
                        </v-btn>
                        <v-text-field
                            class="px5"
                            label="flag"
                            v-model="flag"
                            v-if="opened"
                        >
                            <template
                                v-slot:append
                            >
                                <v-btn @click="commit" color="primary" small>提交</v-btn>
                            </template>
                        </v-text-field>
                        <v-divider class="pb2"></v-divider>
                        <v-card-text v-show="launching">
                            容器近期初次启动可能较慢
                        </v-card-text>
                        <v-card-text v-if="tm_info.host_port != ''">
                            地址：:{{ tm_info.host_port }}
                        </v-card-text>
                        <v-card-text v-if="tm_info.remainder != 0">
                            当前靶机剩余时间：{{ tm_info.remainder }}秒左右
                        </v-card-text>
                        <v-progress-linear
                            :active="launching"
                            indeterminate
                            color="cyan"
                        ></v-progress-linear>
                        <v-btn v-if="opened" @click="run" :disabled="tm_info.host_port != ''">启动</v-btn>
                        <v-btn v-if="opened" @click="shutdown" :disabled="tm_info.host_port == ''" type="error">关闭</v-btn>
                        <v-btn @click="toSolvedList">查看排行榜</v-btn>
                        <v-btn @click="toNote">编写笔记</v-btn>
                    </v-card>
                </v-tab-item>
                <v-tab-item :key="2" @click="loadWpList">
                    <v-card v-if="dialog_open" class="py2 px2">
                        <v-card-title>
                            {{ trains[current_index].title }} 的WP列表
                        </v-card-title>
                        <v-card-text>
                            <v-simple-table>
                                <thead>
                                    <tr>
                                        <th>标题</th>
                                        <th>作者</th>
                                        <th>提交时间</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, k) in wps" :key="k">
                                        <td>{{ i.r_username }}的WP</td>
                                        <td>{{ i.r_username }}</td>
                                        <td>{{ new Date(i.time).formatDate('Y-M-D h:m:s') }}</td>
                                        <td>
                                            <v-btn @click="openWp(i.id)">查看</v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </v-dialog>
        <v-dialog v-model="wp_dialog.open" max-width="600">
            <v-card class="px2 py2" v-if="wp_dialog.open">
                <v-card-title>
                    {{ trains[current_index].title }} 的 WriteUp
                </v-card-title>
                <v-card-text>
                    <InnerHTML :html="wp_dialog.content" />
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { 
    api_competition_train_commit_flag, 
    api_competition_train_shutdown, 
    api_competition_train_start, 
    api_competition_train_start_check, 
    api_competition_train_status,
    api_competition_train_tag_search,
    api_competition_train_title_search,
    api_competition_train_id_search,
    api_competition_train_wp_list,
    api_competition_train_wp_get,
} from '../../interface/api'
import {
    api_competition_train_attachement_request
} from '../../interface/train'
import {
    api_organization_train_list
} from '../../interface/organization'
import { sleep } from '../../util'
import InnerHTML from '../../components/common/InnerHTML.vue'

export default {
    components : { InnerHTML },
    data : () => ({
        trains : [],
        current_index : 0,
        dialog_open : false,
        launching : false,
        slow : false,
        tm_info : {
            host_port : '',
            remainder : 0
        },
        timer : 0,
        flag : '',
        tab : 0,
        wps : [],
        wp_dialog : {
            open : false,
            id : 0,
            content : '',
            type : 0
        },
        attachments : [],
        opened : false,
        gid : 0,
    }),
    methods : {
        async loadAttachments(train_id) {
            const { data } = await api_competition_train_attachement_request(train_id)
            if(data && data['res'] == 0) {
                if (data['data']['attachments']){
                    this.attachments = data['data']['attachments']
                } else {
                    this.attachments = []
                }
            }else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async openEnvironment() {
            this.opened = true
            this.loadAttachments(this.trains[this.current_index].id)
        },
        toSolvedList() {
            this.$router.push(`/competition/train/solved/${this.trains[this.current_index].id}`)
        },
        toNote() {
            this.$router.push(`/competition/train/note/${this.trains[this.current_index].id}`)
        },
        select(type){
            this.page = 1
            this.type = type + 1
        },
        openDialog(index){
            this.dialog_open = true
            this.current_index = index
            this.opened = false
            if (this.tab == 1) {
                this.loadWpList()
            }
        },
        openWp(id) {
            this.loadWp(id)
        },
        async shutdown(){
            const { data } = await api_competition_train_shutdown()
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '靶机已关闭')
                    this.tm_info.host_port = ''
                    this.tm_info.remainder = 0
                }
            }
        },
        async commit(){
            const flag = this.flag
            const id = this.trains[this.current_index].id
            const { data } = await api_competition_train_commit_flag(id, flag)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', 'flag正确')
                }
            }
        },
        async run(){
            const id = this.trains[this.current_index].id
            const { data } = await api_competition_train_start(id)
            this.launching = true
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    let finish = false
                    const request_id = data['data']
                    while(!finish){
                        await sleep(1000)
                        const { data } = await api_competition_train_start_check(request_id)
                        if(data && data['data'] != 0){
                            finish = true
                            this.tm_info.host_port = data['data']['host_port']
                            this.tm_info.remainder = 3600
                        }
                    }
                }
            }
            this.launching = false
        },
        async loadWpList() {
            const id = this.trains[this.current_index].id
            const { data } = await api_competition_train_wp_list(id)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.wps = data['data']
                }
            }
        },
        async load(){
            this.searching = false
            const { data } = await api_organization_train_list(this.gid)
            if(data && data['res'] == 0){
                this.trains = data['data']['list']
            }else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
        },
        async init(){
            const { data } = await api_competition_train_status()
            if(data && data['res'] == 0){
                this.tm_info.host_port = data['data']['host_port']
                this.tm_info.remainder = data['data']['remainder']
            }
        },
        async search(keyword, page, size) {
            if (keyword == '') {
                this.searching = false
                return
            }

            let search_engine = null
            if (this.search_method == '标签') {
                search_engine = api_competition_train_tag_search
            } else if (this.search_method == '标题') {
                search_engine = api_competition_train_title_search
            } else if (this.search_method == 'ID') {
                search_engine = api_competition_train_id_search
            }

            this.searching = true
            const { data } = await search_engine(keyword, page, size)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    this.trains = data['data']
                }
            }
        },
        async loadWp(id) {
            const { data } = await api_competition_train_wp_get(id)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.wp_dialog.open = true
                    this.wp_dialog.id = id
                    this.wp_dialog.content = data['data']['r_rich_content']['content']
                    this.wp_dialog.type = data['data']['r_rich_content']['type']
                }
            }
        },
        downloadAttachment(url) {
            window.open(url)
        },
    },
    watch : {
        tab : {
            handler(v){
                if (v == 1) {
                    this.loadWpList()
                }
            },
            immediate : true
        },
        dialog_open : {
            handler(v){
                if (!v) {
                    this.attachments = []
                }
            },
            immediate : true
        }
    },
    async mounted(){
        this.init()
        this.timer = setInterval(() => {
            if(this.tm_info.remainder > 0){
                this.tm_info.remainder--
            }
        }, 1000)

        this.gid = parseInt(this.$route.params.gid)
        if(!this.gid) {
            this.$router.back()
        }
        this.load()
    },
    destroyed(){
        clearInterval(this.timer)
    }
}
</script>

<style lang="scss">
    .train-card {
        position: relative;
        border: 1px solid rgb(235, 237, 243);
        border-radius: 8px !important;
        border-color: rgb(235, 237, 243) !important;
    }

    .train-card-solved {
        text-align: center;
        position: absolute;
        width: 70%;
        height: 29px;
        margin-left: 15%;
        top: -9px;
        color: lightgreen;
        font-weight: 300;
        z-index: 5;
        box-shadow: 0 10px 20px rgb(0 0 0 / 10%), 0 6px 6px rgb(0 0 0 / 0%);
        background-color: white;
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
        /* border: solid 1px rgba(0,0,0,0.2); */
        border-radius: 10px
    }

    .irina-train {
        .v-expansion-panel::before {
            box-shadow: none !important;
        }
    }
</style>