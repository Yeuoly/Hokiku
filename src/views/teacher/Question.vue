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
                                @click="$router.push(`/teacher/question/${gid}/${i.path}`)"
                            >
                                <v-icon class="px3" color="orange">
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
                            @click="$router.push(`/teacher/question/${gid}/${i.path}`)"
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
            text : '编译',
            path : 'build',
            icon : 'mdi-server'
        }, {
            text : '镜像',
            path : 'images',
            icon : 'mdi-image'
        }, {
            text : '题库',
            path : 'question',
            icon : 'mdi-book-open-page-variant'
        }, {
            text : '题集',
            path : 'sheet',
            icon : 'mdi-book-open-variant'
        }],
        gid : 0
    }),
    computed : {
        isMobile(){
            return !this.$vuetify.breakpoint.mdAndUp
        }
    },
    watch : {
        '$route.params.gid' : function(){
            this.gid = parseInt(this.$route.params.gid)
            if(!this.gid) {
                this.$router.back()
            }
        }
    },
    mounted(){
        this.gid = parseInt(this.$route.params.gid)
        if(!this.gid) {
            this.$router.back()
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