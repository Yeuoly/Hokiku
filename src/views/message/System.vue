<template>
    <v-row>
        <v-col cols="12">
            <v-list flat>
                <v-list-item 
                    v-for="(i, k) in messages" 
                    :key="k"
                    class="pb5"
                >
                    <v-row>
                        <v-col cols="12">
                            <span>{{ i.title }}</span>
                            <span class="text-12 pl5">{{ new Date(i.time * 1000).formatDate('Y-M-D h:m:s') }}</span>
                        </v-col>
                        <v-col cols="12">
                            <v-card flat class="px5" v-if="i.type === 0">
                                {{ i.r_info.text }}
                            </v-card>
                            <v-card flat v-else-if="i.type === 1">
                                个人 <strong>{{ i.r_info.applyer_name }}</strong>
                                (uid <strong>{{ i.r_info.applyer_uid }}</strong>)
                                申请以身份 <strong>{{ i.r_info.org_username }}</strong>
                                加入组织 <strong>{{ i.r_info.org_name }}</strong>
                                (gid <strong>{{ i.r_info.org_id }}</strong>)
                                <br>
                                <br>
                                <v-btn 
                                    @click="acceptJoinApply(i.r_info.id, k)"
                                    :disabled="i.r_info.status !== 0"
                                    color="primary" class="mr5" small
                                >同意</v-btn>
                                <v-btn 
                                    @click="rejectJoinApply(i.r_info.id, k)"
                                    :disabled="i.r_info.status !== 0"
                                    color="red" style="color: white" small
                                >拒绝</v-btn>
                                <span v-if="i.r_info.status === 1">
                                    已被同意
                                </span>
                                <span v-if="i.r_info.status === 2">
                                    已被拒绝
                                </span>
                            </v-card>
                        </v-col>
                        <v-col cols="12" style="text-align: right">
                            <span>来自：{{ i.from }}</span>
                        </v-col>
                        <v-col cols="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list>
        </v-col>
    </v-row>
</template>

<script>
const MESSAGE_TYPE_NORMAL = 0
const MESSAGE_TYPE_APPLY_JOIN = 1

import { api_organization_accept_apply, api_organization_reject_apply } from '../../interface/api'
import { openErrorMessageBox } from '../../concat/bus'

export default {
    name : 'message-system',
    data : () => ({
        messages : [{
            id : 0,
            title : '普通消息',
            time : 0,
            type : MESSAGE_TYPE_NORMAL,
            r_info : {
                id : 0,
                text : '这是普通消息'
            },
            from : '系统'
        }, {
            id : 1,
            title : '申请消息',
            time : 123,
            type : MESSAGE_TYPE_APPLY_JOIN,
            r_info : {
                id : 0,
                org_id : 0,
                org_name : 'IotShield',
                status : 0,
                applyer_uid : 0,
                applyer_name : 'Yeuoly',
                org_username : '周瑜',
                apply_text : ''
            },
            from : '系统'
        }, {
            id : 1,
            title : '申请消息',
            time : 123,
            type : MESSAGE_TYPE_APPLY_JOIN,
            r_info : {
                org_id : 0,
                org_name : 'IotShield',
                status : 1,
                applyer_uid : 0,
                applyer_name : 'Yeuoly',
                org_username : '周瑜',
                apply_text : ''
            },
            from : '系统'
        }]
    }),
    methods : {
        async acceptJoinApply(mid, idx){
            console.log(123321)
            const resp = await api_organization_accept_apply(mid)
            if(!resp){
                openErrorMessageBox('错误', '请检查网络情况')
            }else{
                if(resp['res'] != 0){
                    openErrorMessageBox('错误', resp['err'])
                }else{
                    this.messages[idx].r_info.status = 1
                }
            }
        },
        async rejectJoinApply(mid, idx){
            const resp = await api_organization_reject_apply(mid)
            if(!resp){
                openErrorMessageBox('错误', '请检查网络情况')
            }else{
                if(resp['res'] != 0){
                    openErrorMessageBox('错误', resp['err'])
                }else{
                    this.messages[idx].r_info.status = -1
                }
            }
        }
    }
}
</script>

<style>

</style>