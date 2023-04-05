<template>
    <v-container style="margin-bottom: 30px">
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
                                @click="$router.push(`/teacher/${i.path}`)"
                            >
                                {{ i.text }}
                            </v-btn>
                        </v-btn-toggle>
                    </v-card>
                </v-col>
                <v-col v-else>
                    <v-bottom-navigation class="message-bottom-nav">
                        <v-btn
                           v-for="(i, k) in navs"
                            :key="k" 
                            link 
                            @click="$router.push(`/teacher/${i.path}`)"
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
        text : null,
        navs : [{
            text : '发布作业',
            path : 'publish-homework'
        }, {
            text : '查看作业',
            path : 'check-homework'
        }, {
            text : '发布收集表',
            path : 'publish-coll'
        }, {
            text : '发布课程',
            path : 'publish-course'
        }, {
            text : '我的课程',
            path : 'courses'
        }, {
            text : '课程集',
            path : 'course/sheet'
        }],
    }),
    computed : {
        isMobile(){
            return !this.$vuetify.breakpoint.mdAndUp
        }
    }
}
</script>

<style>
.message-bottom-nav{
    position: fixed;
    z-index: 5;
}
</style>