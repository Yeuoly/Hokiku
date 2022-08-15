<template>
    <v-container style="margin-top: 30px; margin-bottom: 30px">
        <v-flex>
            <v-row>
                <v-col v-if="!isMobile" md="2" sm="0">
                     <v-card>
                        <v-card-text>
                            当前分数：{{ score }}
                        </v-card-text>
                        <v-navigation-drawer
                            floating
                            permanent
                        >
                            <v-list
                                dense
                                rounded
                            >
                                <v-list-item
                                    v-for="(i, k) in navs"
                                    v-show="avaliable(i)"
                                    :key="k" 
                                    link 
                                    @click="$router.push(`/competition/${i.path}`)"
                                >
                                    {{ i.text }}
                                </v-list-item>
                            </v-list>
                        </v-navigation-drawer>
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
                <v-col md="10" sm="12">
                    <v-card>
                        <router-view></router-view>
                        <div class="py5"></div>
                    </v-card>
                </v-col>
            </v-row>
        </v-flex>
    </v-container>
</template>

<script>
import { api_competition_train_get_score } from '../../interface/api'
import { isSA } from '../../util'
export default {
    data : () => ({
        navs : [{
            text : '比赛',
            path : 'game',
            sa : true
        }, {
            text : '我的',
            path : 'home',
            sa : false
        },{
            text : '练习',
            path : 'train',
            sa : false
        },{
            text : '练习管理',
            path : 'manager',
            sa : true
        }, {
            text : '比赛管理',
            path : 'game/manager',
            sa : true
        }, {
            text : '排名',
            path : 'rank',
            sa : false
        }],
        score : 0
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
                this.score = data['data']
            }
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