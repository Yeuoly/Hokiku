<template>
    <v-row class="px2">
        <v-col :cols="12">
            <v-tabs
                v-model="current_tab"
                background-color="white"
                color="primary"
            >
                <v-tab v-for="(i, k) in tabs" :key="k">
                    {{ i.text }}
                </v-tab>
            </v-tabs>
            <router-view></router-view>
        </v-col>
    </v-row>
</template>

<script>

export default {
    data : () => ({
        current_tab : 0,
        tabs : [{
            text : '金币变动',
            path : 'coins'
        }, {
            text : '充值记录',
            path : 'charge'
        }],
    }),
    watch : {
        current_tab() {
            this.to(this.tabs[this.current_tab].path)
        }
    },
    methods : {
        to(path) {
            this.$router.push(`/home/trade/${path}`)
        },

    }
}
</script>

<style>

</style>