<template>
    <v-row>
        <v-col cols="6">
            <v-card-title style="padding: 0; padding-left: 15px">
                课程管理
            </v-card-title>
        </v-col>
        <v-col cols="6">
            <v-btn style="float: right" class="mr5" @click="openNewDialog" color="primary">新建</v-btn>
        </v-col>
        <v-col cols="12">
            <v-data-table
                :headers="headers"
                :items="data"
                :items-per-page="10"
                :server-items-length="99999999"
                :options.sync="options"
            >
                <template v-slot:item.time="{ item }">
                    {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <!-- <v-btn small @click="openEditDialog(item)">编辑</v-btn> -->
                    <v-btn small color="error" @click="del(item)">删除</v-btn>
                </template> 
            </v-data-table>
        </v-col>
        <v-dialog v-model="new_dialog" width="800">
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title class="text-white">
                        创建课程
                    </v-toolbar-title>
                </v-toolbar>
                <div class="px5 py2">
                    <v-text-field
                        label="标题"
                        v-model="new_model.title"
                    ></v-text-field>
                    <v-text-field
                        label="简介"
                        v-model="new_model.desc"
                    ></v-text-field>
                    <span class="text-grey">上传封面</span>
                    <UploadImage v-model="new_model.cover_rid" :height="100" />
                    <v-switch
                        label="是否公开"
                        v-model="new_model.public"
                    ></v-switch>
                    <v-btn color="primary" @click="commit">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>

import UploadImage from '../../components/common/UploadImage.vue'
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_course_create, api_course_get_admin } from '../../interface/api'

export default {
    components : { UploadImage },
    data : () => ({
        headers : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '标题',
            value : 'title'
        }, {
            text : '创建人',
            value : 'owner'
        },{
            text : '创建日期',
            value : 'time'
        }, {
            text : '操作',
            value : 'actions'
        }],
        data : [],
        new_dialog : false,
        new_model : {
            type : 0,
            title : '',
            desc : '',
            cover_rid : 0,
            public : false
        },
        options : {},
    }),
    watch : {
        'options' : {
            handler(){
                this.load()
            },
            deep : true
        }
    },
    methods : {
        async load(){
            const page = this.options.page
            const { data } = await api_course_get_admin(page, 10)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    if(data['data'] != null){
                        this.data = data['data']
                    }
                }
            }
        },
        async del(item){
            console.log(item)
        },
        async commit(){
            const { data } = await api_course_create(
                this.new_model.type, 
                this.new_model.title,
                this.new_model.desc,
                this.new_model.cover_rid,
                this.new_model.public ? 1 : 0
            )
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '创建完成')
                }
            }
        },
        openNewDialog(){
            this.new_model.desc = ''
            this.new_model.title = ''
            this.new_model.cover_rid = 0
            this.new_model.public = false

            this.new_dialog = true
        }
    },
    mounted(){
        this.load()
    }
}
</script>

<style>

</style>