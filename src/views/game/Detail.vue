<template>
    <div>
        <div v-html="html_content"></div>
        <v-container>
            <v-card v-if="competition" class="pb5">
                <v-card-title class="text-center justify-center py-6">
                    <h1 class="font-weight-bold text-h2 basil--text">
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
                            <v-row class="px2 pt2"> 
                                <v-col md="3" lg="3" xl="2" sm="2" 
                                    v-for="i in subjects[item]" 
                                    :key="i.id"
                                >
                                    <SubjectCard
                                        :title="i.title"
                                        :comment="i.comment"
                                        :resolved="true"
                                        :resolves="i.resolved"
                                        :origin_score="i.origin_score"
                                    />
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
import { api_competition_game_detail, api_competition_game_subject_list } from '../../interface/api'
import SubjectCard from '../../components/game/SubjectCard.vue'

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
        subject_tab : 0
    }),
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
                    const start_time = this.competition.game_start_time
                    const end_time = this.competition.game_end_time
                    const current_time = parseInt(new Date().getTime() / 1000)
                    this.competition_process.total_time = end_time - start_time
                    this.competition_process.current_time = current_time - start_time
                    if (current_time < start_time) {
                        this.competition_process.status = '未开始'
                    } else if (current_time > end_time) {
                        this.competition_process.status = '已结束'
                    } else {
                        this.competition_process.status = '进行中'
                        const timer = setInterval(() => {
                            this.competition_process.current_time += 1
                            if (this.competition_process.current_time >= this.competition_process.total_time) {
                                this.competition_process.status = '已结束'
                                clearInterval(timer)
                            }
                        }, 1000)
                        this.loadSubject()
                    }
                }
            }
        },
        async loadSubject() {
            const { data } = await api_competition_game_subject_list(this.competition_id)
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['data'] != null) {
                    data['data'].map(v => {
                        const type = this.getSubjectType(v['type'])
                        if (!this.subjects_tabs.includes(type)) {
                            this.subjects_tabs.push(type)
                            this.subjects[type] = [v]
                        } else {
                            this.subjects[type].push(v)
                        }
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
        }
    }
}
</script>

<style>

</style>