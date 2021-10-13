<template>
    <v-container full-height>
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title class="text-white">
                    {{ title }}统计信息
                </v-toolbar-title>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :loading="loading"
                :items="statistics"
                :items-per-page="9999"
                :expanded.sync="expanded"
                item-key="rid"
                class="elevation-1"
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
                    <td :colspan="headers.length">
                        <v-flex>
                            <v-row>
                                <v-col 
                                    cols="12"
                                    v-for="(i, k) in item['result']"
                                    :key="k"
                                >
                                    <div v-if="struct.struct[k].type == 1 && struct.struct[k].data.multi">
                                        <v-chip v-for="s in i.result" :key="s">
                                            {{ struct.struct[k].data.options[s] }}
                                        </v-chip>
                                    </div>
                                    <div v-else-if="struct.struct[k].type == 1 && !struct.struct[k].data.multi">
                                        <v-chip>
                                            {{ struct.struct[k].data.options[i] }}
                                        </v-chip>
                                    </div>
                                    <div v-else-if="struct.struct[k].type == 5">
                                        {{ i.result }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-flex>
                    </td>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_collection_statistics, api_get_collection } from '../../interface/api'
import { isHash } from '../../util'
export default {
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
        expanded : []
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
                            if(!(struct[i] instanceof String)){
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
    },
    mounted(){
        this.getStatistics()
    }
}
</script>

<style>

</style>