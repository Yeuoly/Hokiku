<template>
    <v-row class="px5">
        <!-- 生成一个类似淘宝的二级首页头部导航 -->
        <v-col cols="12" class="pa-0">
            <v-tabs
                v-model="selected_link"
                background-color="white"
                color="primary"
                grow
                show-arrows
                slider-color="primary"
                slider-size="4"
            >
                <v-tabs-slider></v-tabs-slider>
                <v-tab
                    v-for="(nav, index) in navs"
                    :key="index"
                    :href="'#' + nav.path"
                    @click="to(nav.path)"
                >
                    {{ nav.text }}
                </v-tab>
            </v-tabs>
            <router-view></router-view>
        </v-col>
    </v-row>
</template>

<script>
export default {
    data : () => ({
        navs : [{
            path : 'coins',
            text : '金币'
        }, {
            path : 'charge',
            text : '充值'
        }],
        selected_link : 0
    }),
    watch : {
        $route : {
            handler : function (to) {
                this.selected_link = this.navs.findIndex(i => i.path === to.name)
            },
            immediate : true
        }
    },
    methods : {
        to(path) {
            this.$router.push(`/admin/trade/${path}`)
        }
    }
}
</script>

<style>

</style>