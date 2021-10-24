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
                </v-card>
            </v-col>
        </v-row>
        <v-dialog
            v-model="dialog_open"
            width="500"
        >
            <v-card v-if="dialog_open">
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
                    当前开启端口：{{ tm_info.port }}
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
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_competition_train_commit_flag, api_competition_train_start, api_competition_train_start_check, api_competition_train_status } from '../../interface/api'
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
        flag : ''
    }),
    methods : {
        select(type){
            this.page = 1
            this.type = type + 1
        },
        openDialog(index){
            this.dialog_open = true
            this.current_index = index
        },
        async commit(){
            const flag = this.flag
            const id = this.trains[this.current_index].id
            const { data } = await api_competition_train_commit_flag(id, flag)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', 'flag错误')
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
        }
    },
    watch : {
        type : {
            handler(v){
                this.load(v, this.page)
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