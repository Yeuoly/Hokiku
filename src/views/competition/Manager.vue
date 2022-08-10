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
        <v-col cols="6">
            <v-card-title style="padding: 0; padding-left: 15px">
                镜像管理
            </v-card-title>
        </v-col>
        <v-col cols="6">
            <v-btn style="float: right" class="mr5" @click="openAddImageDialog" color="primary">新建</v-btn>
        </v-col>
        <v-col cols="12">
            <v-data-table
                :headers="headers_image"
                :items="images"
                :items-per-page="10"
                :server-items-length="table_options.image_total"
                :loading="table_options.image_loading"
                :options.sync="table_options.image_options"
            >
                <template v-slot:item.last_update="{ item }">
                    {{ new Date(item.last_update * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.action="{ item }">
                    <!-- <v-btn small @click="openEditDialog(item)">编辑</v-btn> -->
                    <v-btn small color="error" @click="deleteImage(item)">删除</v-btn>
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
                    <v-btn color="primary" @click="commitTrain">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog v-model="new_image.open" width="800">
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title class="text-white">
                        添加镜像
                    </v-toolbar-title>
                </v-toolbar>
                <div class="px5 py2">
                    <v-text-field
                        label="镜像名"
                        v-model="new_image.name"
                    ></v-text-field>
                    <v-text-field
                        label="端口与协议"
                        v-model="new_image.port_protocol"
                    ></v-text-field>
                    <v-progress-linear
                        :active="new_image.downloading"
                        indeterminate
                        color="cyan"
                    ></v-progress-linear>
                    <div class="warped-status-text" ref="msg_box">
                        {{ new_image.status_text }}
                    </div>
                    <v-btn color="primary" @click="commitImage">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_competition_train_add, api_competition_train_delete, api_competition_train_list, api_competition_train_update, api_docker_image_delete, api_docker_image_get, api_docker_image_insert, api_docker_image_insert_check } from '../../interface/api'
import { isFlagDynamic, sleep } from '../../util'
export default {
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
            flag_type: 1
        },
        new_image : {
            open : false,
            name : '',
            port_protocol : '',
            downloading : false,
            status_text : ''
        },
        table_options : {
            image_loading : false,
            image_total : 999999,
            image_options : {},
        }
    }),
    watch : {
        'table_options.image_options' : {
            handler(){
                this.LoadImage()
            },
            deep : true
        }
    },
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
        async LoadImage(){
            this.table_options.image_loading = true
            const page = this.table_options.image_options.page
            const { data } = await api_docker_image_get(page, 10)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    if(data['data'] != null){
                        this.images = data['data']
                    }
                }
            }
            this.table_options.image_loading = false
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
        async deleteImage(item){
            const result = await openInfoMessageBox('提示', '您确定要删除吗')
            if(result){
                const id = item.id
                const { data } = await api_docker_image_delete(id)
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
        async commitTrain(){
            let api
            if(this.new_train.is_new){
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
                port_protocol : this.new_train.port_protocol,
                type : this.new_train.type,
                train_id : this.new_train.train_id,
                flag_path : this.new_train.flag_path,
                flag_type : this.new_train.flag_type
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
        async commitImage(){
            const { data } = await api_docker_image_insert(this.new_image.name, this.new_image.port_protocol)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
                return
            }else if(data['res'] != 0){
                openErrorMessageBox('错误', data['err'])
                return
            }
            const request_id = data['data']
            this.new_image.downloading = true
            let finish = false
            while(!finish){
                const { data } = await api_docker_image_insert_check(request_id)
                if(data && data['res'] == 0){
                    if(typeof data['data'] != 'string'){
                        finish = true
                        if(data['data']['res'] == -1){
                            openErrorMessageBox('错误', '拉取镜像失败，请检查参数')
                        }else{
                            openInfoMessageBox('成功', '镜像添加成功')
                        }
                    }else{
                        this.new_image.status_text += data['data']
                        if(data['data'] != ''){
                            setTimeout(() => {
                                this.$refs.msg_box.scrollTop = this.$refs.msg_box.scrollHeight
                            })
                        }
                    }
                }
                await sleep(1000)
            }
            this.new_image.downloading = false
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
        },
        openAddImageDialog(){
            this.new_image.name = ''
            this.new_image.port_protocol = ''
            this.new_image.open = true
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
    .warped-status-text {
        white-space: pre-wrap;
        max-height: 300px;
        overflow: scroll;
        overflow-x: unset
    }
</style>