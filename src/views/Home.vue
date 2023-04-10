<template>
    <v-container style="margin-bottom: 30px">
        <v-flex>
            <v-row>
                <v-col v-if="!isMobile" md="12">
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
                                @click="$router.push(`/home/${i.path}`)"
                            >
                                <v-icon class="px3" color="primary">
                                    {{ i.icon }}
                                </v-icon> 
                                {{ i.text }}
                            </v-btn>
                            <v-btn
                                link 
                                @click="$router.push(`/repassword`)"
                            >
                                <v-icon class="px3" color="primary">
                                    mdi-lock-reset
                                </v-icon>
                            重置密码
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
                            @click="$router.push(`/home/${i.path}`)"
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
        navs : [{
            text : '个人',
            path : 'profile',
            icon : 'mdi-account'
        }, {
            text : '作业',
            path : 'homework',
            icon : 'mdi-book-open-page-variant'
        }, {
            text : '收集表',
            path : 'collection',
            icon : 'mdi-file-document-minus-outline'
        }, {
            text : '班级',
            path : 'org',
            icon : 'mdi-account-group'
        }, {
            text : '交易',
            path : 'trade',
            icon : 'mdi-cash-multiple'
        }, {
            text : '签到',
            path : 'signin',
            icon : 'mdi-calendar-check'
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