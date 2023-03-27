<template>
    <div style="margin-top: 30px; margin-bottom: 30px; padding-left: 80px; padding-right: 80px">
        <v-flex>
            <v-row>
                <v-col v-if="!isMobile" cols="12">
                     <v-card>
                        <v-btn-toggle
                            v-model="text"
                            tile
                            color="deep-purple accent-3"
                            group
                        >
                            <v-btn
                                v-for="(i, k) in navs"
                                :key="k" 
                                link 
                                @click="$router.push(`/acm/${i.path}`)"
                            >
                                {{ i.text }}
                            </v-btn>
                        </v-btn-toggle>
                    </v-card>
                    <v-card class="mt5">
                        <v-subheader>
                            我的数据分析
                        </v-subheader>
                        <v-card-text>
                            总分：{{ score }}
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col v-else>
                    <v-bottom-navigation class="home-bottom-nav">
                        <v-btn
                           v-for="(i, k) in navs"
                            :key="k" 
                            link 
                            @click="$router.push(`/acm/${i.path}`)"
                        >
                            <span>{{ i.text }}</span>
                        </v-btn>
                    </v-bottom-navigation>
                </v-col>
                <v-col cols="12">
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
import { isSA } from '../../util'

export default {
    data : () => ({
        navs : [{
            text : '我的',
            path : 'user/home',
            sa : false
        },{
            text : '管理',
            path : 'admin',
            sa : true
        },{
            text : '练习',
            path : 'user/problem',
            sa : false
        },{
            text : '考试',
            path : 'user/exam',
            sa : false
        }],
        score : 0,
        selected_link : 1,
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
    },
}
</script>

<style>

</style>