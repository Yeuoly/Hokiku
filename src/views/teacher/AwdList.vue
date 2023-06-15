<template>
    <v-container>
        <v-card-title>
            AWD(Attack With Defense)
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col :cols="12" v-for="(i, k) in games" :key="k" class="clickable">
                    <v-divider class="pb3"></v-divider>
                    <div class="left px5 py5">
                        <v-icon size="80" color="primary">
                            mdi-shield-key
                        </v-icon>
                    </div>
                    <div class="left">
                        <h3 class="pb3">{{ i.name }}</h3>
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
                                    @click="editor(i.id)"
                                >编辑</v-btn>
                                <v-btn 
                                    color="primary" 
                                    @click="toChecker(i.id)"
                                >Checker</v-btn>
                                <v-btn color="green" dark  @click="senso(i.id)">进入</v-btn>
                            </div>
                        </div>
                </v-col>
                <v-col :cols="12">
                    <v-divider></v-divider>
                </v-col>
            </v-row>
        </v-card-text>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { 
    api_awd_game_team_list
} from '../../interface/awd'

export default {
    data : () => ({
        games : [],
        gid : 0
    }),
    methods : {
        senso(game_id) {
            this.$router.push(`/awd/team/${game_id}`)
        },
        editor(game_id) {
            this.$router.push(`/awd/editor/${game_id}`)
        },
        toChecker(game_id) {
            this.$router.push(`/awd/checker/${game_id}`)
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
    },
    mounted() {
        const gid = parseInt(this.$route.params.gid)
        if (gid) {
            this.gid = gid
            this.getGames()
        } else {
            this.$router.back()
        }
    }
}
</script>

<style>

</style>