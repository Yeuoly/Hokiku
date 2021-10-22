<template>
    <v-row>
        <v-col cols="12">
            <v-btn class="ml2" @click="openAddDialog" color="primary">新建</v-btn>
        </v-col>
        <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="trains"
                hide-default-footer
            >
                <template v-slot:item.type="{ item }">
                    {{ getTypeById(item.type) }}
                </template>
                <template v-slot:item.action="{ item }">
                    <v-btn small @click="openEditDialog(item)">编辑</v-btn>
                    <v-btn small color="error" @click="deleteTrain(item)">删除</v-btn>
                </template> 
            </v-data-table>
        </v-col>
        <v-dialog v-model="new_train.open" width="800">
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title class="text-white">
                        添加训练题
                    </v-toolbar-title>
                </v-toolbar>
                <div class="px5 py2">
                    <v-text-field
                        label="标题"
                        v-model="new_train.title"
                    ></v-text-field>
                    <v-text-field
                        label="作者"
                        v-model="new_train.author"
                    ></v-text-field>
                    <v-text-field
                        label="镜像"
                        v-model="new_train.image"
                    ></v-text-field>
                    <v-text-field
                        label="备注"
                        v-model="new_train.comment"
                    ></v-text-field>
                    <v-text-field
                        label="默认flag"
                        v-model="new_train.ctf_flag"
                    ></v-text-field>
                    <v-text-field
                        label="端口映射"
                        v-model="new_train.port_protocol"
                    ></v-text-field>
                    <v-switch
                        label="动态flag"
                        v-model="new_train.dynamic_flag"
                    ></v-switch>
                    <v-radio-group
                        row
                        v-model="new_train.type"
                    >
                        <v-radio
                            v-for="(i, k) in types"
                            :key="k"
                            :label="types[k]"
                            :value="k"
                        ></v-radio>
                    </v-radio-group>
                    <v-btn color="primary" @click="commit">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_competition_train_add, api_competition_train_delete, api_competition_train_list, api_competition_train_update } from '../../interface/api'
import { isFlagDynamic } from '../../util'
export default {
    data : () => ({
        headers : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '标题',
            value : 'title'
        }, {
            text : '作者',
            value : 'author'
        }, {
            text : '分值',
            value : 'grade'
        }, {
            text : '完成人数',
            value : 'resolved'
        }, {
            text : '类型',
            value : 'type'
        }, {
            text : '开放端口与协议',
            value : 'port_protocol'
        }, {
            text : '操作',
            value : 'action'
        }],
        trains : [],
        types : ['DEFAULT', 'WEB', 'PWN', 'MISC', 'REVERSE', 'CRYPTO', 'MOBILE'],
        new_train : {
            open : false,
            title : '',
            author : '',
            image : '',
            comment : '',
            ctf_flag : '',
            port_protocol : '',
            dynamic_flag : false,
            type : 0,
            isNew : true
        },
    }),
    methods : {
        async load(){
            const { data } = await api_competition_train_list(0)
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
        async openEditDialog(item){
            this.new_train.isNew = false
            this.new_train.title = item.title
            this.new_train.author = item.author
            this.new_train.image = item.image
            this.new_train.comment = item.comment
            this.new_train.ctf_flag = item.ctf_flag
            this.new_train.type = item.type
            this.new_train.port_protocol = item.port_protocol
            this.new_train.dynamic_flag = isFlagDynamic(item.flag)
            this.new_train.open = true
        },
        async deleteTrain(item){
            const result = await openInfoMessageBox('提示', '您确定要删除吗')
            if(result){
                const id = item.id
                const { data } = await api_competition_train_delete(id)
                if(!data){
                    openErrorMessageBox('错误', '网络错误')
                }else{
                    if(data['res'] != 0){
                        openErrorMessageBox('错误', data['err'])
                    }else{
                        openInfoMessageBox('成功', '删除成功')
                    }
                }
            }
        },
        async commit(){
            let api
            if(this.new_train.isNew){
                api = api_competition_train_add
            }else{
                api = api_competition_train_update
            }
            const { data } = await api({
                title : this.new_train.title,
                author : this.new_train.author,
                image : this.new_train.image,
                comment : this.new_train.comment,
                ctf_flag : this.new_train.ctf_flag,
                flag_dynamic : this.new_train.dynamic_flag,
                port_protocol : this.port_protocol,
                type : this.new_train.type
            })
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '成功')
                    this.new_train.open = false
                }
            }
        },
        openAddDialog(){
            this.new_train.isNew = true
            this.new_train.title = ''
            this.new_train.author = ''
            this.new_train.image = ''
            this.new_train.comment = ''
            this.new_train.ctf_flag = ''
            this.new_train.port_protocol = ''
            this.new_train.type = 0
            this.new_train.dynamic_flag = false
            this.new_train.open = true
        },
        getTypeById(id){
            return this.types[id]
        }
    },
    mounted(){
        this.load()
    }
}
</script>

<style>

</style>