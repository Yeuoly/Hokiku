<template>
    <div class="irina-awd">
        <v-container>
            <v-card color="transparent">
                <v-card-text>
                    <v-row>
                        <v-col :cols="12" class="my5" style="background-color: rgba(255,255,255,.07);;">
                            <h2 class="py3 text-white ml5 text-center">
                                {{ game_title }}
                            </h2>
                        </v-col>
                        <v-col :cols="3" style="background-color: rgba(255,255,255,.07);">
                            <div style="background-color: rgba(0,0,0,.2);">
                                <div class="text-primary mx5 text-16 py4">
                                    队内分数
                                </div>
                                <div style="height: 350px" class="px4 py4 text-white">
                                    <div class="senso-player-frame">
                                        <div v-for="(i, k) in team_info.members" :key="k" class="mb5 pb5">
                                            <v-row>
                                                <div class="pl5 pr1">
                                                    <v-progress-circular
                                                        :value="(i.scroe / team_info.score) * 100"
                                                        :size="60"
                                                        :width="3"
                                                        color="rgb(145,221,255)"
                                                        class="ma-2"
                                                    >
                                                        {{ i.score }}Pt
                                                    </v-progress-circular>
                                                </div>
                                                <div class="pr3">
                                                    <div style="line-height: 68px; font-size: 18px;text-decoration: underline;" class="font-black">
                                                        {{i.username}} <v-chip v-if="(i.flag & 4) == 4" color="primary" small>队长</v-chip>
                                                    </div>
                                                </div>
                                            </v-row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col :cols="9" style="background-color: rgba(255,255,255,.07);">
                            <div style="background-color: rgba(0,0,0,.2);">
                                <div style="height: 395px" class="px4 py4">
                                    <HorizontalBarCharts title="队伍排名" subtext="实时排名统计" :model="team_rank" />
                                </div>
                            </div>
                        </v-col>
                        <v-col :cols="12" style="background-color: rgba(255,255,255,.07);">
                            <v-text-field dark v-model="flag" label="提交flag">
                                <template v-slot:append>
                                    <v-btn @click="commitFlag" color="primary" small>提交</v-btn>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col :cols="3" style="background-color: rgba(255,255,255,.07);" class="mt5">
                            <div class='boardcast' style="background-color: rgba(0,0,0,.2)">
                                <div class="slider">
                                    <i class="iconfont">&#xe633;</i>
                                    <p class='content'>
                                        <span>{{ boardcast.latest }}</span>
                                    </p>
                                </div>
                                <div class="list">
                                    <span v-html="boardcast.list"></span>
                                </div>
                            </div>
                        </v-col>
                        <v-col :cols="9" style="background-color: rgba(255,255,255,.07);" class="mt5">
                            <div class="">
                                <v-row>
                                    <v-col :cols="6" :sm="6" :md="6" :lg="4" :xl="3" v-for="(i, k) in containers" :key="k">
                                        <v-card
                                            class="mx-auto clickable"
                                            max-width="344"
                                            outlined
                                            style="background-color: rgba(0,0,0,.2);"
                                            @click="openContainer(i.container.id)"
                                        >
                                            <v-card-title>
                                                <div>
                                                    <div class="headline text-white">{{ i.subject.name }} - {{ i.subject.attack_initial_score }}</div>
                                                </div>
                                                </v-card-title>
                                            <v-card-text class="text-white">
                                                {{ i.subject.comment }}
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-dialog v-model="current_container.dialog" width="600px">
                <v-card>
                    <v-card-title>
                        <div class="headline">{{ current_container.subject.name }}</div>
                    </v-card-title>
                    <v-card-text>
                        <div>
                            攻击初始分：{{ current_container.subject.attack_initial_score }}
                        </div>
                        <div>
                            已攻击队伍：{{ current_container.subject.attack_team_count }}
                        </div>
                        <div>
                            {{ current_container.subject.comment }}
                        </div>
                        <div>
                            开放IP及端口：{{ current_container.host_port }}
                        </div>
                        <v-divider></v-divider>
                        <div>
                            注：若题目开放SSH，对应IP与端口为上方开放IP及端口中的其中一个，默认密码见题目描述
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import { 
    api_competition_awd_team_get_info, 
    api_competition_awd_team_get_members,
    api_competition_awd_game_get,
    api_competition_awd_rank_team,
    api_competition_awd_team_get_containers,
    api_competition_awd_team_get_container,
    api_competition_awd_commit_flag,
    api_competition_awd_boardcast_list
} from '../../interface/api'

import HorizontalBarCharts from '../../components/charts/HorizontalBarCharts.vue'

export default {
    components : { HorizontalBarCharts },
    data : () => ({
        flag : '',
        teams : [],
        game_id : 0,
        game_title : '',
        team_info : {
            id : 0,
            members : [],
            name : '',
            score : 0,
        },
        containers : [],
        refresh_timer : null,
        current_container : {
            dialog : false,
            id : 0,
            subject : {
                name : '',
                attack_initial_score : 0,
                attack_team_count : 0,
                comment : '',
            },
            host_port : ''
        },
        boardcast : {
            latest : '暂无',
            list : ''
        }
    }),
    computed : {
        team_rank() {
            return {
                category : this.teams.map(e => e.name),
                value : [this.teams.map(e => e.score)],
            }
        }
    },
    methods : {
        openContainer(id) {
            this.current_container.id = id
            this.current_container.dialog = true
            this.loadContainer()
        },
        async commitFlag() {
            if (this.flag == '') {
                openErrorSnackbar('请输入flag')
                return
            }
            const { data } = await api_competition_awd_commit_flag(this.game_id, this.team_info.id, this.flag)
            if (data && data['res'] == 0) {
                openSuccessSnackbar('提交成功')
                this.flag = ''
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadTeam() {
            const { data } = await api_competition_awd_team_get_info(this.game_id)
            if (data && data['res'] == 0) {
                this.team_info.id = data['data']['team']['id']
                this.team_info.score = data['data']['team']['score']
                this.team_info.name = data['data']['team']['name']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadMembers() {
            const { data } = await api_competition_awd_team_get_members(this.game_id, this.team_info.id)
            if (data && data['res'] == 0) {
                this.team_info.members = data['data']['list']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadGame() {
            const { data } = await api_competition_awd_game_get(this.game_id)
            if (data && data['res'] == 0) {
                this.game_title = data['data']['game']['name']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadTeamRank() {
            const { data } = await api_competition_awd_rank_team(this.game_id, 1, 20, 'score')
            if (data && data['res'] == 0) {
                this.teams = data['data']['list']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadContainers() {
            const { data } = await api_competition_awd_team_get_containers(this.game_id)
            if (data && data['res'] == 0) {
                this.containers = data['data']['Containers']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadContainer() {
            const { data } = await api_competition_awd_team_get_container(this.game_id, this.current_container.id)
            if (data && data['res'] == 0) {
                this.current_container.subject.name = data['data']['subject']['name']
                this.current_container.subject.attack_initial_score = data['data']['subject']['attack_initial_score']
                this.current_container.subject.attack_team_count = data['data']['subject']['attack_resolved']
                this.current_container.subject.comment = data['data']['subject']['comment']
                this.current_container.host_port = data['data']['inspect_container']['host_port']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadBoardcast() {
            const { data } = await api_competition_awd_boardcast_list(this.game_id)
            if (data && data['res'] == 0) {
                this.boardcast.latest = data['data']['List'][0]['content']
                this.boardcast.list = data['data']['List'].slice(0, 20).map(e => e['content']).join('<br>')
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        }
    },
    async mounted() {
        const game_id = parseInt(this.$route.params.game_id)
        if (game_id) {
            this.game_id = game_id
            await this.loadGame()
            await this.loadTeam()
            await this.loadMembers()
            await this.loadTeamRank()
            await this.loadContainers()
            await this.loadBoardcast()
            this.refresh_timer = setInterval(() => {
                this.loadTeamRank()
                this.loadBoardcast()
            }, 30000)
        } else {
            openErrorSnackbar('错误')
        }
    },
    beforeDestroy() {
        if (this.refresh_timer) {
            clearInterval(this.refresh_timer)
        }
    }
}
</script>

<style lang="scss">
 @font-face {
    font-family: "iconfont"; /* Project id 2516453 */
    src: url("//at.alicdn.com/t/font_2516453_g6qjhhqblt9.woff2?t=1620545333370")
        format("woff2"),
        url("//at.alicdn.com/t/font_2516453_g6qjhhqblt9.woff?t=1620545333370")
        format("woff"),
        url("//at.alicdn.com/t/font_2516453_g6qjhhqblt9.ttf?t=1620545333370")
        format("truetype");
    }

    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }

    .boardcast {
        font-size: 16px;
        color: white;
        border-radius: 10px;
        box-sizing: border-box;

        .slider {
            height: 60px;
            padding: 0 20px;
            padding-top: 20px;
            display: flex;
            justify-content: flex-start;

            i {
                color: #4677ff;
                font-size: 20px;
                margin-right: 10px;
            }

            .content{
                flex: 1;
                overflow: hidden;
                span {
                    display: block;
                    width: auto;
                    white-space: nowrap;
                }
                margin-bottom: 0;

                span{
                    animation: marquee 30s linear infinite;
                    display: block;
                    width: auto;
                    white-space: nowrap;
                    padding-left: 105%;
                    padding-right: 120%;
                }
            }

        }

        .list {
            padding: 0 20px;
            padding-top: 20px;
            line-height: 30px;
            color: grey;
            padding-bottom: 20px;
        }
        width: 100%;
    }

      @keyframes marquee {
        0% {
        transform: translateX(0);
        }
        100% {
        transform: translateX(-100%);
        }
    }

    .irina-awd {
        background-image: url('../../assets/game-background.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: fixed;
    }

</style>