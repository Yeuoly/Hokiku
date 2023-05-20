<template>
    <v-container full-height>
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title class="text-white">
                    {{ title }}统计信息
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-switch
                    v-model="showType"
                    flat
                    dark
                    label="Excel模式"
                ></v-switch>
            </v-toolbar>
            <div v-if="showType == 0">
                <v-flex>
                    <v-row>
                        <v-col 
                            v-for="(i, k) in pieData"
                            v-show="i.data.length != 0"
                            :key="k"
                            cols="6"
                        >
                            <pie-charts
                                v-if="i.data.length != 0"
                                :title="`单选统计 - ${i.title}`"
                                style="height: 300px"
                                :model="{ data : i.data }"
                            ></pie-charts>
                        </v-col>
                    </v-row>
                </v-flex>
                <v-divider></v-divider>
                <v-data-table
                    :headers="headers"
                    :loading="loading"
                    :items="statistics"
                    :items-per-page="9999"
                    :expanded.sync="expanded"
                    item-key="rid"
                    show-expand
                >
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                            small
                            @click="collectionCharts(item)"
                        >
                            mdi-chart-box-outline
                        </v-icon>
                    </template>
                    <template v-slot:item.time="{ item }">
                        {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length" class="py-2">
                            <v-flex>
                                <v-row>
                                    <v-col 
                                        cols="12"
                                        v-for="(i, k) in item['result']"
                                        :key="k"
                                    >
                                        <span> {{ k + 1 }}. {{ struct.struct[k]['title'] }} </span>
                                        <div v-if="struct.struct[k].type == 1 && struct.struct[k].data.multi">
                                            <v-chip v-for="s in i" :key="s">
                                                {{ struct.struct[k].data.options[s] }}
                                            </v-chip>
                                        </div>
                                        <div v-else-if="struct.struct[k].type == 1 && !struct.struct[k].data.multi">
                                            <v-chip>
                                                {{ struct.struct[k].data.options[i] }}
                                            </v-chip>
                                        </div>
                                        <div v-else-if="struct.struct[k].type == 5">
                                            {{ i }}
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-flex>
                        </td>
                    </template>
                </v-data-table>
            </div>
            <div v-else>
                <div class="px2 py2">
                    <v-btn small color="primary" @click="exportToExcel()">导出为Excel</v-btn>
                </div>
                <v-data-table
                    :headers="excel_headers"
                    :items="statistics"
                    :items-per-page="9999"
                    hide-default-footer
                    ref="table"
                >
                    <template v-slot:item="{ item }" class="sss">
                        <tr>
                            <td v-for="(i, k) in item['result']" :key="k">
                                <div v-if="struct.struct[k].type == 1 && struct.struct[k].data.multi">
                                    <span v-for="(i1, k1) in i" :key="k1">
                                        {{ struct.struct[k].data.options[i1] }}
                                    </span>
                                </div>
                                <div v-else-if="struct.struct[k].type == 1 && !struct.struct[k].data.multi">
                                    {{ struct.struct[k].data.options[i] }}
                                </div>
                                <div v-else>
                                    {{ i }}
                                </div>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
        </v-card>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_collection_statistics, api_get_collection } from '../../interface/api'
import { isHash } from '../../util'
import PieCharts from '../../components/charts/PieCharts.vue'

import XLSX from 'xlsx'

export default {
    components : { PieCharts },
    data : () => ({
        struct : { length : 0, struct : [] },
        statistics : [],
        options : {},
        headers : [{
            text : '提交时间',
            value : 'time'
        }, {
            text : 'rid',
            value : 'rid'
        }, {
            text : '提交人uid',
            value : 'owner'
        }],
        loading : false,
        title : '',
        expanded : [],
        pieData : [],
        showType : 0,
        excel_headers : []
    }),
    methods : {
        async getStatistics(){
            this.loading = true
            this.statistics = []
            const cid = this.$route.params.cid
            if(!isHash(cid, 32)){
                openErrorMessageBox('错误', '无效的id')
                this.loading = false
                return
            }
            let { data } = await api_get_collection(cid)
            if(!data){
                openErrorMessageBox('错误', '网络异常')
                this.loading = false
                return
            }
            if(data['res'] != 0){
                openErrorMessageBox('错误', data['err'])
                this.loading = false
                return
            }
            this.struct.length = data['data']['data']['length']
            this.struct.struct = data['data']['data']['struct']
            //拿到结构以后就初始化统计表
            for(const i in this.struct.struct){
                const pieStruct = {
                    title : this.struct.struct[i].title,
                    data : []
                }
                switch(this.struct.struct[i].type){
                case 1:
                    pieStruct.data = this.struct.struct[i].data.options.map(v => ({
                        name : v,
                        value : 0
                    }))
                    break
                }
                this.pieData.push(pieStruct)
                this.excel_headers.push({
                    text : this.struct.struct[i].title,
                    value : i
                })
            }
            this.title = data['data']['title']
            const response = await api_collection_statistics(cid)
            if(!response){
                openErrorMessageBox('错误', '网络异常')
                this.loading = false
                return
            }
            if(response.data.data == null){
                openErrorMessageBox('错误', '空')
                this.loading = false
                return
            }
            data = response.data
            if(data['res'] != 0){
                openErrorMessageBox('错误', data['err'])
                this.loading = false
                return
            }
            for(const i of data['data']){
                const struct = this.getMatchedStruct(i['result'])
                if(struct){
                    this.statistics.push({
                        owner : i['owner'],
                        result : struct,
                        rid : i['rid'],
                        time : i['time']
                    })
                    for(const j in struct){
                        switch(this.struct.struct[j].type){
                            case 1:
                                if(this.struct.struct[j].data.multi){
                                    for(const k of struct[j]){
                                        this.pieData[j].data[k].value++
                                    }
                                }else{
                                    this.pieData[j].data[struct[j]].value++
                                }
                                break
                        }
                    }
                }
            }
            this.loading = false
        },
        getMatchedStruct(result){
            try{
                const struct = JSON.parse(result)
                if(struct.length != this.struct.struct.length){
                    return false
                }
                for(const i in struct){
                    switch(this.struct.struct[i].type){
                        case 1:
                            if(this.struct.struct[i].data.multi && !(struct[i] instanceof Array)){
                                return false
                            }else if(!this.struct.struct[i].data.multi && typeof struct[i] != 'number'){
                                return false
                            }
                            break
                        case 5:
                            if(!(typeof struct[i] == 'string')){
                                return false
                            }
                            break
                    }
                }
                return struct
            }catch(e){
                return false
            }
        },
        exportToExcel(){
            const table = this.$refs.table.$el.children[0].children[0]
            let workbook = XLSX.utils.table_to_book(table)

            XLSX.writeFile(workbook, 'sheet.xlsx', {
                bookType : 'xlsx',
                bookSST : false,
                type : 'base64'
            })
        }
    },
    mounted(){
        this.getStatistics()
    }
}
</script>

<style scoped>
    .v-input__slot label{
        color: white !important;
    }
</style>