<template>
    <v-container>
        <v-card>
            <v-card-title>
                AWD Manager
            </v-card-title>
            <div class="py5 px5">
                <v-btn @click="createGame" color="primary">新建比赛</v-btn>
            </div>
            <v-row>
                <v-col :cols="12">
                    <v-data-table
                        :headers="game_headers"
                        :items="games"
                        :items-per-page="999999"
                        class="elevation-1"
                    >
                        <template v-slot:item.action="{ item }">
                            <v-btn
                                color="primary"
                                @click="editGame(item)"
                            >
                                编辑
                            </v-btn>
                            <v-btn
                                color="error"
                                @click="deleteGame(item)"
                            >
                                删除
                            </v-btn>
                            <v-btn
                                color="green"
                                @click="enterMonitor(item)"
                                dark
                            >
                                势态
                            </v-btn>
                        </template>
                        <template v-slot:item.start_time="{ item }">
                            {{ new Date(item.start_time * 1000).toLocaleString() }}
                        </template>
                        <template v-slot:item.end_time="{ item }">
                            {{ new Date(item.end_time * 1000).toLocaleString() }}
                        </template>
                        <template v-slot:item.flag="{ item }">
                            <v-chip color="green" dark v-if="IsGameStarted(item.flag)">已开始</v-chip>
                            <v-chip color="red" dark v-else-if="IsGameEnded(item.flag)">已结束</v-chip>
                            <v-chip color="blue" dark v-else>未开始</v-chip>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import { openErrorSnackbar } from '../../concat/bus'
import { api_competition_awd_game_list, api_competition_awd_game_delete } from '../../interface/api'

export default {
    data : () => ({
        game_headers : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '名称',
            value : 'name'
        }, {
            text : '描述',
            value : 'description'
        }, {
            text : '开始时间',
            value : 'start_time'
        }, {
            text : '结束时间',
            value : 'end_time'
        }, {
            text : '状态',
            value : 'flag'
        }, {
            text : '操作',
            value : 'action'
        }],
        games : []
    }),
    methods : {
        async getGames() {
            const { data } = await api_competition_awd_game_list()
            if (data && data['res'] == 0) {
                this.games = data['data']['list']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        createGame() {
            this.$router.push('/awd/editor/0')
        },
        editGame(game) {
            this.$router.push(`/awd/editor/${game.id}`)
        },
        enterMonitor(game) {
            this.$router.push(`/awd/monitor/${game.id}`)
        },
        IsGameStarted(flag) {
            return (flag & (1 << 2)) != 0
        },
        IsGameEnded(flag){
            return (flag & (1 << 3)) != 0
        },
        async deleteGame(game) {
            const { data } = await api_competition_awd_game_delete(game.id)
            if (data && data['res'] == 0) {
                this.getGames()
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        }
    },
    mounted() {
        this.getGames()
    }
}
</script>

<style>

</style>

