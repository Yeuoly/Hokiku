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
                                @click="$router.push(`/message/${i.path}`)"
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
                    <v-bottom-navigation class="message-bottom-nav">
                        <v-btn
                           v-for="(i, k) in navs"
                            :key="k" 
                            link 
                            @click="$router.push(`/message/${i.path}`)"
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
            text : '系统消息',
            path : 'system',
            icon : 'mdi-message-text'
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