<template>
    <v-row class="px5 py5">
        <v-dialog v-model="dialog.open" width="500">
            <v-card class="px5 py5">
                <v-text-field
                    label="组织名"
                    v-model="dialog.org_name"
                    placeholder="组织名"
                ></v-text-field>
                <v-textarea
                    label="简介"
                    v-model="dialog.org_desc"
                    placeholder="简介"
                ></v-textarea>
                <v-btn color="primary" @click="commitOrganization">提交申请</v-btn>
            </v-card>
        </v-dialog>
        <v-col :cols="6">
            <v-card-title>
                我管理的组织
            </v-card-title>
        </v-col>
        <v-col :cols="6">
            <v-btn style="float: right" @click="createOrganization" color="primary">创建新组织</v-btn>
        </v-col>
        <v-col :cols="12">
            <v-sheet elevation="6">
                <v-tabs
                    v-model="current_org_idx"
                    background-color="primary"
                    dark
                >
                    <v-tabs-slider color="yellow"></v-tabs-slider>
                    <v-tab
                        v-for="(i, k) in my_orgs"
                        :key="k"
                    >
                        {{ i.name }} - {{ i.id }}
                    </v-tab>
                </v-tabs>
            </v-sheet>
        </v-col>
        <v-col :cols="12">
            <v-data-table
                :headers="headers_members"
                :items="current_members"
                hide-default-footer
                :items-per-page="1000"
            >
                <template v-slot:item.time="{ item }">
                    {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.action="{  }">
                    <v-btn small color="primary">任命管理员</v-btn>
                    <v-btn small color="error">移除</v-btn>
                </template> 
            </v-data-table>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_organization_manage_list_member, api_organization_manage_list_orgs, api_organization_new } from '../../interface/api'
export default {
    data : () => ({
        dialog : {
            open : false,
            org_name : '',
            org_desc : ''
        },
        my_orgs : [],
        current_org_idx : -1,
        headers_members : [{
            text : '名称',
            value : 'name'
        }, {
            text : 'uid',
            value : 'uid'
        },{
            text : '加入时间',
            value : 'time'
        }, {
            text : '操作',
            value : 'action'
        }],
        current_members : []
    }),
    watch : {
        current_org_idx : {
            handler(v){
                const gid = this.my_orgs[v].id
                this.loadMembers(gid)
            },
        }
    },
    methods : {
        createOrganization(){
            this.dialog.open = true
        },
        async commitOrganization(){
            const { data } = await api_organization_new(
                this.dialog.org_name,
                this.dialog.org_desc
            )

            if(!data){
                openErrorMessageBox('失败', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('失败', data['err'])
                }else{
                    openInfoMessageBox('成功', '创建成功')
                }
            }
        },
        async loadOrganizations(){
            const { data } = await api_organization_manage_list_orgs()
            if(!data){
                openErrorMessageBox('错误', '获取组织列表失败，请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    for(const i of data['data']){
                        this.my_orgs.push(i)
                    }
                }
            }
        },
        async loadMembers(gid){
            const { data } = await api_organization_manage_list_member(gid)
            if(!data){
                openErrorMessageBox('错误', '获取组织列表失败，请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.current_members = data['data']
                }
            }
        }
    },
    mounted(){
        this.loadOrganizations()
    }
}
</script>

<style>

</style>