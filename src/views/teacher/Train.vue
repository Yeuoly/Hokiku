<template>
    <v-row>
        <v-col cols="6">
            <v-card-title style="padding: 0; padding-left: 15px">
                训练题管理
            </v-card-title>
        </v-col>
        <v-col cols="6">
            <v-btn style="float: right" class="mr5" @click="openAddTrainDialog" color="primary">新建</v-btn>
        </v-col>
        <v-col cols="12">
            <v-data-table
                :headers="headers_train"
                :items="trains"
                hide-default-footer
                :items-per-page="1000"
                :page.sync="page"
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
                        label="描述"
                        v-model="new_train.comment"
                    ></v-text-field>
                    <v-text-field
                        label="分值"
                        v-model.number="new_train.score"
                    ></v-text-field>
                    <v-text-field
                        label="默认flag"
                        v-model="new_train.ctf_flag"
                    ></v-text-field>
                    <v-radio-group
                        row
                        v-model="new_train.flag_type"
                    >
                        <v-radio
                            v-for="(i, k) in flag_types"
                            :key="k"
                            :label="flag_types[k]"
                            :value="k"
                        ></v-radio>
                    </v-radio-group>
                    <v-text-field
                        label="flag路径"
                        v-model="new_train.flag_path"
                    ></v-text-field>
                    <v-text-field
                        label="端口映射"
                        v-model="new_train.port_protocol"
                    ></v-text-field>
                    <v-row>
                        <v-col>
                            <v-switch
                                label="动态flag"
                                v-model="new_train.dynamic_flag"
                            ></v-switch>
                        </v-col>
                        <v-col>
                            <v-switch
                                v-if="new_train.is_new"
                                label="动态分值"
                                v-model="new_train.score_dynamic"
                            ></v-switch>
                        </v-col>
                    </v-row>
                    <v-layout>
                        <v-chip
                            class="ma-2"
                            color="pink"
                            label
                            text-color="white"
                        >
                            <v-icon left>
                                mdi-label
                            </v-icon>
                            标签：
                        </v-chip>
                        <v-chip
                            class="ma-2"
                            color="green"
                            label
                            text-color="white"
                            v-for="(i, k) in new_train.tags"
                            :key="k"
                        >
                            <v-icon left>
                                mdi-label
                            </v-icon>
                            {{ new_train.tags[k].name }}
                        </v-chip>
                    </v-layout>
                    <v-text-field
                        label="标签 - 回车添加"
                        placeholder="标签名"
                        v-model="new_train.tag_text"
                        @keypress.enter="appendTag"
                    ></v-text-field>
                    <v-row>
                        <v-col :cols="12" class="text-grey">
                            附件：
                        </v-col>
                        <v-col :cols="3" v-for="(i, k) in new_train.attachments" :key="k">
                            <v-card color="green" dark :title="i.r_resource.extra" class="clickable">
                                <v-card-title>
                                    <!-- final 10 chars -->
                                    {{ i.r_resource.extra.substr(-12) }}
                                </v-card-title>
                            </v-card>
                        </v-col>
                        <v-col :cols="2">
                            <UploadAttachment :size="32" @change="hookUploadAttachment" v-model="new_train.tmp_attchement_rid" />
                        </v-col>
                    </v-row>
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
                    <v-btn color="primary" @click="commitTrain">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { 
    api_competition_train_tag_create, 
    api_competition_train_attachemnt_list,
    api_competition_train_attachemnt_upload,
    api_competition_train_delete,
    api_competition_train_update
} from '../../interface/api'
import {
    api_organization_train_add,
    api_organization_manage_train_list
} from '../../interface/organization'

import { isFlagDynamic } from '../../util'
import UploadAttachment from '../../components/common/UploadAttachment.vue'

export default {
    components : { UploadAttachment },
    data : () => ({
        headers_train : [{
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
            text: 'flag路径',
            value: 'flag_path'
        }, {
            text : '操作',
            value : 'action'
        }],
        headers_image : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '名称',
            value : 'name'
        }, {
            text : '创建人',
            value : 'user'
        },{
            text : '创建日期',
            value : 'last_update'
        }, {
            text : '协议与端口',
            value : 'port_protocol'
        }, {
            text : '操作',
            value : 'action'
        }],
        types : ['DEFAULT', 'WEB', 'PWN', 'MISC', 'REVERSE', 'CRYPTO', 'MOBILE'],
        flag_types: ['DEFAULT', '文件flag', '模板指令', '环境变量'],
        trains : [],
        images : [],
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
            is_new : true,
            train_id : 0,
            flag_path: '',
            flag_type: 1,
            tags : [],
            tag_text : '',
            attachments : [],
            tmp_attchement_rid : 0,
            score : 100,
            score_dynamic : false,
        },
        page : 1,
        gid : 0
    }),
    methods : {
        async load(){
            const { data } = await api_organization_manage_train_list(this.gid, this.page, 25)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.trains = data['data']['list'] || []
                }
            }
        },
        async openEditDialog(item){
            this.new_train.is_new = false
            this.new_train.title = item.title
            this.new_train.author = item.author
            this.new_train.image = item.image
            this.new_train.comment = item.comment
            this.new_train.ctf_flag = item.ctf_flag
            this.new_train.type = item.type
            this.new_train.port_protocol = item.port_protocol
            this.new_train.dynamic_flag = isFlagDynamic(item.flag)
            this.new_train.open = true
            this.new_train.train_id = item.id
            this.new_train.flag_path = item.flag_path
            this.new_train.flag_type = item.flag_type
            this.new_train.tags = item.r_tags
            this.loadAttchments(item.id)
        },
        async loadAttchments(id) {
            //load attachments
            const { data } = await api_competition_train_attachemnt_list(id)
            if (data && data['res'] == 0) {
                if (data['data'] != null) {
                    this.new_train.attachments = data['data']
                }
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '网络错误')
            }
        },
        async uploadAttchment(train_id, rid) {
            const { data } = await api_competition_train_attachemnt_upload(train_id, rid)
            if (data && data['res'] == 0) {
                this.loadAttchments(train_id)
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '网络错误')
            }
            this.new_train.tmp_attchement_rid = 0
        },
        hookUploadAttachment(rid) {
            this.uploadAttchment(this.new_train.train_id, rid)
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
        commitTrain(){
            if(this.new_train.is_new){
                this.addTrain()
            }else{
                this.updateTrain()
            }
        },
        async updateTrain() {
            const { data } = await api_competition_train_update({
                title : this.new_train.title,
                author : this.new_train.author,
                image : this.new_train.image,
                comment : this.new_train.comment,
                ctf_flag : this.new_train.ctf_flag,
                flag_dynamic : this.new_train.dynamic_flag,
                port_protocol : this.new_train.port_protocol,
                type : this.new_train.type,
                train_id : this.new_train.train_id,
                flag_path : this.new_train.flag_path,
                flag_type : this.new_train.flag_type,
                tags : this.new_train.tags.map(item => item.id).join(',')
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
        async addTrain() {
            const { data } = await api_organization_train_add(
                this.gid, this.new_train.title, this.new_train.author, this.new_train.image, this.new_train.comment, this.new_train.ctf_flag, 
                this.new_train.dynamic_flag, this.new_train.port_protocol, this.new_train.type, this.new_train.flag_path, this.new_train.flag_type, 
                this.new_train.tags.map(item => item.id).join(','), this.new_train.score, this.new_train.score_dynamic
            )
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            } else {
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                } else {
                    openInfoMessageBox('成功', '成功')
                    this.new_train.open = false
                }
            }
        },
        async appendTag() {
            const name = this.new_train.tag_text
            const { data } = await api_competition_train_tag_create(name)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.new_train.tags.push({
                        id : data['data'],
                        name : name
                    })
                    this.new_train.tag_text = ''
                }
            }
        },
        openAddTrainDialog(){
            this.new_train.is_new = true
            this.new_train.title = ''
            this.new_train.author = this.$store.getters.getUserName
            this.new_train.image = ''
            this.new_train.comment = 'none'
            this.new_train.ctf_flag = 'none'
            this.new_train.port_protocol = ''
            this.new_train.flag_path = '/home/ctf/flag'
            this.new_train.type = 0
            this.new_train.dynamic_flag = false
            this.new_train.open = true
            this.new_train.tags = [],
            this.new_train.attachments = []
        },
        getTypeById(id){
            return this.types[id]
        }
    },
    mounted(){
        this.gid = parseInt(this.$route.params.gid)
        if(!this.gid){
            this.$router.back()
        }
        this.load()
    }
}
</script>

<style>
    .warped-status-text {
        white-space: pre-wrap;
        max-height: 300px;
        overflow: scroll;
        overflow-x: unset
    }
</style>