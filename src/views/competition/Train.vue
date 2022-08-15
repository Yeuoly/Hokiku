<template>
    <div>
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
                md="4"
                lg="4"
                xl="3"
            >
                <v-card class="clickable" height="250" @click="openDialog(k)">
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
                <v-card-text v-if="tm_info.port != 0">
                    地址：iotshield.srmxy.cn:{{ tm_info.port }}
                </v-card-text>
                <v-card-text v-if="tm_info.remainder != 0">
                    当前靶机剩余时间：{{ tm_info.remainder }}秒左右
                </v-card-text>
                <v-progress-linear
                    :active="launching"
                    indeterminate
                    color="cyan"
                ></v-progress-linear>
                <v-btn @click="run" :disabled="tm_info.port != 0">启动</v-btn>
                <v-btn @click="shutdown" :disabled="tm_info.port == 0" type="error">关闭</v-btn>
                <v-btn @click="toSolvedList">查看排行榜</v-btn>
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
    api_competition_train_tag_search
} from '../../interface/api'
import { loadCompetitions } from '../../store/index'
import { sleep } from '../../util'
export default {
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
            port : 0,
            remainder : 0
        },
        timer : 0,
        flag : '',
        keyword : '',
        search_method : '标签',
        search_methods : ['标签'],
        searching : false
    }),
    methods : {
        toSolvedList() {
            this.$router.push(`/competition/train/solved/${this.trains[this.current_index].id}`)
        },
        select(type){
            this.page = 1
            this.type = type + 1
        },
        openDialog(index){
            this.dialog_open = true
            this.current_index = index
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
                    this.tm_info.port = 0
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
                            this.tm_info.port = data['data']['port']
                            this.tm_info.remainder = 3600
                        }
                    }
                }
            }
            this.launching = false
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
                this.tm_info.port = data['data']['port']
                this.tm_info.remainder = data['data']['remainder']
            }
        },
        async search(keyword, page, size) {
            if (keyword == '') {
                this.searching = false
                return
            }
            this.searching = true
            const { data } = await api_competition_train_tag_search(keyword, page, size)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.trains = data['data']
                }
            }
        },
        startSearch() {
            this.searching = true
            this.search(this.keyword, this.page, 32)
        }
    },
    watch : {
        type : {
            handler(v){
                this.load(v, this.page)
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
        }
    },
    mounted(){
        this.init()
        this.timer = setInterval(() => {
            if(this.tm_info.remainder > 0){
                this.tm_info.remainder--
            }
        }, 1000)
    },
    destroyed(){
        clearInterval(this.timer)
    }
}
</script>

<style>

</style>