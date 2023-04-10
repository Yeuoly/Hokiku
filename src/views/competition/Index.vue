<template>
    <v-container style="margin-bottom: 30px;">
        <v-flex>
            <v-row>
                <v-col v-if="!isMobile" cols="12">
                     <v-card>
                        <v-btn-toggle
                            tile
                            color="deep-purple accent-3"
                            group
                        >
                            <v-btn
                                v-for="(i, k) in navs"
                                :key="k" 
                                link 
                                @click="to(i.path)"
                                v-show="avaliable(i)"
                            >
                                <v-icon class="px3" color="primary">
                                    {{ i.icon }}
                                </v-icon> 
                                {{ i.text }}
                            </v-btn>
                        </v-btn-toggle>
                    </v-card>
                </v-col>
                <v-col v-else>
                    <v-bottom-navigation class="home-bottom-nav">
                        <v-btn
                           v-for="(i, k) in navs"
                            :key="k" 
                            link 
                            @click="$router.push(`/competition/${i.path}`)"
                            v-show="avaliable(i)"
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
    </v-container>
</template>

<script>
import { isSA } from '../../util'

export default {
    components : {  },
    data : () => ({
        navs : [{
            text : '比赛',
            path : '/competition/game',
            sa : false,
            icon : 'mdi-gamepad-variant'
        }, {
            text : '我的',
            path : '/competition/home',
            sa : false,
            icon : 'mdi-account'
        },{
            text : '练习',
            path : '/competition/train',
            sa : false,
            icon : 'mdi-flag-outline'
        },{
            text : '练习管理',
            path : '/competition/manager',
            sa : true,
            icon : 'mdi-flag-checkered'
        }, {
            text : '比赛管理',
            path : '/competition/game/manager',
            sa : true,
            icon : 'mdi-gamepad-outline'
        }, {
            text : 'AWD',
            path : '/competition/awd',
            sa : false,
            icon : 'mdi-flag-triangle'
        }, {
            text : 'AWD管理',
            path : '/awd/admin',
            sa : true,
            icon : 'mdi-shield-bug-outline'
        },{
            text : '排名',
            path : '/competition/rank',
            sa : false,
            icon : 'mdi-trophy-award'
        }],
        selected_link : 1,
        statistics_category_value : [0,0,0,0,0,0],
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
        to(path) {
            this.$router.push(path)
        }
    },
    mounted(){
    }
}
</script>

<style>
.home-bottom-nav{
    position: fixed;
    z-index: 5;
}
</style>