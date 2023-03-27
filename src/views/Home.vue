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
                                {{ i.text }}
                            </v-btn>
                            <v-btn
                                link 
                                @click="$router.push(`/repassword`)"
                            >
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
            path : 'profile'
        }, {
            text : '作业',
            path : 'homework'
        }, {
            text : '收集表',
            path : 'collection'
        }, {
            text : '组织',
            path : 'org'
        }, {
            text : '交易',
            path : 'trade'
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