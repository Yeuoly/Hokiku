<template>
    <v-row class="px5 py5">
        <v-dialog v-model="apply_join_dialog.org" width="500">
            <v-card class="px5 py5">
                <v-card-text>
                    请注意：
                    <ul>
                        <li>当您加入到某一班级后，班级管理者将有权查看您的训练状态，包括但不限于flag提交记录，在线状态等</li>
                        <li>是否通过需要等待管理员同意</li>
                        <li>管理员有权修改您在班级内的相关信息</li>
                        <li>您无法主动退出班级</li>
                    </ul>
                </v-card-text>
                <v-text-field
                    label="班级ID"
                    v-model.number="apply_join_org.id"
                ></v-text-field>
                <v-text-field
                    label="班级内昵称"
                    v-model="apply_join_org.apply.name"
                    placeholder="班级内昵称"
                ></v-text-field>
                <v-textarea
                    label="申请信息"
                    v-model="apply_join_org.apply.text"
                    placeholder="申请信息"
                ></v-textarea>
                <v-btn color="primary" @click="applyJoinOrg">提交申请</v-btn>
            </v-card>
        </v-dialog>
        <v-col cols="10" class="pl5">
            <v-card-text>已加入班级：</v-card-text>
            <v-card-actions>
                <v-chip-group>
                    <v-chip
                        text-color="white" 
                        v-for="(i, k) in orgs" 
                        :color="chip_colors[k % chip_colors.length]" 
                        :key="k"
                        @click="selectOrg(i)"
                    >
                        {{ i.name }} - gid:{{ i.id }}
                    </v-chip>
                </v-chip-group>
            </v-card-actions>
        </v-col>
        <v-col cols="2">
            <v-btn style="float: right" color="primary" @click="apply_join_dialog.org = true">申请加入</v-btn>
        </v-col>
        <v-col cols="12">
            <v-divider></v-divider>
        </v-col>
        <v-col :cols="12">
            <v-card>
                <v-card-text>
                    当前班级：{{ current_org.name }}
                </v-card-text>
            </v-card>
        </v-col>
        <v-col :cols="12">
            <v-row>
                <v-col :cols="6" :sm="6" :md="4" :lg="4" :xl="3">
                    <div class="class_detail-enter px3 py3 clickable">
                        <div class="class_detail-img" :style="{
                            backgroundImage : 'url(' + require('../../assets/hacker.jpg') + ')'
                        }">
                            <div class="class_detail-mask" @click="to(`/org/train/${current_org.id}`)">练习环境</div>
                        </div>
                    </div>
                </v-col>
                <v-col :cols="6" :sm="6" :md="4" :lg="4" :xl="3">
                    <div class="class_detail-enter px3 py3 clickable">
                        <div class="class_detail-img" :style="{
                            backgroundImage : 'url(' + require('../../assets/aqua.png') + ')'
                        }">
                            <div class="class_detail-mask" @click="to(`/org/sheet/${current_org.id}`)">题单</div>
                        </div>
                    </div>
                </v-col>
                <v-col :cols="6" :sm="6" :md="4" :lg="4" :xl="3">
                    <div class="class_detail-enter px3 py3 clickable">
                        <div class="class_detail-img" :style="{
                            backgroundImage : 'url(' + require('../../assets/hacker-man.jpg') + ')'
                        }">
                            <div class="class_detail-mask" @click="to">我的学习状态</div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { 
    api_organization_apply_join, 
    api_organization_my, 
} from '../../interface/api'

export default {
    data : () => ({
        current_org : {
            name : 'Default',
            id : 0,
            is_admin : 0
        },
        apply_join_org : {
            id : 0,
            apply : {
                text : '',
                name : ''
            }
        },
        chip_colors : ['primary', 'red', 'cyan', 'green'],
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
        apply_join_dialog : {
            org : false
        }
    }),
    methods : {
        to(path) {
            this.$router.push(path)
        },
        selectOrg(org) {
            this.current_org = org
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
                openErrorMessageBox('错误', '获取班级列表失败，请检查网络连接')
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
    },
    mounted(){
        this.loadJoinedOrganizations()
    }
}
</script>

<style>
    .class_detail-enter {
        height: 300px;
    }

    .class_detail-img {
        background-size: cover;
        height: 100%;
        border-radius: 10px;
    }

    .class_detail-mask {
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        line-height: 300px;
        text-align: center;
        color: white;
        font-size: 20px;
        border-radius: 10px;
        overflow: hidden;
    }
</style>