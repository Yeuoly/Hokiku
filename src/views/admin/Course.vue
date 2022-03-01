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
                :expanded.sync="expanded.course"
                show-expand
                single-expand
            >
                <template v-slot:item.time="{ item }">
                    {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <!-- <v-btn small @click="openEditDialog(item)">编辑</v-btn> -->
                    <v-btn small color="error" @click="del(item)">删除</v-btn>
                </template>
                <template v-slot:expanded-item="{ headers }">
                    <td :colspan="headers.length">
                        <div class="px2 py2">
                            <v-btn small color="primary" @click="openNewUnitDialog">添加章节</v-btn>
                            <v-simple-table>
                                <thead>
                                    <tr>
                                        <th class="text-left">
                                            章节名
                                        </th>
                                        <td class="text-left">
                                            创建时间
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in expanded.units"
                                        :key="item.id"
                                    >
                                        <td>{{ item.name }}</td>
                                        <td>{{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </div>
                    </td>
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
        <v-dialog v-model="new_unit" width="800">
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title class="text-white">
                        创建章节
                    </v-toolbar-title>
                </v-toolbar>
                <div class="px5 py2">
                    <v-text-field
                        label="标题"
                        v-model="new_unit_model.name"
                    ></v-text-field>
                    <span class="text-grey">上传封面</span>
                    <UploadImage v-model="new_unit_model.cover_rid" :height="100" />
                    <span class="text-grey">上传ppt</span>
                    <UploadAny v-model="new_unit_model.ppt_rid" :height="100" />
                    <span class="text-grey">上传视频</span>
                    <UploadAny v-model="new_unit_model.media_rid" :height="100" />
                    <v-btn color="primary" @click="commitUnit">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>

import UploadImage from '../../components/common/UploadImage.vue'
import UploadAny from '../../components/common/UploadAttachment.vue'
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_course_admin_list_own, api_course_create, api_course_get_admin, api_course_unit_create } from '../../interface/api'

export default {
    components : { UploadImage, UploadAny },
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
        new_unit : false,
        new_model : {
            type : 0,
            title : '',
            desc : '',
            cover_rid : 0,
            public : false
        },
        new_unit_model : {
            ppt_rid : 0,
            media_rid : 0,
            cover_rid : 0,
            name : ''
        },
        expanded : {
            course : [],
            units : []
        },
        options : {},
    }),
    watch : {
        'options' : {
            handler(){
                this.load()
            },
            deep : true
        },
        'expanded.course' : {
            handler(v){
                if(v.length > 0){
                    this.loadUnits(v[0])
                }
            },
            deep : true
        }
    },
    methods : {
        async commitUnit(){
            const cid = this.expanded.course[0].id
            const { data } = await api_course_unit_create(
                cid, 
                this.new_unit_model.name,
                this.new_unit_model.cover_rid,
                this.new_unit_model.ppt_rid,
                this.new_unit_model.media_rid
            )
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '创建成功')
                }
            }
        },
        async loadUnits(v){
            this.expanded.units = []
            const { data } = await api_course_admin_list_own(v.id)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    if(data['data'] != null){
                        this.expanded.units = data['data']
                    }
                }
            }
        },
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
        },
        openNewUnitDialog(){
            this.new_unit_model.ppt_rid = 0
            this.new_unit_model.media_rid = 0
            this.new_unit_model.cover_rid = 0
            this.new_unit_model.name = ''

            this.new_unit = true
        }
    },
    mounted(){
        this.load()
    }
}
</script>

<style>

</style>