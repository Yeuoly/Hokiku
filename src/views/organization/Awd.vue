<template>
    <v-container>
        <v-card-title>
            AWD(Attack With Defense)
        </v-card-title>
        <v-card-text>
            <div class="pb3">
                我的AWD Token : {{ my_token }}
            </div>
            <v-row>
                <v-col :cols="12" v-for="(i, k) in games" :key="k" class="clickable">
                    <v-divider class="pb3"></v-divider>
                    <div class="left px5 py5">
                        <v-icon size="80" color="primary">
                            mdi-shield-key
                        </v-icon>
                    </div>
                    <div class="left">
                        <h3 class="pb3 text-primary" @click="join(i.id)">
                            {{ ((i.flag & 16) == 16) ? '团队赛' : '公开赛' }} - {{ i.name }}</h3>
                        <div class="pb3">
                            <v-chip dark color="primary" class="mr2" 
                                v-if="new Date().getTime() > i.start_time * 1000 && new Date().getTime() < i.end_time * 1000"
                            >
                                <v-icon>
                                    mdi-clock
                                </v-icon>
                                <span class="underline px2">
                                    <span >
                                        已开始
                                        {{ getDuration(i.start_time) }}
                                    </span>
                                </span>
                            </v-chip>
                            <v-chip dark color="red" class="mr2" 
                                v-if="new Date().getTime() > i.end_time * 1000"
                            >
                                <v-icon>
                                    mdi-clock
                                </v-icon>
                                <span class="underline px2">
                                    <span >
                                        已结束
                                        {{ getDuration(i.end_time) }}
                                    </span>
                                </span>
                            </v-chip>
                            <v-chip dark color="blue" class="mr2" 
                                v-if="new Date().getTime() < i.start_time * 1000"
                            >
                                <v-icon>
                                    mdi-clock
                                </v-icon>
                                <span class="underline px2">
                                    <span>
                                        距开始
                                        {{ getDuration(i.start_time) }}
                                    </span>
                                </span>
                            </v-chip>
                            <v-chip dark color="orange" class="mr2">
                                <v-icon>
                                    mdi-network
                                </v-icon>
                                {{ i.subnet }}
                            </v-chip>
                            <v-chip dark color="green" class="mr2">
                                <v-icon class="mx2">
                                    mdi-account-multiple
                                </v-icon>
                                {{ i.teams }}
                                <v-icon class="mx2">
                                    mdi-account
                                </v-icon>
                                {{ i.members }}
                            </v-chip>
                        </div>
                        <div class="pb3">
                            {{ new Date(i.start_time * 1000).toLocaleString() }} - {{ new Date(i.end_time * 1000).toLocaleString() }}
                        </div>
                        <div class="pb3">{{ i.description }}</div>
                    </div>
                        <div class="w100">
                            <div class="right">
                                <v-btn 
                                    color="primary" 
                                    @click="join(i.id)"
                                    :disabled="new Date().getTime() > i.start_time * 1000"
                                >报名</v-btn>
                                <v-btn color="green" dark  @click="senso(i.id)">进入</v-btn>
                            </div>
                        </div>
                </v-col>
                <v-col :cols="12">
                    <v-divider></v-divider>
                </v-col>
            </v-row>
        </v-card-text>
        <v-dialog v-model="join_dialog" width="800">
            <v-card>
                <v-card-title>
                    报名
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col :cols="12" v-if="current_game.is_invite">
                            <v-text-field v-model="signin_code" label="邀请码"></v-text-field>
                        </v-col>
                        <v-col :cols="6">
                            <v-text-field v-model="leader_name" label="队长名称"></v-text-field>
                        </v-col>
                        <v-col :cols="6">
                            <v-text-field v-model="team_name" label="队伍名称"></v-text-field>
                        </v-col>
                    </v-row>
                    队员：
                    <v-row>
                        <v-col :cols="12" v-for="(i, k) in players" :key="k">
                            <v-row>
                                <v-col :cols="3">
                                    <v-text-field v-model.trim="i.name" label="名称"></v-text-field>
                                </v-col>
                                <v-col :cols="1">
                                    <v-text-field v-model.number="i.uid" label="uid"></v-text-field>
                                </v-col>
                                <v-col :cols="4">
                                    <v-text-field v-model.trim="i.token" label="token"></v-text-field>
                                </v-col>
                                <v-col :cols="3">
                                    <v-text-field v-model.trim="i.email" label="邮箱"></v-text-field>
                                </v-col>
                                <v-col :cols="1">
                                    <v-btn small text color="red" class="mt4">
                                        <v-icon @click="players.splice(k, 1)">mdi-delete</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="primary" dark @click="commit">提交</v-btn>
                    <v-btn color="green" dark @click="appendPlayer">添加队员</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { openErrorMessageBox, openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import { 
    api_competition_awd_player_get_token,
    api_competition_awd_team_create
} from '../../interface/api'
import {
    api_awd_game_team_list
} from '../../interface/awd'

export default {
    data : () => ({
        games : [],
        my_token : '',
        players : [],
        join_game_id : 0,
        join_dialog : false,
        leader_name : '',
        team_name : '',
        signin_code : '',
        current_game : {
            is_invite : false,
        },
        gid : 0
    }),
    methods : {
        join(game_id) {
            this.join_dialog = true
            this.join_game_id = game_id

            const game = this.games.find(i => i.id == game_id)
            this.current_game.is_invite = (game.flag & 32) == 32
        },
        appendPlayer() {
            if (this.players.length >= 10) {
                openErrorMessageBox('错误', '队员不能超过10个')
                return
            }
            this.players.push({
                name : '',
                uid : 0,
                token : '',
                email : ''
            })
        },
        senso(game_id) {
            this.$router.push(`/awd/team/${game_id}`)
        },
        getDuration(time) {
            const now = new Date().getTime()
            const start = new Date(time * 1000).getTime()
            const duration = Math.abs (start - now)

            const day = Math.floor(duration / (24 * 60 * 60 * 1000))
            const hour = Math.floor((duration - day * 24 * 60 * 60 * 1000) / (60 * 60 * 1000))
            const minute = Math.floor((duration - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000) / (60 * 1000))
            const second = Math.floor((duration - day * 24 * 60 * 60 * 1000 - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000)

            let res = ''
            if (day > 0) {
                res += `${day}天`
            }
            if (hour > 0) {
                res += `${hour}小时`
            }
            if (minute > 0) {
                res += `${minute}分钟`
            }
            if (second > 0) {
                res += `${second}秒`
            }

            return res
        },
        async getGames() {
            let { data } = await api_awd_game_team_list(this.gid)
            if (data && data['res'] == 0) {
                this.games = data['data']['list']
            } else {
                openErrorMessageBox(data ? data['err'] : '未知错误')
            }
        },
        async getMyToken() {
            let { data } = await api_competition_awd_player_get_token()
            if (data && data['res'] == 0) {
                this.my_token = data['data']['token']
            } else {
                openErrorMessageBox(data ? data['err'] : '未知错误')
            }
        },
        async commit() {
            const { data } = await api_competition_awd_team_create(
                this.join_game_id,
                this.team_name,
                this.leader_name,
                JSON.stringify(this.players),
                this.signin_code
            )
            if (data && data['res'] == 0) {
                openSuccessSnackbar('报名成功')
                this.join_dialog = false
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        }
    },
    mounted() {
        const gid = parseInt(this.$route.params.gid)
        if (gid) {
            this.gid = gid
            this.getGames()
            this.getMyToken()
        } else {
            this.$router.back()
        }
    }
}
</script>

<style>

</style>