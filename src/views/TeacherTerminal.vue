<template>
    <v-container style="margin-bottom: 30px">
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title class="text-white">
                    教师管理
                </v-toolbar-title>
                <template v-slot:extension>
                    <v-tabs v-model="current_tab" align-with-title>
                        <v-tabs-slider color="black"></v-tabs-slider>
                        <v-tab v-for="(i, key) in tabs" :key="key">
                            <span class="text-white">
                                {{ i }}
                            </span>
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
            <v-tabs-items v-model="current_tab">
                <v-tab-item :key="0">
                    <v-container>
                        <v-row>
                            <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
                                <v-text-field
                                    label="作业标题"
                                    v-model="homework_title"
                                ></v-text-field>
                            </v-col>
                            <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
                                <v-menu
                                    v-model="date_picker_menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="end_at"
                                            label="截止时间"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="end_at"
                                        @input="date_picker_menu = false"
                                        :min="new Date().formatDate('Y-M-D')"
                                        locale="zh-cn"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
                                <v-select
                                    label="发布到班级"
                                    :items="orgs"
                                    item-text="name"
                                    item-value="id"
                                    menu-props="auto"
                                    single-line
                                    v-model="target_org"
                                ></v-select>
                            </v-col>
                            <v-col :cols="12" :sm="12" :md="12" :lg="12" :xl="12">
                                <rich-editor
                                    v-model="homework_desc"
                                ></rich-editor>
                            </v-col>
                            <v-col :cols="12">
                                <v-btn color="primary" @click="publishHomework">发布</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-tab-item>
                <v-tab-item :key="1">
                    <v-container>
                        <v-data-table
                            :headers="homework_table_headers"
                            :loading="homework_table_loading"
                            :items="homework_table_data"
                            :server-items-length="homework_table_tot_len"
                            :options.sync="homework_table_options"
                            :page.sync="homework_table_page"
                            :items-per-page="10"
                        >
                            <template v-slot:item.actions="{ item }">
                                <v-icon
                                    small
                                    @click="homeworkCommits(item)"
                                >
                                    mdi-chart-box-outline
                                </v-icon>
                            </template>
                            <template v-slot:item.send="{ item }">
                                <v-icon
                                    small
                                    @click="republishHomework(item.id)"
                                >
                                    mdi-send
                                </v-icon>
                            </template>
                            <template v-slot:item.time="{ item }">
                                {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                            </template>
                            <template v-slot:item.endtime="{ item }">
                                {{ new Date(item.endtime * 1000).formatDate('Y-M-D h:m:s') }}
                            </template>
                        </v-data-table>
                    </v-container>
                </v-tab-item>
                <v-tab-item :key="2">
                    <v-container>
                        开发中
                    </v-container>
                </v-tab-item>
                <v-tab-item :key="3">
                    <v-container>
                        <v-btn @click="toCreateCol">
                            创建收集表
                        </v-btn>
                        <v-data-table
                            :headers="collection_table_headers"
                            :loading="collection_table_loading"
                            :items="collection_table_data"
                            :server-items-length="collection_table_tot_len"
                            :options.sync="collection_table_option"
                            :page.sync="collection_table_page"
                            :items-per-page="10"
                            hide-default-footer
                        >
                            <template v-slot:item.actions="{ item }">
                                <v-icon
                                    small
                                    @click="collectionCharts(item)"
                                >
                                    mdi-chart-box-outline
                                </v-icon>
                                <v-icon
                                    small
                                    @click="collectionDetail(item)"
                                >
                                    mdi-details
                                </v-icon>
                            </template>
                            <template v-slot:item.time="{ item }">
                                {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                            </template>
                        </v-data-table>
                        <div class="text-center pt-2">
                            <v-pagination
                                v-model="collection_table_page"
                                :length="Math.ceil(collection_table_tot_len / 10)"
                            ></v-pagination>
                        </div>
                    </v-container>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-container>
</template>

<script>
import RichEditor from '../components/common/RichEditor.vue'
import { closeLoadingOverlay, openErrorMessageBox, openErrorSnackbar, openInfoMessageBox, openLoadingOverlay, openSuccessSnackbar } from '../concat/bus'
import { 
  api_homework_publish,
    api_homework_publish_list,
    api_list_collection, 
    api_organization_manage_list_orgs,
    api_homework_republish
} from '../interface/api'

export default {
    components : { RichEditor },
    data : () => ({
        current_tab : '',
        tabs : ['发布作业', '作业列表',  '我的班级', '收集表'],
        orgs : [],
        target_org : 0,
        homework_title : '',
        homework_desc : '',
        end_at : '',
        date_picker_menu : false,
        homework_table_headers : [{
            text : 'id',
            value : 'id'
        },{
            text : '标题',
            value : 'title'
        }, {
            text : '组织',
            value : 'org'
        }, {
            text : '发布者',
            value : 'owner'
        },{
            text : '发布时间',
            value : 'time'
        }, {
            text : '结束时间',
            value : 'endtime'
        }, {
            text : '提交情况',
            value : 'actions'
        }, {
            text : '再次推送',
            value : 'send'
        }],
        homework_table_options : {},
        homework_table_data : [],
        homework_table_loading : false,
        homework_table_tot_len : 99999,
        homework_table_page : 1,
        collection_table_headers : [{
            text : '标题',
            align : 'start',
            value : 'title'
        }, {
            text : 'cid',
            value : 'cid'
        }, {
                text : '类型',
                value : 'type'
        }, {
            text : '创建时间',
            value : 'time'
        }, {
            text : '操作',
            value : 'actions'
        }],
        collection_table_option : {},
        collection_table_loading : false,
        collection_table_data : [],
        collection_table_tot_len : 0,
        collection_table_page : 1
    }),
    watch : {
        collection_table_option : {
            handler(){
                this.getCollectionList()
            },
            deep : true
        },
        homework_table_options : {
            handler(){
                this.loadPublishList()
            },
            deep : true
        }
    },
    computed : {
        endtime(){
            return parseInt(new Date(this.end_at).getTime() / 1000)
        }
    },
    methods : {
        toCreateCol(){
           this.$router.push('/coll/publish')
        },
        async getCollectionList(){
            this.collection_table_loading = true
            const { page } = this.collection_table_option
            const { data } = await api_list_collection(page, 10)
            if(!data){
                openErrorMessageBox('错误', '网络异常')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.collection_table_data = data['data']['list']
                    this.collection_table_tot_len = data['data']['count']
                }
            }
            this.collection_table_loading = false
        },
        async loadOrganizations(){
            const { data } = await api_organization_manage_list_orgs();
            if(!data){
                openErrorMessageBox('错误', '网络异常')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.orgs = data['data']
                }
            }
        },
        async publishHomework(){
            const { data } = await api_homework_publish(
                this.target_org,
                this.homework_title,
                this.endtime,
                this.homework_desc,
            )
            if(!data){
                openErrorMessageBox('错误', '网络异常')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '发布成功')
                }
            }
        },
        async loadPublishList(){
            const { page } = this.homework_table_options
            const { data } = await api_homework_publish_list(page, 10)
            if(!data){
                openErrorMessageBox('错误', '网络异常')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else if(data['data']){
                    this.homework_table_data.splice(0, this.homework_table_data.length)
                    for(const i of data['data']){
                        this.homework_table_data.push({
                            id : i.id,
                            title : i.title,
                            org : i.r_organization.name,
                            owner : i.r_owner.name,
                            time : i.time,
                            endtime : i.endtime
                        })
                    }
                }
            }
        },
        async republishHomework(hid) {
            openLoadingOverlay()
            const { data } = await api_homework_republish(hid)
            if(!data){
                openErrorSnackbar('网络异常')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    openSuccessSnackbar('重新推送成功')
                }
            }
            closeLoadingOverlay()
        },
        collectionCharts(item){
            this.$router.push(`/coll/statistics/${item.cid}`)
        },
        collectionDetail(item){
            this.$router.push(`/coll/info/${item.cid}`)
        },
        homeworkCommits(item){
            this.$router.push(`/homework/commits/${item.id}`)
        }
    },
    async mounted(){
        this.loadOrganizations()
    }
}
</script>

<style scoped>
    
</style>