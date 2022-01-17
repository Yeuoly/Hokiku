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
                                    :key="k" 
                                    link 
                                    @click="$router.push(`/message/${i.path}`)"
                                >
                                    {{ i.text }}
                                </v-list-item>
                            </v-list>
                        </v-navigation-drawer>
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

export default {
    data : () => ({
        navs : [{
            text : '系统消息',
            path : 'system'
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