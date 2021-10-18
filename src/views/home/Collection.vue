<template>
    <v-row>
        <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="results"
                hide-default-footer
            >
                <template v-slot:item.action="{ item }">
                    <v-btn small @click="toDetail(item)">
                        查看/修改
                    </v-btn>
                </template>
                <template v-slot:item.editable="{ item }">
                    <v-icon v-if="item.editable" color="green">
                        mdi-check
                    </v-icon>
                    <v-icon v-else color="red">
                        mdi-window-close
                    </v-icon>
                </template>
            </v-data-table>
        </v-col>
        <v-col cols="12">
            <v-btn style="float: right" class="mr2" color="primary">加载更多</v-btn>
        </v-col>
        <v-dialog v-model="dialog_open" width="700">
            <v-card v-if="dialog_open">
                <v-toolbar color="primary">
                    <v-toolbar-title class="text-white">
                        {{ dialog_item.title }}
                    </v-toolbar-title>
                </v-toolbar>
                <v-col 
                    cols="12" 
                    v-for="i, key in dialog_struct.data.struct"
                    :key="key"
                >
                    <v-card 
                        class="text-14 px4 pt4"
                        style="color: rgba(0,0,0,0.68)"
                        v-if="i.type == 1 && !i.data.multi">
                        单选：{{ i.title }}
                        <v-radio-group v-model="dialog_result[key]" row dense>
                            <v-radio
                                v-for="j, k in i.data.options"
                                :key="k"
                                :value="k"
                                :label="j"
                            ></v-radio>
                        </v-radio-group>
                    </v-card>
                    <v-card 
                        class="text-14 px4 pt4"
                        style="color: rgba(0,0,0,0.68)"
                        v-else-if="i.type == 1 && i.data.multi"
                    >
                        多选：{{ i.title }}
                        <v-checkbox
                            v-for="j1, k1 in i.data.options"
                            :key="k1"
                            :label="j1"
                            v-model="dialog_result[key]"
                            :value="k1"
                            dense
                        ></v-checkbox>
                    </v-card>
                    <v-card
                        class="text-14 px4 pt4"
                        style="color: rgba(0,0,0,0.68)"
                        v-else-if="i.type == 5"
                    >
                        <v-textarea
                            :label="i.title"
                            v-model="dialog_result[key]"
                        ></v-textarea>
                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-btn :disabled="!dialog_item.editable" @click="update" color="primary">更新</v-btn>
                </v-col>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_collection_result_get, api_collection_result_update, api_collection_reuslt_list } from '../../interface/api'
export default {
    data : () => ({
        headers : [{
            text : 'ID',
            value : 'rid'
        }, {
            text : '收集表标题',
            value : 'title'
        }, {
            text : '是否可修改',
            value : 'editable'
        }, {
            text : '查看',
            value : 'action'
        }],
        results : [],
        dialog_open : false,
        dialog_item : {},
        dialog_struct : [],
        dialog_result : []
    }),
    methods : {
        async getCommitsList(){
            const { data } = await api_collection_reuslt_list(1, 10)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.results = data['data']
                }
            }
        },
        async toDetail(item){
            this.dialog_item = item
            const { data } = await api_collection_result_get(item.cid, item.rid)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.dialog_struct = data['data']['struct']
                    this.dialog_result = JSON.parse(data['data']['result']['result'])
                }
            }
            this.dialog_open = true
        },
        async update(){
            const cid = this.dialog_item.cid
            const rid = this.dialog_item.rid
            const result = JSON.stringify(this.dialog_result)
            const { data } = await api_collection_result_update(cid, rid, result)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    await openInfoMessageBox('成功', '修改成功')
                    this.dialog_open = false
                }
            }
        }
    },
    mounted(){
        this.getCommitsList()
    }
}
</script>

<style>

</style>