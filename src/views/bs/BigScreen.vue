<template>
    <div class="defender-page">
        <div class="title">
            {{ game.title }}
        </div>
        <div class="container">
            <div class="attack">
                <div class="mini-title text-white text-right padding-10 text-bold">
                    Team Ranking 团队排名
                </div>
                <div class="margin-20">
                    <div class="team-bottom" v-for="team, i in statistics.rank.slice(0, 2)" :key="i">
                        <v-row style="position: relative">
                            <v-col :cols="6">
                                <div class="text-white text-bold padding-10 margin-20">
                                    <span class="text-score"> No.{{ i + 1}} </span> - <span class="text-primary"> {{ team.team_name }} </span>
                                </div>
                            </v-col>
                            <v-col :cols="6">
                                <div class="text-right text-white padding-10 margin-20 text-score">{{ team.team_score }}</div>
                            </v-col>
                            <v-col :cols="12" style="position: absolute; bottom: 20px">
                                <v-progress-linear
                                    :value="team.team_score * 100 / statistics_max_team_score"
                                    :height="10"
                                    stream
                                    buffer-value="0"
                                ></v-progress-linear>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="margin-10 back-shadow padding-20" style="width: 90%; height: 300px; margin-top: 50px;" v-if="statistics.rank.length < 6">
                        <v-row>
                            <v-col :cols="6">
                                <div class="text-center">
                                    <div class="text-primary">攻击次数</div>
                                    <div class="text-white text-score">
                                        {{ statistics_total_commits }} 次
                                    </div>
                                </div>
                            </v-col>
                            <v-col :cols="6">
                                <div class="text-center">
                                    <div class="text-primary">成功次数</div>
                                    <div class="text-white text-score">
                                        {{ statistics_success_commits }} 次
                                    </div>
                                </div>
                            </v-col>
                            <v-col :cols="12">
                                <div class="radar"></div>
                            </v-col>
                            <v-col :cols="12">
                                <div class="text-center text-primary" style="font-size: 24px;">
                                    {{ is_end ? '攻击结束' : 'ATTACKING! 攻击中！' }}
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="team-bottom" v-for="team, i in statistics.rank.slice(2, 6)" :key="i">
                        <v-row style="position: relative">
                            <v-col :cols="6">
                                <div class="text-white text-bold padding-10 margin-20">
                                    <span class="text-score"> No.{{ i + 3 }} </span> - <span class="text-primary"> {{ team.team_name }} </span>
                                </div>
                            </v-col>
                            <v-col :cols="6">
                                <div class="text-right text-white padding-10 margin-20 text-score">{{ team.team_score }}</div>
                            </v-col>
                            <v-col :cols="12" style="position: absolute; bottom: 20px">
                                <v-progress-linear
                                    :value="team.team_score * 100 / statistics_max_team_score"
                                    :height="10"
                                    stream
                                    buffer-value="0"
                                    :color="getColorByPercent(team.team_score * 100 / statistics_max_team_score)"
                                ></v-progress-linear>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </div>
            <div class="map">
                <div style="position: absolute; bottom: 90px; width: 100%;">
                </div>
            </div>
            <div class="defender">
                <div class="mini-title-reverse text-white text-left padding-10 text-bold">
                    题目情况 Question Situation
                </div>
                <v-row style="margin-top: 10px;">
                    <v-col :cols="1">
                        <v-divider vertical style="height: 50px;"></v-divider>
                    </v-col>
                    <v-col :cols="5">
                        <div class="text-left">
                            <div class="text-primary">flag提交次数</div>
                            <div class="text-white text-score">
                                {{ statistics_total_commits }} 次
                            </div>
                        </div>
                    </v-col>
                    <v-col :cols="1">
                        <v-divider vertical style="height: 50px;"></v-divider>
                    </v-col>
                    <v-col :cols="5">
                        <div class="text-left">
                            <div class="text-primary">已通过 <span class="text-white">{{ statistics_success_commits }}</span></div>
                            <div class="text-primary">未通过 <span class="text-white">{{ statistics_fail_commits }}</span></div>
                        </div>
                    </v-col>
                    <v-col :cols="12" class="margin-20">
                        <v-row>
                            <v-col :cols="3" v-for="item, i in statistics_top_4_subject" :key="i">
                                <v-progress-circular
                                    :size="100"
                                    :width="5"
                                    :color="getColorByPercent(item.commits * 100 / statistics_max_commits)"
                                    :value="item.commits * 100 / statistics_max_commits"
                                >
                                    <v-row>
                                        <v-col :cols="12" class="p0 text-center">
                                            <div class="text-primary">{{ item.subject_name }}</div> 
                                        </v-col>
                                        <v-col :cols="12" class="p0 text-center">
                                            <div class="text-score text-white">
                                                {{ item.commits }}
                                            </div>
                                        </v-col>
                                    </v-row>
                                    <p></p>  
                                </v-progress-circular>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <div class="mini-title-reverse text-white text-left padding-10 text-bold">
                    攻破情况 Breakdown Situation
                </div>
                <v-row>
                    <v-col :cols="6">
                        <div class="circle" style="width: 300px; height: 300px;">
                            <div class="text-white text-center text-score" style="line-height: 300px;">
                                {{ (statistics_success_commits / statistics_total_commits * 100).toFixed(2) }}%
                            </div>
                        </div>
                    </v-col>
                    <v-col :cols="6">
                        <v-row>
                            <v-col :cols="12" v-for="item, i in statistics_attack_rate" :key="i">
                                <v-row class="text-primary" style="margin: 5px;">
                                    <v-col :cols="6" class="text-left">
                                        {{ item.name }}
                                    </v-col>
                                    <v-col :cols="6" class="text-right">
                                        {{ item.rate }}%
                                    </v-col>
                                </v-row>
                                <v-progress-linear
                                    :value="item.rate"
                                    :height="10"
                                ></v-progress-linear>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <div class="mini-title-reverse text-white text-left padding-10 text-bold">
                    被攻破题目 Top 2
                </div>
                <v-row>
                    <v-col :cols="12">
                        <div class="team-bottom" v-for="subject, i in statistics_top_4_subject.slice(0,2)" :key="i">
                            <v-row>
                                <v-col :cols="6">
                                    <div class="text-white text-bold padding-10 margin-20">
                                        <span class="text-score"> No.{{ i + 1}} </span> - <span class="text-primary"> {{ subject.subject_name }} </span>
                                    </div>
                                </v-col>
                                <v-col :cols="6">
                                    <div class="text-right text-white padding-10 margin-20 text-score">{{ subject.commits }}</div>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </div>
    </div>
</template>

<script>
import { openErrorSnackbar, openInfoMessageBox } from '../../concat/bus'
import { 
    api_competition_awd_game_get,
    api_competition_awd_team_statistics
} from '../../interface/api'
import VueCookie from 'vue-cookie'

export default {
    data : () => ({
        game_id : '',
        game : {
            title : ''
        },
        is_end : false,
        statistics : {
            commits : {
                total: 0,
                accepted: 0,
                rejected: 0,
            },
            subjects : [],
            rank : []
        },
        timer : {
            refresh_page : null,
        }
    }),
    methods : {
        async loadGame() {
            const { data } = await api_competition_awd_game_get(this.game_id)
            if (data && data['res'] == 0) {
                this.game.title = data['data']['game']['name']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        async loadRank() {
            const { data } = await api_competition_awd_team_statistics(this.game_id)
            if (data && data['res'] == 0) {
                this.statistics.rank = data['data']['list'].sort((a, b) => b['team_score'] - a['team_score'])
                this.statistics.subjects = data['data']['subjects']
            } else {
                openErrorSnackbar(data ? data['err'] : '未知错误')
            }
        },
        getColorByPercent(value) {
            const colors = [
                { color: '#f56c6c', percentage: 20 },
                { color: '#e6a23c', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#6f7ad3', percentage: 100 },
            ]
            console.log(value)
            for (let i = 0; i < colors.length; i++) {
                if (value <= colors[i].percentage) {
                    return colors[i].color
                }
            }
        }
    },
    computed : {
        statistics_success_commits() {
            let commits = 0
            this.statistics.rank.forEach(item => {
                commits += item['commits_accepted']
            })
            return commits
        },
        statistics_fail_commits() {
            let commits = 0
            this.statistics.rank.forEach(item => {
                commits += item['commits_rejected']
            })
            return commits
        },
        statistics_total_commits() {
            let commits = 0
            this.statistics.rank.forEach(item => {
                commits += item['commits_total']
            })
            return commits
        },
        statistics_top_4_subject() {
            let x = this.statistics.subjects
            x.sort((a, b) => b['commits'] - a['commits'])
            if (x.length < 4) {
                // append empty
                let len = x.length
                for (let i = 0; i < 4 - len; i++) {
                    x.push({
                        subject_name : '暂无',
                        commits : 0
                    })
                }
            }
            return x.slice(0, 4)
        },
        statistics_max_commits() {
            let max = 0
            this.statistics.subjects.forEach(item => {
                if (item['commits'] > max) {
                    max = item['commits']
                }
            })
            return max
        },
        statistics_attack_rate() {
            let rates = []
            this.statistics.rank.forEach(item => {
                rates.push({
                    name : item['team_name'],
                    rate : item['commits_accepted'] / item['commits_total'] * 100
                })
            })
            return rates.sort((a, b) => b - a).slice(0, 3)
        },
        statistics_max_team_score() {
            let max = 0
            this.statistics.rank.forEach(item => {
                if (item['team_score'] > max) {
                    max = item['team_score']
                }
            })
            return max
        }
    },
    async mounted() {
        // get window width and height
        // check if user has already changed this page
        const mark = VueCookie.get('awd-page-init')
        if (mark != 'marked') {
            await openInfoMessageBox('提示', '系统检测到这是您第一次访问该页面，请尝试按住CTRL键随后调整滚轮使得页面缩放到合适的大小！或者点击浏览器设置找到“缩放”选项调整到合适大小，点击确定以确保下次不会再次弹窗')
            VueCookie.set('awd-page-init', 'marked')
        }

        this.game_id = this.$route.params.game_id
        if (!parseInt(this.game_id)) {
            this.$router.back()
        } else {

            this.loadGame()
            this.loadRank()
            this.timer.refresh_page = setInterval(() => {
                this.loadGame()
                this.loadRank()
            }, 100000)
        }
    },
    destroyed() {
        clearInterval(this.timer.refresh_page)
    }
}

</script>


<style lang="scss" scoped>
* {
    font-family: 'Microsoft YaHei';
}
@font-face {
    font-family: 'Digial-7';
    src: url('./assets/digital-7.ttf') format('truetype');
}

.text-primary {
    color: #409eff;
}

.text-deep-primary {
    color: #3a8ee6;
}

.text-white {
    color: #fff;
}

.padding-20 {
    padding: 20px;
}

.padding-10 {
    padding: 10px;
}

.padding-left-10 {
    padding-left: 10px;
}

.padding-left-20 {
    padding-left: 20px;
}

.padding-right-10 {
    padding-right: 10px;
}

.margin-10 {
    margin: 10px;
}

.margin-20 {
    margin: 20px;
}

.text-bold {
    font-weight: 600;
}

.text-score {
    font-size: 28px;
}

div, span {
    font-family: 'Digial-7';
}

.mini-title {
    background-image: url('./assets/mintitle.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.mini-title-reverse {
    background-image: url('./assets/mintitle-reverse.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.team-bottom {
    background-image: url('./assets/linx.png');
    background-size: 100% 20px;
    background-repeat: no-repeat;
    background-position: bottom;
    padding-bottom: 5px;
}

.back-shadow {
    background-image: url('./assets/back-shadow.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.circle {
    background-image: url('./assets/progress_circle.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
}

.text-left {
    text-align: left;
}

.defender-page {
    width: 100%;
    padding: 20px;
    height: 100vh;
    background-image: url('https://yeuoly.oss-cn-beijing.aliyuncs.com/irinactf/upload/2023/03/25/36a9a9436967de422435c5ea2bf62c82.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .radar {
        margin: 0 auto;
        width: calc(8em);
        height: calc(8em);
        font-size: 28px;
        position: relative;
        background: 
            linear-gradient(
                90deg,
                transparent 49.75%,
                rgb(0, 40, 100) 49.75%,
                rgb(0, 27, 100) 50.25%,
                transparent 50.25%),
            linear-gradient(
                transparent 49.75%,
                rgb(0, 40, 100) 49.75%,
                rgb(0, 27, 100) 50.25%,
                transparent 50.25%),
            repeating-radial-gradient(
                transparent 0, 
                transparent 0.95em, 
                rgb(0, 77, 100) 49.75%,
                rgb(0, 60, 100) 50.25%,);
        border-radius: 50%;
    }

    .radar::before {
        content: '';
        position: absolute;
        width: calc(6.5em / 2);
        height: calc(6.5em / 2);
        top: calc(1.5em / 2);
        left: calc(1.5em / 2);
        /*border: 1px solid white;*/
        background: linear-gradient(
                45deg,
                rgba(0, 0, 0, 0) 50%,
                rgba(0, 192, 0, 1) 100%
            );
        border-radius: 100% 0 0 0;
        animation: 
        scaning 5s linear infinite;
        transform-origin: 100% 100%;
    }

    @keyframes scaning {
        to {
            transform: rotate(360deg);
        }
    }

    .title {
        width: 100%;
        height: 5%;
        color: #fff;
        font-size: 30px;
        text-align: center;
        font-weight: 600;
        background-image: url('./assets/defender-title.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .container {
        width: 100%;
        height: 95%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .attack {
            width: 30%;
            height: 100%;
            padding: 10px;
        }

        .map {
            width: 40%;
            height: 100%;
            padding: 10px;
            position: relative;
        }

        .defender {
            width: 30%;
            height: 100%;
            padding: 10px;
        }
    }
}
</style>