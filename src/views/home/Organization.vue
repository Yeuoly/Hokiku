<template>
    <v-row class="px5 py5">
        <v-dialog v-model="apply_join_dialog.org" width="500">
            <v-card class="px5 py5">
                <v-text-field
                    label="组织ID"
                    v-model.number="apply_join_org.id"
                ></v-text-field>
                <v-text-field
                    label="组织内昵称"
                    v-model="apply_join_org.apply.name"
                    placeholder="组织内昵称"
                ></v-text-field>
                <v-textarea
                    label="申请信息"
                    v-model="apply_join_org.apply.text"
                    placeholder="申请信息"
                ></v-textarea>
                <v-btn color="primary" @click="applyJoinOrg">提交申请</v-btn>
            </v-card>
        </v-dialog>
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
        <v-col cols="10" class="pl5">
            <v-card-text>已加入组织：</v-card-text>
            <v-card-actions>
                <v-chip-group>
                    <v-chip 
                        text-color="white" 
                        v-for="(i, k) in orgs" 
                        :color="chip_colors[k % chip_colors.length]" 
                        :key="k"
                    >
                        {{ i.name }} - gid:{{ i.id }}
                    </v-chip>
                </v-chip-group>
            </v-card-actions>
        </v-col>
        <v-col cols="2">
            <v-btn style="float: right" color="primary" @click="dialogs.org = true">申请加入</v-btn>
        </v-col>
        <v-col cols="12">
            <v-divider></v-divider>
        </v-col>
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
                <template v-slot:item.is_manager="{ item }">
                    {{ isOrganizationManager(item.flag) ? '管理员' : '普通成员'}}
                </template>
                <template v-slot:item.time="{ item }">
                    {{ new Date(item.time * 1000).formatDate('Y-M-D h:m:s') }}
                </template>
                <template v-slot:item.action="{ item }">
                    <v-btn small color="primary" 
                        :disabled="!current_own || item.uid == $store.getters.getUserUid"
                        @click="() => {
                            if(isOrganizationManager(item.flag)){
                                cancelManager(item.gid, item.uid)
                            }else{
                                appointManager(item.gid, item.uid)
                            }
                        }"
                    >
                        {{ isOrganizationManager(item.flag) ? '取消' : '任命' }}管理员
                    </v-btn>
                    <v-btn small color="error" 
                        :disabled="!((current_own || !isOrganizationManager(item.flag)) && item.uid != $store.getters.getUserUid)"
                        @click="removeMember(item.gid, item.uid)"    
                    >
                        移除
                    </v-btn>
                </template> 
            </v-data-table>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_organization_apply_join, api_organization_manage_appoint, api_organization_manage_cancel, api_organization_manage_list_member, api_organization_manage_list_orgs, api_organization_my, api_organization_new, api_organization_remove_member } from '../../interface/api'
import { isOrganizationManager } from '../../util/index'

export default {
    data : () => ({
        apply_join_org : {
            id : 0,
            apply : {
                text : '',
                name : ''
            }
        },
        chip_colors : ['primary', 'red', 'cyan', 'green', 'secondary'],
        orgs : [{
            name : 'Default',
            id : 0,
            is_admin : 0
        }],
        dialog : {
            open : false,
            org_name : '',
            org_desc : ''
        },
        my_orgs : [],
        current_org_idx : -1,
        current_own : false,
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
            text : '身份',
            value : 'is_manager'
        }, {
            text : '操作',
            value : 'action'
        }],
        current_members : [],
        apply_join_dialog : {
            org : false
        }
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
        isOrganizationManager(flag){
            return isOrganizationManager(flag)
        },
        async applyJoinOrg(){
            const { data } = await api_organization_apply_join(
                this.apply_join_org.id,
                this.apply_join_org.apply.text,
                this.apply_join_org.apply.name
            )

            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    await openInfoMessageBox('成功', '申请消息已发送')
                    this.dialogs.org = false
                }
            }
        },
        async loadJoinedOrganizations(){
            const { data } = await api_organization_my()
            if(!data){
                openErrorMessageBox('错误', '获取组织列表失败，请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else if(data['data']['r_member'] != null){
                    for(const i of data['data']['r_organization']){
                        this.orgs.push({
                            name : i['name'],
                            id : i['id'],
                            is_admin : false
                        })
                    }
                }
            }
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
                    this.current_own = data['data']['own']
                    this.current_members = data['data']['list']
                }
            }
        },
        async appointManager(gid, uid){
            const { data } = await api_organization_manage_appoint(gid, uid)
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '任命成功')
                    for(const i of this.current_members){
                        if(i.gid == gid && i.uid == uid){
                            i.flag = i.flag | 2
                            break
                        }
                    }
                }
            }
        },
        async cancelManager(gid, uid){
            const { data } = await api_organization_manage_cancel(gid, uid)
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '取消成功')
                    for(const i of this.current_members){
                        if(i.gid == gid && i.uid == uid){
                            i.flag = i.flag & ~2
                            break
                        }
                    }
                }
            }
        },
        async removeMember(gid, uid){
            const { data } = await api_organization_remove_member(gid, uid)
            if(!data){
                openErrorMessageBox('错误', '请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    openInfoMessageBox('成功', '移除成功')
                    for(const i in this.current_members){
                        if(this.current_members[i].gid == gid 
                            && this.current_members[i].uid == uid){
                            this.current_members.splice(i, 1)
                            break
                        }
                    }
                }
            }
        }
    },
    mounted(){
        this.loadOrganizations()
        this.loadJoinedOrganizations()
    }
}
</script>

<style>

</style>