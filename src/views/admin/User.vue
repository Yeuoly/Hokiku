<template>
    <v-container>
        <v-row>
            <v-col :cols="12">
                <v-btn-toggle
                    tile
                    color="deep-purple accent-3"        
                >
                    <v-btn
                        color="primary"
                        @click="download_template"
                    >
                        <v-icon class="px3" color="primary">
                        </v-icon> 
                        导出用户模板
                    </v-btn>
                    <v-btn
                        color="primary"
                        @click="import_users"
                    >
                        <v-icon class="px3" color="primary">
                        </v-icon> 
                        导入用户
                    </v-btn>
                </v-btn-toggle>
            </v-col>
            <v-col :cols="12">
                <v-card>
                    <v-card-title>
                        <v-text-field
                            v-model="search_text"
                            label="搜索"
                            single-line
                            hide-details
                        >
                            <template v-slot:append>
                                <v-btn @click="load()" small color="primary">
                                    <v-icon>mdi-magnify</v-icon>
                                    搜索
                                </v-btn>
                            </template>
                        </v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="users"
                        :page.sync="page"
                        :items-per-page="50"
                        no-data-text="暂无数据"
                        show-expand
                        :single-expand="true"
                        :server-items-length="99999"
                        item-key="uid"
                        :expanded.sync="expanded"
                        :footer-props="{
                            'items-per-page-options': [50]
                        }"
                    >
                        <template v-slot:item.nickname="{ item }">
                            <v-text-field
                                v-model="item.nickname"
                                label="用户名"
                                single-line
                            ></v-text-field>
                        </template>
                        <template v-slot:item.email="{ item }">
                            <v-text-field
                                v-model="item.email"
                                label="邮箱"
                                single-line
                            ></v-text-field>
                        </template>
                        <template v-slot:item.regtime="{ item }">
                            {{ new Date(item.regtime * 1000) }}
                        </template>
                        <template v-slot:item.action="{ item }">
                            <v-btn
                                color="primary"
                                @click="updateProfile(item.uid, item.nickname, item.email)"
                            >更新</v-btn>
                        </template>
                        <template v-slot:expanded-item="{ headers, item }">
                            <td :colspan="headers.length">
                                <v-row class="py3">
                                    <v-col :cols="12">
                                        <v-text-field
                                            v-model="password"
                                            type="password"
                                            label="重置密码"
                                            placeholder="留空则不修改密码"
                                        >
                                            <template v-slot:append>
                                                <v-btn @click="resetPassword(item.uid)" small color="primary">
                                                    <v-icon>mdi-lock-reset</v-icon>
                                                    重置密码
                                                </v-btn>
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                    <v-col v-for="(i, k) in permission_list" :key="k" class="px4 py4">
                                        <v-chip
                                            dark
                                            :color="(i.val & item.status) ? 'primary' : 'red'"
                                            @click="updatePermission(item.uid, i.key)"
                                        >
                                            {{ i.name }}
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </td>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import {
    api_download_file
} from '../../interface/download'
import {
    api_user_import_template_default_excel,
    api_user_admin_permission_list,
    api_user_admin_list,
    api_user_admin_search,
    api_user_admin_profile_update,
    api_user_admin_permission_update,
    api_user_admin_password_reset,
    api_user_admin_import_excel
} from '../../interface/user'
import md5 from 'md5'

export default {
    data : () => ({
        users : [],
        permission_list : [],
        page : 1,
        search_text : '',
        headers : [
            { text: 'UID', value: 'uid' },
            { text: '注册时间', value: 'regtime' },
            { text: '用户名', value: 'nickname' },
            { text: '邮箱', value: 'email' },
            { text: '更新', value: 'action', sortable: false },
            { text: '操作', value: 'data-table-expand' },
        ],
        expanded : [],
        selected_permission : [],
        password : ''
    }),
    computed : {
        list_status() {
            return 0
        }
    },
    watch : {
        page() {
            this.load()
        }
    },
    methods : {
        load() {
            if (this.search_text == '') {
                this.list()
            } else {
                this.search()
            }
        },
        async import_users() {
            // select file and upload, create a new element, click it, and then remove it
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.xlsx'
            input.onchange = async () => {
                const file = input.files[0]
                const { data } = await api_user_admin_import_excel(file)
                if (!data) {
                    openErrorSnackbar('请检查网络连接')
                }else{
                    if (data['res'] == 0) {
                        openSuccessSnackbar('导入成功')
                        const result_url = data['data']['excel_url']
                        api_download_file(result_url) 
                    } else {
                        openErrorSnackbar(data['err'])
                    }
                }
            }
            input.click()
            input.remove()
        },
        async resetPassword(uid) {
            if (!this.password) {
                openErrorSnackbar('密码不能为空')
                return
            }

            const { data } = await api_user_admin_password_reset(uid, md5(this.password))
            if (!data) {
                openErrorSnackbar('请检查网络连接')
            }else{
                if (data['res'] == 0) {
                    openSuccessSnackbar('重置成功')
                } else {
                    openErrorSnackbar(data['err'])
                }
            }
        },
        async updateProfile(uid, nickname, email) {
            const { data } = await api_user_admin_profile_update(uid, nickname, email)
            if (!data) {
                openErrorSnackbar('请检查网络连接')
            }else{
                if (data['res'] == 0) {
                    openSuccessSnackbar('更新成功')
                } else {
                    openErrorSnackbar(data['err'])
                }
            }
        },
        async updatePermission(uid, permission) {
            const { data } = await api_user_admin_permission_update(uid, permission)
            if (!data) {
                openErrorSnackbar('请检查网络连接')
            }else{
                if (data['res'] == 0) {
                    openSuccessSnackbar('更新成功')
                    this.load()
                } else {
                    openErrorSnackbar(data['err'])
                }
            }
        },
        async download_template() {
            const { data } = await api_user_import_template_default_excel()
            if (!data) {
                openErrorSnackbar('请检查网络连接')
            }else{
                if (data['res'] == 0) {
                    api_download_file(data.data.excel_url)
                } else {
                    openErrorSnackbar(data['err'])
                }
            }
        },
        async get_permission_list() {
            const { data } = await api_user_admin_permission_list()
            if (!data) {
                openErrorSnackbar('请检查网络连接')
            }else{
                if (data['res'] == 0) {
                    this.permission_list = data.data['permissions']
                } else {
                    openErrorSnackbar(data['err'])
                }
            }
        },
        async list() {
            const { data } = await api_user_admin_list(this.list_status, this.page, 50)
            if (!data) {
                openErrorSnackbar('请检查网络连接')
            }else{
                if (data['res'] == 0) {
                    this.users = data.data['users']
                } else {
                    openErrorSnackbar(data['err'])
                }
            }
        },
        async search() {
            const { data } = await api_user_admin_search(this.page, 50, this.search_text)
            if (!data) {
                openErrorSnackbar('请检查网络连接')
            }else{
                if (data['res'] == 0) {
                    this.users = data.data['users']
                } else {
                    openErrorSnackbar(data['err'])
                }
            }
        }
    },
    mounted() {
        this.get_permission_list()
        this.load()
    }
}
</script>

<style>

</style>