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
                                创建统计表
                            </v-card-title>
                        </v-toolbar>
                        <v-col cols="12">
                            <v-text-field
                                dense
                                label="收集表标题"
                                v-model="title"
                            ></v-text-field>
                        </v-col>
                        <v-col 
                            cols="12" 
                            v-for="i, key in struct"
                            :key="key"
                        >
                            <v-card-text class="text-grey">
                                表项{{ key + 1 }}
                            </v-card-text>
                            <v-select
                                dense
                                :items="type_table.l"
                                @input="onSelectType(i, $event)"
                            >
                            </v-select>
                            <v-card 
                                class="text-14 px4 pt5"
                                style="color: rgba(0,0,0,0.68)"
                                v-if="i.type == 1 && !i.multi"
                            >
                                
                                <v-text-field
                                    dense
                                    class="text-white pt-5"
                                    :label="(i.data.multi ? '多选' : '单选') + '标题'"
                                    v-model="i.title"
                                >
                                    <template v-slot:append-outer>
                                        <v-btn small @click="i.data.multi = !i.data.multi"> {{ i.data.multi ? '多选' : '单选' }} </v-btn>
                                    </template>
                                </v-text-field>
                                <v-text-field
                                    v-for="j, k in i.data.options"
                                    :key="k"
                                    v-model="i.data.options[k]"
                                    :label="j"
                                >
                                    <template v-slot:append-outer>
                                        <v-btn 
                                            small 
                                            icon
                                            fab
                                            dark
                                            color="error" 
                                            @click="radioDeleteOption(i, k)"
                                        >
                                            <v-icon>mdi-minus</v-icon>
                                        </v-btn>
                                    </template>
                                </v-text-field>
                                <v-btn small icon fab color="green" title="添加选项" @click="radioAddOption(i)">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-card>
                            <v-card 
                                class="text-14 px4 pt4"
                                style="color: rgba(0,0,0,0.68)"
                                v-else-if="i.type == 1 && i.multi"
                            >
                                多选：{{ i.title }}
                                <v-radio-group v-model="i.value" row dense>
                                    <v-checkbox
                                        dense
                                        v-for="j1, k1 in i.data.options"
                                        v-model="i.value"
                                        :key="k1"
                                        :label="j1"
                                        :value="k1"
                                    ></v-checkbox>
                                </v-radio-group>
                            </v-card>
                            <v-card
                                class="text-14 px4 pt4"
                                style="color: rgba(0,0,0,0.68)"
                                v-else-if="i.type == 5"
                            >
                                <v-text-field 
                                    label="文本框标题"
                                    dense
                                    v-model="i.title"
                                ></v-text-field>
                                <v-textarea
                                    :label="i.title"
                                    v-model="i.data.default"
                                ></v-textarea>
                            </v-card>
                        </v-col>
                        <v-col cols="12">
                            <v-btn block color="green" class="mb-5 text-white" @click="addOptions"> 添加收集项 </v-btn>
                            <v-btn block color="primary" @click="publish"> 创建并发布 </v-btn>
                        </v-col>
                    </v-card>
                </v-col>
                <v-col cols="0" sm="0" md="2" lg="3" xl="4"></v-col>
            </v-row>
        </v-flex>
    </v-container>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_publish_collection } from '../../interface/api'
export default {
    data : () => ({
        type_table : {
            v : [1, /*2, */5],
            l : ['文本选择框', /*'图片选择框', */'文本框']
        },
        struct : [{
            type : 1,
            title : '单选',
            data : {
                count : '2',
                options : ['选项一', '选项二'],
                multi : false
            }
        }],
        title : ''
    }),
    methods : {
        addOptions(){
            this.struct.push({
                type : 1,
                title : '单选',
                data : {
                    count : '2',
                    options : ['选项一', '选项二'],
                    multi : false
                }
            })
        },
        radioAddOption(node){
            if(node.data.options.length < 20){
                node.data.options.push(`选项${node.data.options.length}`)
            }
        },
        radioDeleteOption(node, index){
            if(node.data.options.length >= 3){
                node.data.options.splice(index, 1)
            }
        },
        onSelectType(node, type){
            const type_num = this.type_table.v[this.type_table.l.indexOf(type)]
            if(node.type == type_num){
                return
            }
            switch(type){
                case '文本选择框':
                    node.data = {
                        count : '2',
                        options : ['选项一', '选项二'],
                        multi : false
                    }
                    node.title = '单选'
                    break
                case '图片选择框':
                    break
                case '文本框':
                    node.data = {
                        default : '这是默认文本'
                    }
                    node.title = '文本框'
                    break
            }
            node.type = type_num
        },
        async publish(){
            const struct = JSON.stringify({
                length : this.struct.length,
                struct : this.struct
            })
            const title = this.title
            const { data } = await api_publish_collection(struct, title)
            if(!data){
                openErrorMessageBox('错误', '网络连接出现问题')
            }
            if(data['res'] != 0){
                openErrorMessageBox('错误', data['err'])
            }else{
                await openInfoMessageBox('成功', '创建成功，点击确定跳转')
                this.$router.push(`/coll/info/${data['data']}`)
            }
        }
    }
}
</script>

<style>

</style>