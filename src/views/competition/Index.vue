<template>
    <div style="margin-top: 30px; margin-bottom: 30px; padding-left: 80px; padding-right: 80px">
        <v-flex>
            <v-row>
                <v-col v-if="!isMobile" md="4" lg="3" xl="2" sm="0">
                     <v-card>
                        <v-navigation-drawer
                            floating
                            permanent
                        >
                            <v-list
                                dense
                                rounded
                                flat
                            >
                                <v-subheader>
                                    导航
                                </v-subheader>
                                <v-list-item-group
                                    color="primary"
                                    v-model="selected_link"
                                >
                                    <v-list-item
                                        v-for="(i, k) in navs"
                                        v-show="avaliable(i)"
                                        :key="k" 
                                        link 
                                        @click="to(i.path)"
                                    >
                                        <a class="clickable text-center">
                                            <!-- make text like a link, looks great, weight and rounded -->
                                            <v-list-item-title>
                                                {{ i.text }}
                                            </v-list-item-title>
                                        </a>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-navigation-drawer>
                    </v-card>
                    <v-card class="mt5">
                        <v-subheader>
                            我的数据分析
                        </v-subheader>
                        <v-card-text>
                            总分：{{ score }}
                        </v-card-text>
                        <RadarCharts
                            title="统计"
                            subtext="你是什么多边形战士！"
                            :indicator="statistics_indicator"
                            :model="{ data: [{ value : statistics_category_value, name : $store.getters.getUserName }] }"
                            style="width: 100%; height: 500px"
                        />
                        <v-card-text>
                            <v-simple-table>
                                <thead>
                                    <tr>
                                        <th>分类</th>
                                        <th>已解决/总量</th>
                                        <th>进度</th>
                                        <th>%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, k) in statistics_indicator" :key="k">
                                        <td>{{ i.name }}</td>
                                        <td>{{ statistics_category_value[k] }} / {{ i.total }}</td>
                                        <td>
                                            <v-progress-circular
                                                :width="3"
                                                :value="(statistics_category_value[k]/i.total) * 100"
                                                color="green"
                                            >
                                            </v-progress-circular>
                                        </td>
                                        <td>
                                            %{{(statistics_category_value[k]/i.total*100).toFixed(2)}}
                                        </td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col v-else>
                    <v-bottom-navigation class="home-bottom-nav">
                        <v-btn
                           v-for="(i, k) in navs"
                            :key="k" 
                            link 
                            @click="$router.push(`/competition/${i.path}`)"
                        >
                            <span>{{ i.text }}</span>
                        </v-btn>
                    </v-bottom-navigation>
                </v-col>
                <v-col md="8" lg="9" xl="10" sm="12">
                    <v-card>
                        <router-view></router-view>
                        <div class="py5"></div>
                    </v-card>
                </v-col>
            </v-row>
        </v-flex>
    </div>
</template>

<script>
import { api_competition_train_get_score } from '../../interface/api'
import { isSA } from '../../util'

import RadarCharts from '../../components/charts/RadarCharts.vue'

export default {
    components : { RadarCharts },
    data : () => ({
        navs : [{
            text : '比赛',
            path : '/competition/game',
            sa : false
        }, {
            text : '我的',
            path : '/competition/home',
            sa : false
        },{
            text : '练习',
            path : '/competition/train',
            sa : false
        },{
            text : '练习管理',
            path : '/competition/manager',
            sa : true
        }, {
            text : '比赛管理',
            path : '/competition/game/manager',
            sa : true
        }, {
            text : 'AWD',
            path : '/competition/awd',
            sa : false
        }, {
            text : 'AWD管理',
            path : '/awd/admin',
            sa : true
        },{
            text : '排名',
            path : '/competition/rank',
            sa : false
        }],
        score : 0,
        selected_link : 1,
        statistics_category_value : [0,0,0,0,0,0],
        statistics_indicator : [{
                name : 'Web',
                max : 0,
                total : 0
            },{
                name : 'Pwn',
                max : 0,
                total : 0
            },{
                name : 'Misc',
                max : 0,
                total : 0
            },{
                name : 'Reverse',
                max : 0,
                total : 0
            },{
                name : 'Misc',
                max : 0,
                total : 0
            },{
                name : 'Mobile',
                max : 0,
                total : 0
            }]
    }),
    computed : {
        isMobile(){
            return !this.$vuetify.breakpoint.mdAndUp
        },
    },
    methods : {
        avaliable(item){
            return !item.sa || isSA(this.$store.getters.getUserStatus)
        },
        async getScore(){
            const uid = this.$store.getters.getUserUid
            const { data } = await api_competition_train_get_score(uid)
            if(data && data['res'] == 0){
                this.score = data['data']['score']
                const radar = data['data']['radar']
                if (radar) {
                    radar.forEach(e => {
                        if(e.type > 0) {
                            this.statistics_indicator[e.type - 1].total = e.total
                            this.statistics_category_value[e.type - 1] = e.solved
                        }
                    })
                    const max = Math.max(...radar.map(v => v.solved))
                    this.statistics_indicator.forEach(e => { e.max = max })
                }
            }
        },
        to(path) {
            this.$router.push(path)
        }
    },
    mounted(){
        this.getScore()
    }
}
</script>

<style>
.home-bottom-nav{
    position: fixed;
    z-index: 5;
}
</style>