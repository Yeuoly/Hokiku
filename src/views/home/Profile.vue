<template>
    <v-row>
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
            <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
                <!-- coin info, like i owned 3.5 coins -->
                <NormalInfoCard 
                    title="可用金币"
                    :content="profile.coin.value.toString() + '￥'"
                />
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
                <!-- coin info, like i owned 3.5 coins -->
                <NormalInfoCard 
                    title="冻结金币"
                    :content="profile.coin.freeze.toString() + '￥'"
                />
            </v-col>
            <v-col cols="12">
                <v-divider></v-divider>
            </v-col>
            <v-col cols="12">
                <span class="text-grey text-14"> 储存空间: {{ percent_text }} </span>
                <v-progress-linear
                    :value="profile.resource.percent_space"
                ></v-progress-linear>
            </v-col>
        </v-row>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_user_profile } from '../../interface/api'
import { isAvaliableNameFormat, visitableMemberSpace } from '../../util/index'

import NormalInfoCard from '../../components/common/NormalInfoCard.vue'

export default {
    name : 'Profile',
    components : { NormalInfoCard },
    data : () => ({
        profile : {
            id: '',
            uid : 0,
            resource : {
                max_space : 0,
                current_space : 0,
                percent_space : 0,
            },
            coin : {
                value : 0,
                freeze : 0,
            }
        },
    }),
    watch : {
        'profile.resource.current_space' : {
            handler(){
                this.profile.resource.percent_space = 
                    ( this.profile.resource.current_space / this.profile.resource.max_space ) * 100
            },
        },
        'profile.resource.max_space' : {
            handler(){
                this.profile.resource.percent_space = 
                    ( this.profile.resource.current_space / this.profile.resource.max_space ) * 100
            },
        }
    },
    methods : {
        applyChangeName(){
            /* TODO */
        },
        
        async loadProfile(){
            const { data } = await api_user_profile()
            if(!data){
                openErrorMessageBox('错误', '获取个人信息失败')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else if(data['data']){
                    this.profile.resource.max_space = data['data']['r_resource']['max']
                    this.profile.resource.current_space = data['data']['r_resource']['current']
                    this.profile.coin.value = data['data']['r_trade_coin']['value']
                    this.profile.coin.freeze = data['data']['r_trade_coin']['freeze']
                }
            }
        }
    },
    computed : {
        isNameAvaliable(){
            return this.$store.getters.getUserName != this.profile.id
                && isAvaliableNameFormat(this.profile.id)
        },
        percent_text(){
            return `${ visitableMemberSpace(this.profile.resource.current_space) } \\ ${ visitableMemberSpace(this.profile.resource.max_space) }`
        }
    },
    mounted(){
        this.profile.id = this.$store.getters.getUserName
        this.profile.uid = this.$store.getters.getUserUid

        this.loadProfile()
    }
}
</script>

<style scoped>

</style>