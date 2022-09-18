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
            path : 'problem',
            text : '题目'
        }],
        selected_link : 0
    }),
    methods : {
        to(path) {
            this.$router.push(`/acm/admin/${path}`)
        }
    }
}
</script>

<style>

</style>