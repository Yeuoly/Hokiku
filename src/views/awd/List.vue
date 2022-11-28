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
                    <h3 class="pb3">{{ i.name }}</h3>
                    <div class="pb3">
                        <v-chip dark color="green">
                            <v-icon>
                                mdi-calendar
                            </v-icon>
                        </v-chip>
                        {{ new Date(i.start_time * 1000).toLocaleString() }} - {{ new Date(i.end_time * 1000).toLocaleString() }}
                        <v-chip dark color="orange">
                            <v-icon>
                                mdi-network
                            </v-icon>
                        </v-chip>
                        127.0.0.0/24
                    </div>
                    <div class="pb3">简介：{{ i.description }}</div>
                    <v-btn color="primary" small @click="join(i.id)">报名</v-btn>
                    <v-btn color="green" dark small @click="senso(i.id)">进入</v-btn>
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
                                    <v-text-field v-model="i.name" label="名称"></v-text-field>
                                </v-col>
                                <v-col :cols="1">
                                    <v-text-field v-model.number="i.uid" label="uid"></v-text-field>
                                </v-col>
                                <v-col :cols="4">
                                    <v-text-field v-model="i.token" label="token"></v-text-field>
                                </v-col>
                                <v-col :cols="4">
                                    <v-text-field v-model="i.email" label="邮箱"></v-text-field>
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
    api_competition_awd_game_list,
    api_competition_awd_player_get_token,
    api_competition_awd_team_create
} from '../../interface/api'

export default {
    data : () => ({
        games : [],
        my_token : '',
        players : [],
        join_game_id : 0,
        join_dialog : false,
        leader_name : '',
        team_name : ''
    }),
    methods : {
        join(game_id) {
            this.join_dialog = true
            this.join_game_id = game_id
        },
        appendPlayer() {
            if (this.players.length >= 4) {
                openErrorMessageBox('错误', '队员不能超过4个')
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
            this.$router.push(`/awd/senso/${game_id}`)
        },
        async getGames() {
            let { data } = await api_competition_awd_game_list()
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
                JSON.stringify(this.players)
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
        this.getGames()
        this.getMyToken()
    }
}
</script>

<style>

</style>