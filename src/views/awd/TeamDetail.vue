<template>
    <v-container>
        <v-card class="px5 py5">
            <v-row>
                <v-col :cols="12">
                    <h3 class="text-center">
                        {{ game_title }} - {{ team_info.name }}
                    </h3>
                </v-col>
                <v-col :cols="12">
                    <v-alert type="success">
                        队员得分排名
                    </v-alert>
                    <div style="height: 400px" class="px4 py4">
                        <HorizontalBarCharts title="队员排名" subtext="实时排名统计" :model="member_rank" />
                    </div>
                </v-col>
                <v-col :cols="12">
                    <v-alert type="info">
                        重置初始密码（请不要使用弱密码）
                    </v-alert>
                    <v-text-field
                        v-model="password.password"
                        label="初始密码"
                        :append-icon="password.show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="password.show ? 'text' : 'password'"
                        @click:append="password.show = !password.show"
                    ></v-text-field>
                    <v-btn color="primary" @click="resetPassword">重置</v-btn>
                    <div class="px4 py4">
                        <div v-for="log in password.logs" :key="log.id">
                            {{ new Date(log.create_at * 1000).toLocaleString() }} - 密码重置为 {{ log.username }}:{{ log.password }}
                        </div>
                    </div>
                </v-col>
                <v-col :cols="12">
                    <v-alert type="info">
                        进入题目环境
                    </v-alert>
                </v-col>
                <v-col :cols="6">
                    <div class="team_detail-enter px3 py3 clickable">
                        <div class="team_detail-player">
                            <div class="team_detail-mask" @click="senso">参赛环境</div>
                        </div>
                    </div>
                </v-col>
                <v-col :cols="6">
                    <div class="team_detail-enter px3 py3 clickable">
                        <div class="team_detail-controller">
                            <div class="team_detail-mask" @click="pilot">大屏幕</div>
                        </div>
                    </div>
                </v-col>
                <v-col :cols="12">
                    <v-alert type="success">
                        队员列表
                    </v-alert>
                </v-col>
                <v-col :sm="6" :md="4" :lg="4" :xl="3" 
                    v-for="member in team_info.members"
                    :key="member.id"
                >
                    <NormalInfoCardVue
                        :title="member.username + ' (' + member.uid + ')' + ( (  member.flag & 4 ) == 4 ? ' 队长' : ' 队员')"
                        :content="member.score.toString()"
                    />
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
import NormalInfoCardVue from '../../components/common/NormalInfoCard.vue'
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import { 
    api_competition_awd_team_get_info,
    api_competition_awd_team_get_members,
    api_competition_awd_game_get,
    api_competition_awd_team_sshpassword_reset,
    api_competition_awd_team_sshpassword_logs
} from '../../interface/api'

import HorizontalBarCharts from '../../components/charts/HorizontalBarCharts.vue'

export default {
    components : {
        NormalInfoCardVue,
        HorizontalBarCharts
    },
    data : () => ({
        game_id : 0,
        game_title : '',
        team_info : {
            id : 0,
            members : [],
            name : '',
            score : 0,
        },
        password : {
            logs : [],
            password : '',
            show : false,
            log_show : false,
        }
    }),
    computed : {
        member_rank() {
            return {
                category : this.team_info.members.map(e => e.username),
                value : [this.team_info.members.map(e => e.score)],
            }
        }
    },
    methods : {
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
        async resetPassword() {
            const { data } = await api_competition_awd_team_sshpassword_reset(this.game_id, 'ctf', this.password.password)
            if (data && data['res'] == 0) {
                this.password.password = data['data']['password']
                this.loadPasswordLogs()
                openSuccessSnackbar('重置成功')
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadPasswordLogs() {
            const { data } = await api_competition_awd_team_sshpassword_logs(this.game_id, 'ctf', this.team_info.id)
            if (data && data['res'] == 0) {
                this.password.logs = data['data']['list']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        senso() {
            this.$router.push(`/awd/senso/${this.game_id}`)
        },
        pilot() {
            this.$router.push(`/bs/awd/${this.game_id}`)
        }
    },
    async mounted() {
        this.game_id = this.$route.params.game_id
        if (!parseInt(this.game_id)) {
            this.$router.back()
        } else {
            this.loadGame()
            await this.loadTeam()
            this.loadMembers()
            this.loadPasswordLogs()
        }
    }
}
</script>

<style lang="scss">
    .team_detail-enter {
        height: 300px;
    }

    .team_detail-player {
        background-image: url('../../assets/hackerplace.png');
        background-size: cover;
        height: 100%;
        border-radius: 10px;
    }


    .team_detail-controller {
        background-image: url('../../assets/pilot.jpg');
        background-size: cover;
        height: 100%;
        border-radius: 10px;
    }

    .team_detail-mask {
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        line-height: 300px;
        text-align: center;
        color: white;
        font-size: 20px;
        border-radius: 10px;
        overflow: hidden;
    }
</style>