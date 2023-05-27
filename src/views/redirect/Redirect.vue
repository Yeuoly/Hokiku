<template>
    <v-container
        fluid
        fill-height
        style="height: 70vh"
    >
        <v-progress-circular
            class="mx-auto"
            :color="progress_color"
            :indeterminate="indeterminate"
            size="128"
        >
            <div class="white--text">
                <v-icon :color="progress_color">{{ progress_icon }}</v-icon>
            </div>
            <br />
            <div>{{ progress_text }}</div>
        </v-progress-circular>
    </v-container>
</template>

<script>
import {
    api_user_login_github,
    api_user_bind_github
} from '../../interface/user'

import {
    openErrorMessageBox
} from '../../concat/bus'

import {
    setAuthToken
} from '../../util/auth'
import { sleep } from '../../util'

export default {
    data : () => ({
        processing : true,
        success : false
    }),
    computed : {
        indeterminate() {
            return this.processing
        },
        progress_color() {
            if (this.processing) {
                return 'primary'
            } else if (this.success) {
                return 'green'
            } else {
                return 'red'
            }
        },
        progress_text() {
            if (this.processing) {
                return '正在处理'
            } else if (this.success) {
                return '处理成功'
            } else {
                return '处理失败'
            }
        },
        progress_icon() {
            if (this.processing) {
                return 'mdi-loading'
            } else if (this.success) {
                return 'mdi-check'
            } else {
                return 'mdi-close'
            }
        }
    },
    methods: {
        github_login() {
            return new Promise((resolve, reject) => {
                const code = this.$route.query.code
                if (!code) {
                    openErrorMessageBox('错误', 'github授权失败，code为空')
                    reject()
                    return
                }

                api_user_login_github(code).then(({ data }) => {
                    if (data && data['res'] == 0) {
                        resolve({
                            token: data['data']['token'],
                        })
                    } else {
                        openErrorMessageBox('错误', 'github授权失败')
                        reject()
                    }
                }).catch(() => {
                    openErrorMessageBox('错误', 'github授权失败')
                    reject()
                })
            }) 
        },
        github_bind() {
            return new Promise((resolve, reject) => {
                const code = this.$route.query.code
                if (!code) {
                    openErrorMessageBox('错误', 'github授权失败，code为空')
                    reject()
                    return
                }

                api_user_bind_github(code).then(({ data }) => {
                    if (data && data['res'] == 0) {
                        resolve(true)
                    } else {
                        openErrorMessageBox('错误', data['err'])
                        reject()
                    }
                }).catch(() => {
                    openErrorMessageBox('错误', 'github授权失败')
                    reject()
                })
            }) 
        },
        async login() {
            const type = this.$route.query.type
            let data
            try {
                if (type === 'github') {
                    data = await this.github_login()
                } else {
                    openErrorMessageBox('错误', '未知的授权类型')
                    return
                }

                if (data && data['token']) {
                    setAuthToken(data['token'])
                    await sleep(1000)
                    location.href = '/'
                } else {
                    this.success = false
                }
            } catch {
                this.success = false
            }

            this.processing = false
        },
        async bind() {
            const type = this.$route.query.type
            let data
            try {
                if (type === 'github') {
                    data = await this.github_bind()
                } else {
                    openErrorMessageBox('错误', '未知的授权类型')
                    return
                }

                if (data) {
                    this.success = true
                    await sleep(1000)
                    location.href = '/home/profile'
                } else {
                    this.success = false
                }
            } catch {
                this.success = false
            }

            this.processing = false
        }
    },
    async mounted() {
        const method = this.$route.query.method
        if (method === 'login') {
            await this.login()
        } else if (method == 'bind') {
            await this.bind()
        } else {
            openErrorMessageBox('错误', '未知的授权方法')
        }
    },
}
</script>