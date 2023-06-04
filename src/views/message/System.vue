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
                                个人 <strong>{{ i.r_info.r_user.name }}</strong>
                                (uid <strong>{{ i.r_info.uid }}</strong>)
                                申请以身份 <strong>{{ i.r_info.username }}</strong>
                                加入组织 <strong>{{ i.r_info.r_organization.name }}</strong>
                                (gid <strong>{{ i.r_info.gid }}</strong>)
                                <br>
                                <span class="text-12">申请消息：{{ i.r_info.text }}</span>
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
                            <v-card flat v-else-if="i.type === 3">
                                <span v-if="i.r_info.r_homework.type == 0">
                                    <strong> {{ i.r_info.r_homework.r_organization.name }} </strong>
                                    发布了新的作业 <strong>{{ i.r_info.r_homework.title }}</strong>
                                    (id <strong>{{ i.r_info.hid }}</strong>)
                                    请注意截止日期 <strong>{{ new Date(i.r_info.r_homework.endtime * 1000).formatDate('Y-M-D h:m:s') }}</strong>，该作业为<strong>普通文字</strong>类型作业，提交请到
                                    <a :href="`/homework/${i.r_info.r_homework.id}`">
                                        {{ i.r_info.r_homework.r_organization.name }} -> {{ i.r_info.r_homework.title }}
                                    </a>
                                </span>
                                <span v-if="i.r_info.r_homework.type == 1">
                                    <strong> {{ i.r_info.r_homework.r_organization.name }} </strong>
                                    发布了新的作业 <strong>{{ i.r_info.r_homework.title }}</strong>
                                    (id <strong>{{ i.r_info.hid }}</strong>)
                                    请注意截止日期 <strong>{{ new Date(i.r_info.r_homework.endtime * 1000).formatDate('Y-M-D h:m:s') }}</strong>，该作业为<strong>CTF练习题</strong>类型作业，提交请到
                                    <a :href="`/competition/train?id=${i.r_info.r_homework.extra}`">
                                        {{ i.r_info.r_homework.r_organization.name }} -> {{ i.r_info.r_homework.title }}
                                    </a>
                                </span>
                            </v-card>
                            <v-card flat v-else-if="i.type === 4">
                                您的账户余额发生变动，变动金额：
                                <strong v-if="i.r_info.r_change.value < 0" style="color: red">{{ i.r_info.r_change.value }}￥</strong>
                                <strong v-else style="color: green">{{ i.r_info.r_change.value }}￥</strong>
                                ，变动来源：
                                <strong v-if="i.r_info.r_change.from === 0">未知</strong>
                                <strong v-else-if="i.r_info.r_change.from === 1">系统</strong>
                                <strong v-else-if="i.r_info.r_change.from === 2">微信</strong>
                                <strong v-else-if="i.r_info.r_change.from === 3">支付宝</strong>
                                <strong v-else-if="i.r_info.r_change.from === 4">签到</strong>
                                ，变动时间 <strong>{{ new Date(i.r_info.r_change.time * 1000).formatDate('Y-M-D h:m:s') }}</strong>
                            </v-card>
                        </v-col>
                        <v-col cols="12" style="text-align: right">
                            <span>来自：{{ getMessageFromText(i.from) }}</span>
                        </v-col>
                        <v-col cols="12">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                </v-list-item>
            </v-list>
            <v-pagination
                v-model="page"
                :length="99999"
                :total-visible="7"
            ></v-pagination>
        </v-col>
    </v-row>
</template>

<script>
//const MESSAGE_TYPE_NORMAL = 0
//const MESSAGE_TYPE_APPLY_JOIN = 1

import { api_message_system_list, api_organization_accept_apply, api_organization_reject_apply } from '../../interface/api'
import { openErrorMessageBox } from '../../concat/bus'

import { getMessageFromText } from '../../util/index'

export default {
    name : 'message-system',
    data : () => ({
        messages : [],
        page : 1
    }),
    watch : {
        page : {
            handler : function () {
                this.loadMessage()
            },
        }
    },
    methods : {
        async acceptJoinApply(mid, idx){
            const { data } = await api_organization_accept_apply(mid)
            if(!data){
                openErrorMessageBox('错误', '请检查网络情况')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.messages[idx].r_info.status = 1
                }
            }
        },
        async rejectJoinApply(mid, idx){
            const { data } = await api_organization_reject_apply(mid)
            if(!data){
                openErrorMessageBox('错误', '请检查网络情况')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.messages[idx].r_info.status = -1
                }
            }
        },
        async loadMessage(){
            const { data } = await api_message_system_list(this.page, 10)
            if(!data){
                openErrorMessageBox('错误', '请检查网络情况')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.messages = data['data']
                }
            }
        },
        getMessageFromText(type){
            return getMessageFromText(type)
        }
    },
    mounted(){
        this.loadMessage()
    }
}
</script>

<style>

</style>