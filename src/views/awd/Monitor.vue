<template>
    <v-container>
        <v-row>
            <v-col :cols="12">
                <v-textarea label="公告" outlined placeholder="编辑新公告" v-model="boardcast"></v-textarea>
                <v-btn color="primary" @click="commitBoardcast">发布</v-btn>
            </v-col>
            <v-col :cols="9">
                <v-alert type="info" border="left">
                    态势感知 For {{ game.name }}
                </v-alert>
                <div>
                    <v-row>
                        <v-col :cols="6" :sm="6" :md="4" :lg="4" :xl="3" v-for="(i, k) in containers" :key="k">
                            <v-card>
                                <v-card-title>
                                    <v-icon>mdi-account-group</v-icon>
                                    <span class="ml-2">{{ i.inspect_subject.name }} for team {{ i.container.team_id }}</span>
                                </v-card-title>
                                <v-card-text>
                                    上次flag刷新时间：{{ new Date( i.container.last_update * 1000) }}
                                    <br>
                                    <v-divider class="pb5"></v-divider>
                                    靶机状态：
                                    <v-chip v-if="i.inspect_container.host_port != 'none'" small color="primary">运行中</v-chip>
                                    <v-chip v-else small color="red" dark>已停止</v-chip>
                                    <br>
                                    <div class="pb5"></div>
                                    <v-divider class="pb5"></v-divider>
                                    端口映射：{{ i.inspect_container.host_port }}
                                    <br>
                                    <v-divider class="pb5"></v-divider>
                                    CPU占用：
                                    <v-progress-circular
                                        :value="i.inspect_container.cpu_usage"
                                        :size="50"
                                        :width="3"
                                        color="primary"
                                        class="pb5"
                                    >
                                        {{ i.inspect_container.cpu_usage.toFixed(2) }}%
                                    </v-progress-circular>
                                     \ 内存占用：
                                    <v-progress-circular
                                        :value="i.inspect_container.memory_usage"
                                        :size="50"
                                        :width="2"
                                        color="primary"
                                        class="pb5"
                                    >
                                        {{ i.inspect_container.mem_usage.toFixed(2) }}%
                                    </v-progress-circular>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
            <v-col :cols="3">
                <div :style="{ height : rank_dialog_height + 'px' }">
                    <HorizontalBarCharts title="队伍" subtext="队伍列表（非排名）" :model="team_rank_list" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import {
    api_competition_awd_game_get,
    api_competition_awd_team_list,
    api_competition_awd_admin_list_containers,
    api_competition_awd_boardcast_commit
} from '../../interface/api'

import HorizontalBarCharts from '../../components/charts/HorizontalBarCharts.vue'

export default {
    components : { HorizontalBarCharts },
    data : () => ({
        game_id: 0,
        game: {
            name : '',
            description : ''
        },
        teams : [],
        containers : [],
        refresh_timer : null,
        boardcast : ''
    }),
    computed : {
        team_rank_list() {
            const teams = this.teams
            const sorted = teams.sort((a, b) => a.score - b.score)
            return {
                category : sorted.map(i => i.name),
                value : [sorted.map(i => i.score)]
            }
        },
        rank_dialog_height() {
            return this.teams.length * 100 + 200
        }
    },
    methods : {
        async loadGame() {
            const { data } = await api_competition_awd_game_get(this.game_id)
            if (data && data['res'] == 0) {
                this.game.description = data['data']['game']['description']
                this.game.name = data['data']['game']['name']
                // game is timestamp, need to convert to date and time
                openSuccessSnackbar('加载成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '获取比赛信息失败')
            }
        },
        async loadTeams() {
            const { data } = await api_competition_awd_team_list(this.game_id)
            if (data && data['res'] == 0) {
                this.teams = data['data']['list']
            } else {
                openErrorSnackbar(data ? data['err'] : '获取队伍信息失败')
            }
        },
        loadContainers() {
            api_competition_awd_admin_list_containers(this.game_id).then(({ data }) => {
                if (data && data['res'] == 0) {
                    this.containers = data['data']['List']
                } else {
                    openErrorSnackbar(data ? data['err'] : '获取容器信息失败')
                }
            })
        },
        async commitBoardcast() {
            const { data } = await api_competition_awd_boardcast_commit(this.game_id, this.boardcast)
            if (data && data['res'] == 0) {
                openSuccessSnackbar('发送成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '发送失败')
            }
        }
    },
    mounted() {
        const game_id = parseInt(this.$route.params.game_id);
        if (game_id) {
            this.game_id = game_id
            this.loadGame()
            this.loadTeams()
            this.loadContainers()


            this.refresh_timer = setInterval(() => {
                this.loadTeams()
                this.loadContainers()
            }, 5000)

        } else {
            this.$router.push('/awd/list')
        }
    },
    beforeDestroy() {
        clearInterval(this.refresh_timer)
    }
}
</script>

<style>

</style>