<template>
<v-container>
    <div class="pt5">
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
                <div class="px5 py5">
                    <router-view></router-view>
                </div>
            </v-col>
        </v-row>
    </div>
</v-container>
</template>

<script>
export default {
    data : () => ({
        navs : [{
            path : 'vm',
            name : 'prodesign-vm',
            text : '虚拟机'
        }, {
            path : 'code',
            name : 'prodesign-code',
            text : '代码'
        }],
        selected_link : 0
    }),
    methods : {
        to(path) {
            this.$router.push(`/prodesign/${path}`)
            this.selected_link = this.navs.findIndex(i => i.path === path)
        }
    },
    mounted() {
        this.to(this.navs[0].path)
    }
}
</script>

<style>

</style>