<template>
  <v-container>
    <v-row>
      <v-col :cols="6">
        <v-card-title> 我管理的班级 </v-card-title>
      </v-col>
      <v-col :cols="6">
        <v-btn style="float: right" @click="createOrganization" color="primary"
          >创建新班级</v-btn
        >
      </v-col>
      <v-col>
        <v-btn
          style="float: left"
          @click="to('/acm/admin/edit-exam/0')"
          color="primary"
          >去创建ACM考试</v-btn
        >
        <v-btn
          style="float: left"
          @click="to('/acm/admin/exam')"
          color="green"
          dark
          >查看考场</v-btn
        >
      </v-col>
      <v-col :cols="12">
        <v-sheet elevation="6">
          <v-tabs v-model="current_org_idx" background-color="primary" dark>
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab v-for="(i, k) in my_orgs" :key="k">
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
          <template v-slot:item.name="{ item }">
            <v-text-field v-model="item.name">
              <template v-slot:append>
                <v-btn
                  small
                  color="primary"
                  @click="renameMember(item.gid, item.uid, item.name)"
                  >修改</v-btn
                >
              </template>
            </v-text-field>
          </template>
          <template v-slot:item.is_manager="{ item }">
            {{ isOrganizationManager(item.flag) ? "管理员" : "普通成员" }}
          </template>
          <template v-slot:item.time="{ item }">
            {{ new Date(item.time * 1000).formatDate("Y-M-D h:m:s") }}
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn
              small
              color="primary"
              text
              :disabled="!current_own || item.uid == $store.getters.getUserUid"
              @click="
                () => {
                  if (isOrganizationManager(item.flag)) {
                    cancelManager(item.gid, item.uid);
                  } else {
                    appointManager(item.gid, item.uid);
                  }
                }
              "
            >
              {{ isOrganizationManager(item.flag) ? "取消" : "任命" }}管理员
            </v-btn>
            <v-btn
              small
              color="error"
              text
              :disabled="
                !(
                  (current_own || !isOrganizationManager(item.flag)) &&
                  item.uid != $store.getters.getUserUid
                )
              "
              @click="removeMember(item.gid, item.uid)"
            >
              移除
            </v-btn>
            <v-btn
              small
              color="success"
              text
              v-if="isOrganizationManager(item.flag)"
              @click="to('/teacher')"
              >教师后台</v-btn
            >
            <v-btn
              small
              color="primary"
              text
              v-if="isOrganizationManager(item.flag)"
              @click="to(`/teacher/monitor/members/living/${item.gid}`)"
              >在线监控</v-btn
            >
            <v-btn
              small
              color="primary"
              text
              v-if="isOrganizationManager(item.flag)"
              @click="to(`/teacher/monitor/members/train-check/${item.gid}`)"
              >防作弊检测</v-btn
            >
            <v-btn
              small
              color="primary"
              text
              v-if="isOrganizationManager(item.flag)"
              @click="to(`/awd/editor/0?gid=${item.gid}`)"
              >创建AWD</v-btn
            >
            <v-btn
              small
              color="primary"
              text
              v-if="isOrganizationManager(item.flag)"
              @click="to(`/teacher/awd/list/${item.gid}`)"
              >管理AWD</v-btn
            >
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog.open"
      persistent
      max-width="600px"
      @keydown.esc="dialog.open = false"
    >
      <v-card>
        <v-card-title>创建新班级</v-card-title>
        <v-card-text>
          <v-text-field
            label="班级名称"
            v-model="dialog.org_name"
            :rules="[(v) => !!v || '班级名称不能为空']"
          ></v-text-field>
          <v-textarea
            label="班级描述"
            v-model="dialog.org_desc"
            :rules="[(v) => !!v || '班级描述不能为空']"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog.open = false">取消</v-btn>
          <v-btn color="primary" @click="commitOrganization">创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { openErrorMessageBox, openErrorSnackbar, openInfoMessageBox, openSuccessSnackbar } from '../../concat/bus'
import { 
    api_organization_manage_appoint, 
    api_organization_manage_cancel, 
    api_organization_manage_list_member, 
    api_organization_manage_list_orgs, 
    api_organization_new, 
    api_organization_remove_member 
} from '../../interface/api'
import { isOrganizationManager } from '../../util/index'
import {
    api_organization_member_rename
} from '../../interface/organization'


export default {
    data : () => ({
        my_orgs : [],
        current_org_idx : -1,
        current_own : false,
        headers_members : [{
            text : '名称',
            value : 'name'
        }, {
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
        dialog : {
            open : false,
            org_name : '',
            org_desc : ''
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
        async renameMember(gid, uid, name) {
            const { data } = await api_organization_member_rename(gid, uid, name)
            if(!data){
                openErrorSnackbar('请检查网络连接')
            }else{
                if(data['res'] != 0){
                    openErrorSnackbar(data['err'])
                }else{
                    openSuccessSnackbar('修改成功')
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
        },
        to(path) {
            this.$router.push(path)
        }
    },
    mounted() {
        this.loadOrganizations()
    }
};
</script>

<style>
</style>