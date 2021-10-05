<template>
    <v-container fill-height>
        <v-flex>
            <v-row>
                <v-col cols="0" sm="0" md="2" lg="3" xl="4"></v-col>
                <v-col cols="12" sm="12" md="8" lg="6" xl="4">
                    <v-card>
                        <v-toolbar
                            dense
                            dark
                            color="primary"
                        >
                            <v-card-title>
                                {{ title }}
                            </v-card-title>
                        </v-toolbar>
                    </v-card>
                    <v-card-text 
                        class="text-10"
                        style="color: rgba(0,0,0,0.68)"
                    >
                        发布日期 : {{ new Date(time * 1000).formatDate('Y-h-D h:m:s') }} <br>
                        发布者 : {{ owner_id }}
                    </v-card-text>
                    <v-col 
                        cols="12" 
                        v-for="i, key in data.struct"
                        :key="key"
                    >
                        <v-card 
                            class="text-14 px4 pt4"
                            style="color: rgba(0,0,0,0.68)"
                            v-if="i.type == 1 && !i.multi">
                            单选：{{ i.title }}
                            <v-radio-group v-model="i.value" row dense>
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
                            v-else-if="i.type == 1 && i.multi">
                            多选：{{ i.title }}
                            <v-radio-group v-model="i.value" row dense>
                                <v-checkbox
                                    dense
                                    v-for="j1, k1 in i.data.options"
                                    v-model="i.value"
                                    :key="k1"
                                    :label="j1"
                                    :value="k1.toString()"
                                ></v-checkbox>
                            </v-radio-group>
                        </v-card>
                    </v-col>
                    <v-col cols="12">
                        <v-btn block color="primary"> 提交 </v-btn>
                    </v-col>
                </v-col>
                <v-col cols="0" sm="0" md="2" lg="3" xl="4"></v-col>
            </v-row>
        </v-flex>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../concat/bus'
import { api_get_collection } from '../interface/api'
import { isHash } from '../util/index'

export default {
    data : () => ({
        cid : 0,
        owner : 0,
        owner_id : '',
        title : '',
        type : 3,
        time : 0,
        data : {
            length : 0,
            struct : []
        }
    }),
    methods : {
        Load(info){
            this.data.struct.splice(0, 0)
            this.owner = info.owner
            this.title = info.title
            this.type = info.type
            this.data.length = info.data.length
            this.owner_id = info.owner_id
            this.time = info.time
            for(const i of info.data.struct){
                this.data.struct.push(i)
                switch(i.type){
                    case 1:
                        if(!i.multi){
                            i['value'] = 0
                        }else{
                            //???????
                            i['value'] = ['0', '1']
                        }
                }
            }
        },
        async Init(cid){
            const data = await api_get_collection(cid)
            if(!data){
                openErrorMessageBox('错误', '获取信息失败')
                return
            }
            const info = data.data
            if(info['res'] != 0){
                openErrorMessageBox('错误', data.err)
            }else{
                this.Load(info['data'])
            }
        }
    },
    mounted(){
        const cid = this.$route.params.cid
        if(!isHash(cid, 32)){
            openErrorMessageBox('错误', '无效的id')
            return
        }
        this.cid = cid
        this.Init(cid)
    }
}
</script>

<style>

</style>