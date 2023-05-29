<template>
    <v-container>
        <div class="irina-tools">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header>
                    展开笔记
                    <template v-slot:actions>
                        <v-icon color="primary">
                        $expand
                        </v-icon>
                    </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div class="px5 mx5">
                            <v-textarea
                                v-model="data.note"
                                placeholder="你可以在这里填写一些临时信息以用于在不同工具之间跳转~"
                            ></v-textarea>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-divider></v-divider>
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
        data : {
            note : '你可以在这里填写一些临时信息以用于在不同工具之间跳转~'
        },
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

    .v-expansion-panel::before {
        box-shadow: none !important;
    }
</style>