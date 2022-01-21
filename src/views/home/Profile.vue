<template>
    <v-row>
        <v-dialog v-model="dialogs.org" width="500">
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
        <v-row class="px5">
            <v-col cols="11" style="padding-top: 20px" class="pl5">
                <v-avatar size="72" class="mr5">
                    <v-img src="https://yeuoly.oss-cn-beijing.aliyuncs.com/irina/static/default_avatar.jpg"></v-img>
                </v-avatar>
                <v-btn disabled>更换头像</v-btn>
            </v-col>
            <v-col cols="12" class="pl5">
                <v-text-field
                    label="用户名"
                    v-model="profile.id"
                    counter="16"
                    type="text"
                >
                    <template v-slot:append-outer>
                        <v-btn 
                            @click="applyChangeName"
                            :disabled="!isNameAvaliable"
                        >
                            修改
                        </v-btn>
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12">
                <v-divider></v-divider>
            </v-col>
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
                <v-btn color="primary" @click="dialogs.org = true">申请加入</v-btn>
            </v-col>
            <v-col cols="12">
                <v-divider></v-divider>
            </v-col>
        </v-row>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_organization_apply_join, api_organization_my } from '../../interface/api'
import { isAvaliableNameFormat } from '../../util/index'

export default {
    name : 'Profile',
    data : () => ({
        profile : {
            id: '',
            uid : 0
        },
        orgs : [{
            name : 'Default',
            id : 0,
            is_admin : 0
        }],
        chip_colors : ['primary', 'red', 'cyan', 'green', 'secondary'],
        dialogs : { org : false },
        apply_join_org : {
            id : 0,
            apply : {
                text : '',
                name : ''
            }
        }
    }),
    methods : {
        applyChangeName(){
            /* TODO */
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
        async loadOrganizations(){
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
        }
    },
    computed : {
        isNameAvaliable(){
            return this.$store.getters.getUserName != this.profile.id
                && isAvaliableNameFormat(this.profile.id)
        }
    },
    mounted(){
        this.profile.id = this.$store.getters.getUserName
        this.profile.uid = this.$store.getters.getUserUid

        this.loadOrganizations()
    }
}
</script>

<style scoped>

</style>