<template>
    <div>
        <!-- list of games -->
        <v-list>
            <v-list-item
                class="px5 pb3"
                v-for="(i, k) in games"
                :key="k" 
                link 
            >
                <v-layout>
                    <v-col cols="3">
                        <v-img :src="i.cover" contain lazy-src="https://yeuoly.oss-cn-beijing.aliyuncs.com/iotshield/upload/2022/08/08/6321d5419bcb8546fa0247c611dff1f8.jpg">
                            <template v-slot:placeholder>
                                <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                                >
                                    <v-progress-circular
                                        indeterminate
                                        color="grey lighten-5"
                                    ></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                    </v-col>
                    <v-col cols="6">
                        <v-card-title>
                            {{ i.title }}
                        </v-card-title>
                        <v-card-text>
                            报名时间：{{ new Date(i.signup_start_time * 1000).formatDate('Y-M-D h:m:s') }} ~ {{ new Date(i.signup_end_time * 1000).formatDate('Y-M-D h:m:s') }} <br>
                            比赛时间：{{ new Date(i.game_start_time * 1000).formatDate('Y-M-D h:m:s') }} ~ {{ new Date(i.game_end_time * 1000).formatDate('Y-M-D h:m:s') }} <br>
                        </v-card-text>
                    </v-col>
                    <v-col cols="3">
                        <v-btn class="mr2" style="float: right"
                            @click="toDetail(i)"
                        >
                            进入详情页
                        </v-btn>
                        <v-btn color="primary" style="float: right" @click="openSignUpDialog(i.id)">
                            报名
                        </v-btn>
                        <br>
                    </v-col>
                </v-layout>
            </v-list-item>
        </v-list>
        <v-dialog v-model="signup_dialog.show" max-width="800">
            <v-card>
                <v-toolbar color="primary">
                    <v-toolbar-title class="text-white">
                        填写报名表格
                    </v-toolbar-title>
                </v-toolbar>
                <div class="px5 py2">
                    <v-text-field
                        v-model="signup_dialog.nickname"
                        label="以什么ID参赛"
                    ></v-text-field>
                    <v-btn color="primary" @click="signup">提交</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_competition_game_player_list, api_competition_signup } from '../../interface/api'

export default {
    data : () => ({
        games : [],
        signup_dialog : {
            show : false,
            game_id : 0,
            nickname : ''
        }
    }),
    methods : {
        async getPlayers(){
            const { data } = await api_competition_game_player_list()
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                this.games = data['data']
            }
        },
        async openSignUpDialog(game_id) {
            this.signup_dialog.show = true
            this.signup_dialog.game_id = game_id,
            this.signup_dialog.nickname = this.$store.getters.getUserName
        },
        async signup() {
            const { data } = await api_competition_signup(this.signup_dialog.game_id, this.signup_dialog.nickname)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if (data['res'] == 0) {
                    this.signup_dialog.show = false
                    openInfoMessageBox('提示', '报名成功')
                } else {
                    openErrorMessageBox('错误', data['err'])
                }
            }
        },
        toDetail(game) {
            if(game.page_url.startsWith('http')) {
                window.open(game.url_page)
            } else {
                this.$router.push(`/game/detail/${game.id}`)
            }
        }
    },
    mounted(){
        this.getPlayers()
    }
}
</script>

<style>

</style>