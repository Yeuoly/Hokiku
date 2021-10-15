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
            </v-data-table>
        </v-col>
        <v-col cols="12">
            <v-btn style="float: right" class="mr2" color="primary">加载更多</v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_collection_reuslt_list } from '../../interface/api'
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
        results : []
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
        toDetail(item){
            console.log(item)
        }
    },
    mounted(){
        this.getCommitsList()
    }
}
</script>

<style>

</style>