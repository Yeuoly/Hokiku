<template>
    <v-container>
        <v-card>
            <v-card-title>
                <v-row>
                    <v-col :cols="12">
                        <v-alert
                            color="red"
                            dark        
                        >
                            <span class="ml-2">提交记录检查</span>
                        </v-alert>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-card-text>
                <v-list v-if="duplicate_commits.length > 0">
                    <v-list-item v-for="(cheater, index) in duplicate_commits" :key="index" @click="copyText(generateText(cheater))">
                        <v-icon color="red" size="32">mdi-alert-circle</v-icon>
                        <v-list-item-content class="px5">
                            <v-list-item-title>{{ cheater.name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                <div v-html="generateText(cheater)"></div>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-list v-else>
                    <v-list-item>
                        <v-list-item-content class="px5">
                            <v-list-item-title>暂无疑似作弊情况</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import {
    api_organization_member_train_commit_check
} from '../../interface/organization'

export default {
    data : () => ({
        gid : 0,
        duplicate_commits : []
    }),
    methods : {
        async checkTrainCommit() {
            const { data } = await api_organization_member_train_commit_check(this.gid)
            if (!data) {
                openErrorSnackbar('获取个人信息失败')
            } else {
                if (data['res'] != 0) {
                    openErrorSnackbar(data['err'])
                } else if (data['data']) {
                    this.duplicate_commits = data['data']
                }
            }
        },
        generateText(item) {
            return `系统检测到 <b>${item.name } 的提交记录中存在重复提交的情况，疑似存在作弊行为。
                                <b>${ item.name }</b> 提交了原本属于 <b>${ item.origin_username }</b> 的flag。
                                ${ item.flag }`
        },
        copyText(text) {
            const input = document.createElement('input')
            input.setAttribute('readonly', 'readonly')
            input.setAttribute('value', text)
            document.body.appendChild(input)
            input.select()
            if (document.execCommand('copy')) {
                document.execCommand('copy')
                openSuccessSnackbar('复制成功')
            }
            document.body.removeChild(input)
        }
    },
    mounted() {
        this.gid = parseInt(this.$route.params.gid)
        if (!this.gid) {
            this.$router.back()
            return
        }

        this.checkTrainCommit()
    }
}
</script>

<style>

</style>