<template>
    <v-container style="margin-top: 30px; margin-bottom: 30px">
        <v-flex>
            <v-row>
                <v-col v-if="!isMobile" md="2" sm="0">
                     <v-card>
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
import { isSA } from '../../util'
export default {
    data : () => ({
        navs : [{
            text : '比赛',
            path : 'game',
            sa : false
        },{
            text : '练习',
            path : 'train',
            sa : false
        },{
            text : '管理',
            path : 'manager',
            sa : true
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
        }
    }
}
</script>

<style>
.home-bottom-nav{
    position: fixed;
    z-index: 5;
}
</style>