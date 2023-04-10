<template>
    <v-container style="margin-bottom: 30px">
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
                                @click="$router.push(`/admin/${i.path}`)"
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
                            @click="$router.push(`/admin/${i.path}`)"
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

export default {
    data : () => ({
        navs : [ {
            text : '服务器',
            path : 'server',
            icon : 'mdi-server'
        }, {
            text : 'docker',
            path : 'docker',
            icon : 'mdi-docker'
        }, {
            text : '公告',
            path : 'boardcast',
            icon : 'mdi-bullhorn'
        }, {
            text : '课程',
            path : 'course',
            icon : 'mdi-book-open-page-variant'
        }, {
            text : '课程集',
            path : 'course-sheet',
            icon : 'mdi-book-open-page-variant'
        }, {
            text : '用户',
            path : 'user',
            icon : 'mdi-account'
        }, {
            text : '交易',
            path : 'trade',
            icon : 'mdi-cash-multiple'
        }]
    }),
    computed : {
        isMobile(){
            return !this.$vuetify.breakpoint.mdAndUp
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