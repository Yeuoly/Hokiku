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
                    <v-toolbar color="grey">
                        <v-toolbar-title>
                            <div style="text-align: center" class="text-20 text-white">
                                {{ i.title }} - {{ i.grade }}
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                    <div class="text-16 text-grey px5 pb5">
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
                <v-card-text v-if="tm_info.port">
                    端口：{{ tm_info.port }}
                </v-card-text>
                <v-progress-linear
                    :active="launching"
                    indeterminate
                    color="cyan"
                ></v-progress-linear>
                <v-btn @click="run">启动</v-btn>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_competition_train_start, api_competition_train_start_check } from '../../interface/api'
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
        tm_info : {
            port : 0
        }
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
        }
    },
    watch : {
        type : {
            handler(v){
                this.load(v, this.page)
            },
            immediate : true
        }
    }
}
</script>

<style>

</style>