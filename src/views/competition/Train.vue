<template>
    <div class="irina-train">
        <v-tabs
            background-color="primary accent-4"
            center-active
            dark
            @change="select"
        >
            <v-tab
                v-for="(i, k) in tabs"
                :key="k"
            >{{ i.label }}</v-tab>
        </v-tabs>
        <v-row class="px2 py2">
            <v-col cols="12">
                <div class="px2">
                    <v-expansion-panels accordion>
                        <v-expansion-panel>
                            <v-expansion-panel-header>搜索</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col>
                                        <v-select
                                            :items="search_methods"
                                            v-model="search_method"
                                            label="按……搜索"
                                            dense
                                            outlined
                                        ></v-select>
                                    </v-col>
                                    <v-col>
                                        <v-text-field
                                            label="搜索内容"
                                            v-model="keyword"
                                            dense
                                            outlined
                                            @keypress.enter="startSearch"
                                        >
                                            <template slot="append">
                                                <v-btn
                                                    small
                                                    color="primary"
                                                    dark
                                                    @click="startSearch"
                                                >
                                                搜索
                                                </v-btn>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    <v-divider></v-divider>
                </div>
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
            <div class="text-center mt2">
                <v-pagination
                    v-model="page"
                    :length="999"
                    :total-visible="5"
                ></v-pagination>
            </div>
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
                        <v-btn @click="run" :disabled="tm_info.host_port != ''">启动</v-btn>
                        <v-btn @click="shutdown" :disabled="tm_info.host_port == ''" type="error">关闭</v-btn>
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
    api_competition_train_attachemnt_list
} from '../../interface/api'
import { loadCompetitions } from '../../store/index'
import { sleep } from '../../util'
import InnerHTML from '../../components/common/InnerHTML.vue'

export default {
    components : { InnerHTML },
    data : () => ({
        tabs : [{
            label : 'Web',
            value : 1
        }, {
            label : 'Pwn',
            value : 2
        }, {
            label : 'Misc',
            value : 3
        }, {
            label : 'Reverse',
            value : 4
        }, {
            label : 'Crypto',
            value : 5
        }, {
            label : 'Mobile',
            value : 6
        }, ],
        type : 1,
        page : 1,
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
        keyword : '',
        search_method : '标签',
        search_methods : ['标签','ID','标题'],
        searching : false,
        tab : 0,
        wps : [],
        wp_dialog : {
            open : false,
            id : 0,
            content : '',
            type : 0
        },
        attachments : []
    }),
    methods : {
        async loadAttachments(train_id) {
            const { data } = await api_competition_train_attachemnt_list(train_id)
            if(data && data['res'] == 0) {
                if (data['data'] != null ){
                    this.attachments = data['data']
                } else {
                    this.attachments = []
                }
            }else {
                openErrorMessageBox('错误', data ? data['err'] : '未知错误')
            }
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
            if (this.tab == 1) {
                this.loadWpList()
            } else {
                this.loadAttachments(this.trains[index].id)
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
        async load(type, page){
            this.searching = false
            const data = await loadCompetitions(type, page)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else if(typeof data == 'string'){
                openErrorMessageBox('错误', data)
            }else{
                this.trains = data['data']
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
        startSearch() {
            this.searching = true
            this.search(this.keyword, this.page, 32)
        }
    },
    watch : {
        type : {
            handler(v){
                if (!this.$route.query.id) {
                    this.load(v, this.page)
                }
            },
            immediate : true
        },
        page : {
            handler(v){
                if (this.searching) {
                    this.search(this.keyword, v, 32)
                } else {
                    this.load(this.type, v)
                }
            },
            immediate : true
        },
        tab : {
            handler(v){
                if (v == 1) {
                    this.loadWpList()
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

        if (this.$route.query.id) {
            this.search_method = 'ID'
            this.keyword = this.$route.query.id
            await this.search(this.keyword, this.page, 1)
            this.$router.push({
                query : {}
            })
        }
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