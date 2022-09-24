<template>
    <div>
        <div v-html="html_content"></div>
        <v-container>
            <v-card v-if="competition" class="pb5">
                <v-card-title class="text-center justify-center py-6">
                    <h1 class="font-weight-bold text-h4 basil--text">
                        {{ competition.title }}
                    </h1>
                </v-card-title>
                <div class="px5 py5">
                    <p style="text-align: center">
                        <span style="float: left">
                            进行时间：{{ continue_time }}
                        </span>
                        <span style="float: right">
                            剩余时间：{{ last_time }}
                        </span>
                        {{ competition_process.status }}
                    </p>
                    <v-progress-linear
                        :buffer-value="process_percent"
                        :value="process_percent"
                        stream
                        color="orange"
                    ></v-progress-linear>
                    <p></p>

                    <!-- Message boardcast -->
                    <v-card-text>
                        <v-row>
                            <v-col :cols="6">
                                <v-card-text>
                                    <div class="game-message">
                                        【竞赛公示栏】 <br>
                                        1. 请在竞赛开始前，仔细阅读竞赛规则。 <br>
                                        2. 禁止一切作弊行为，一经发现，取消竞赛资格。 <br>
                                        3. 允许查阅资料，但请以自己的思考为主，保持最少的交流。 <br>
                                        4. 竞赛结束后，将会公布答案，以供大家学习。 <br>
                                        5. 禁止交换flag，一经发现，取消竞赛资格。 <br>
                                        6. 选手解题动态将会在右边动态中实时更新。 <br>
                                        7. 请在竞赛结束后，请将writeup（详细解题过程）以PDF或者WORD的形式在24小时内提交至邮箱admin@srmxy.cn，附件命名为【参赛ID WRITEUP】.docx/pdf，我们会审核writeup，如果writeup质量较高，我们会给予积分奖励，对于不合格的writeup，我们会取消比赛资格。 <br>
                                        8. 在比赛结束24小时后，我们会公布答案，以供大家学习。 <br>
                                        9. 对于排名靠前或者writeup质量较高、某一方向突出的选手，我们会给予积分奖励。 <br>
                                        10. 因为是动态积分制，希望大家积极参与，积极解题，积极交流，积极分享。 <br>
                                    </div>
                                </v-card-text>
                            </v-col>
                            <v-col :cols="6">
                                <v-card-text>
                                    <div class="game-message">
                                        <div>
                                            【竞赛动态】
                                        </div>
                                        <div v-for="message in messages" :key="message.id">
                                            【 {{ new Date(message.time * 1000).formatDate('Y-M-D h:m:s') }} 】 {{ message.message }}
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-tabs
                        background-color="transparent"
                        color="orange"
                        grow
                        class="pb5"
                        v-model="subject_tab"
                    >
                        <v-tab
                            v-for="item in subjects_tabs"
                            :key="item"
                        >
                            {{ item }}
                        </v-tab>
                        <v-tab-item
                            v-for="item in subjects_tabs"
                            :key="item"
                        >
                            <v-row class="px2 pt5" v-if="item != 'RANK'"> 
                                <v-col md="3" lg="3" xl="2" sm="2" 
                                    v-for="i in subjects[item]" 
                                    :key="i.id"
                                >
                                    <SubjectCard
                                        :title="i.title"
                                        :comment="i.comment"
                                        :resolved="i.r_resolved != null"
                                        :resolves="i.resolved"
                                        :origin_score="i.origin_score"
                                        :subject_id="i.id"
                                        :competition_id="competition.id"
                                    />
                                </v-col>
                            </v-row>
                            <v-row class="px2 pt5" v-else-if="item == 'RANK'">
                                <p></p>
                                <v-col cols="12">
                                    <v-data-table
                                        :headers="rank_header"
                                        calculate-widths
                                        :items="rank"
                                    >
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-tab-item>
                    </v-tabs>
                    <p></p>
                </div>
            </v-card>
            <v-card></v-card>
        </v-container>
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { 
    api_competition_game_detail, 
    api_competition_game_subject_list,
    api_competition_game_rank
} from '../../interface/api'
import SubjectCard from '../../components/game/SubjectCard.vue'

import { GenerateUserGameScore } from '../../util/game'

export default {
    components : {
        SubjectCard
    },
    data : () => ({
        html_content : '',
        competition : null,
        competition_process : {
            total_time : 100,
            current_time : 100,
            status : '未开始',
        },
        subjects_tabs : [],
        subjects : {},
        subject_types : ['DEFAULT', 'WEB', 'PWN', 'MISC', 'REVERSE', 'CRYPTO', 'MOBILE'],
        subject_tab : 0,
        rank_header : [],
        rank : [],
        messages : []
    }),
    watch : {
        subject_tab(val) {
            if (this.subjects_tabs[val] == 'RANK') {
                this.loadRank()
            }
        }
    },
    computed : {
        continue_time() {
            return this.getTimeText(this.competition_process.current_time)
        },
        last_time() {
            return this.getTimeText(this.competition_process.total_time - this.competition_process.current_time)
        },
        process_percent() {
            return this.competition_process.current_time / this.competition_process.total_time * 100
        }
    },
    methods : {
        getTimeText(time) {
            const hour = Math.floor(time / 3600)
            const minute = Math.floor((time - hour * 3600) / 60)
            const second = time - hour * 3600 - minute * 60
            return `${hour}:${minute}:${second}`
        },
        getSubjectType(type) {
            return this.subject_types[type]
        },
        async load() {
            const { data } = await api_competition_game_detail(this.competition_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['data'] != null) {
                    this.html_content = data['data']['html_content']
                    this.competition = data['data']['r_competition']
                    this.messages = data['data']['r_message']
                    const start_time = this.competition.game_start_time
                    const end_time = this.competition.game_end_time
                    const current_time = parseInt(new Date().getTime() / 1000)
                    if (current_time < start_time) {
                        this.competition_process.status = '未开始'
                        this.competition_process.current_time = 0
                        this.competition_process.total_time = end_time - start_time
                    } else if (current_time > end_time) {
                        this.competition_process.status = '已结束'
                        this.competition_process.current_time = end_time - start_time
                        this.competition_process.total_time = end_time - start_time
                    } else {
                        this.competition_process.status = '进行中'
                        this.competition_process.total_time = end_time - start_time
                        this.competition_process.current_time = current_time - start_time
                        const timer = setInterval(() => {
                            this.competition_process.current_time += 1
                            if (this.competition_process.current_time >= this.competition_process.total_time) {
                                this.competition_process.status = '已结束'
                                clearInterval(timer)
                            }
                        }, 1000)
                    }
                }
            }
        },
        async loadSubject() {
            const { data } = await api_competition_game_subject_list(this.competition_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0 ){
                    openErrorMessageBox('错误', data['err'])
                } else if (data['data'] != null) {
                    this.rank_header = [{
                        text : '排名',
                        align : 'center',
                        value : 'rank'
                    }, {
                        text : '用户名',
                        align : 'center',
                        value : 'game_name'
                    }, {
                        text : '总得分',
                        align : 'center',
                        value : 'score'
                    }]
                    this.subjects_tabs = []
                    this.subjects = {}
                    data['data'].map(v => {
                        const type = this.getSubjectType(v['type'])
                        if (!this.subjects_tabs.includes(type)) {
                            this.subjects_tabs.push(type)
                            this.subjects[type] = [v]
                        } else {
                            this.subjects[type].push(v)
                        }
                        this.rank_header.push({
                            text : v['title'],
                            value : 'v_' + v['id'],
                            align : 'center'
                        })
                    })
                    this.subjects_tabs.push('RANK')
                }
            }
        },
        async loadRank() {
            const { data } = await api_competition_game_rank(this.competition_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    this.rank = []
                    data['data'].forEach((i, v) => {
                        const player = {
                            rank : v + 1,
                            game_name : i['game_name'],
                            score : i['score']
                        }
                        const solves = i['solves'].split(';')
                        solves.forEach(solve => {
                            const parts = solve.split(':')
                            const pos = parseInt(parts[1])
                            const origin_score = parseInt(parts[2])
                            const first_solve_time = parseInt(parts[3])
                            const solve_time = parseInt(parts[4]) - this.competition.game_start_time
                            const total_time = this.competition.game_end_time - this.competition.game_start_time
                            const score = GenerateUserGameScore(
                                origin_score, pos, total_time, solve_time, first_solve_time
                            )
                            const getIcon = (idx) => {
                                switch(idx) {
                                    case 1:
                                        return '①'
                                    case 2:
                                        return '②'
                                    case 3:
                                        return '③'
                                }
                            }
                            if (parseInt(parts[1]) < 4){
                                player['v_' + parts[0]] = getIcon(parseInt(parts[1])) + ' - ' + score
                            } else {
                                player['v_' + parts[0]] = '√ - ' + score
                            }
                        })
                        this.rank.push(player)
                    })
                }
            }
        }
    },
    mounted() {
        const competition_id = parseInt(this.$route.params.competition_id);
        if (competition_id) {
            this.competition_id = competition_id;
            this.load();
            this.loadSubject()
        }
    }
}
</script>

<style>
::-webkit-scrollbar
    {
        width: 4px;
        height: 4px;
        /* background-color: rgb(240,240,240); */
    }
 
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track
    {
        /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
        /*border-radius: 10px;*/
        /* background-color: rgb(30,30,30); */
    }
 
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(193,193,193);
        background-color: rgb(193,193,193);
    }

.game-message {
    padding: 15px;
    border-radius: 4px;
    height: 300px;
    font-size: 16px;
    line-height: 30px;
    font-weight: bold;
    /* border: 1px solid #ff9800; */
    padding: 15px;
    box-shadow: 0 2px 2px 20px rgb(255 255 255 / 45%);
    /* color: #ff7600; */
    /* font-family: "Open Sans", sans-serif; */
    text-transform: uppercase;
    /* letter-spacing: 1px; */
    font-size: 12px;
    line-height: 24px;
    overflow-y: scroll;
    color: #37373e;
    /* background-color: rgb(208 243 255);*/
}
</style>