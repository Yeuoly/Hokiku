<template>
    <v-container>
        <div class="irina-tools">
            <v-toolbar color="white" flat>
                <v-btn text @click="back">
                    <v-icon color="primary">mdi-arrow-left</v-icon>
                    返回
                </v-btn>
                <v-btn text @click="back">
                    <v-icon color="primary">mdi-code-braces</v-icon>
                    编码工具
                </v-btn>
                <v-btn text @click="back">
                    <v-icon color="primary">mdi-lock-question</v-icon>
                    密码学
                </v-btn>
                <v-btn text @click="back">
                    <v-icon color="primary">mdi-shield-key</v-icon>
                    哈希函数
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="back">
                    <v-icon color="primary">mdi-help-circle</v-icon>
                    帮助
                </v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <router-view></router-view>
        </div>
    </v-container>
</template>

<script>
export default {
    methods: {
        back() {
            this.$router.push('/tools')
        }
    },
}
</script>

<style>
    .irina-tools {
        margin: 20px;
        background-color : white;
        border-radius: 8px;
    }
</style>