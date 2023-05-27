<template>
    <v-container fill-height>
        <v-flex>
            <v-row>
                <v-card class="irina-login">
                    <v-card color="primary">
                        <v-card-title class="text-white">IrinaGame登录</v-card-title>
                    </v-card>
                    <v-form 
                        v-model="valid"
                    >
                        <v-container>
                            <v-text-field
                                v-model="user.email"
                                :counter="64"
                                label="邮箱"
                                required
                                :rules="regx.email"
                            ></v-text-field>
                            <v-text-field
                                type="password"
                                v-model="user.password"
                                :counter="64"
                                label="密码"
                                @keypress.enter="login"
                                required
                                :rules="regx.password"
                            ></v-text-field>
                            <v-text-field
                                v-model="captcha"
                                :counter="64"
                                label="数学验证码"
                                @keypress.enter="login"
                                required
                                :rules="regx.captcha"
                            >
                                <template v-slot:append-outer>
                                    <img :src="captcha_image_b64" class="img-catpcha" @click="refreshCaptcha" />
                                </template>
                            </v-text-field>
                            <v-spacer></v-spacer>
                            <v-row>
                                <v-col>
                                    <v-btn @click="login" block color="primary" :disabled="!valid">登录</v-btn>
                                </v-col>
                                <v-col>
                                    <v-btn @click="toRegister" block >注册</v-btn>
                                </v-col>
                                <v-col :cols="12">
                                    <v-divider></v-divider>
                                    <v-btn class="right mt-2" text small color="primary" @click="$router.push('/repassword')">忘记密码</v-btn>
                                    <!-- github -->
                                    <v-btn text small class="mt-2" color="primary">第三方登录</v-btn> <br>
                                    <v-btn
                                        text
                                        small
                                        color="primary"
                                        class="mt-2"
                                        @click="github()"
                                    >
                                        <v-avatar
                                            size="24"
                                            tile
                                        >
                                            <v-icon size="24">mdi-github</v-icon>
                                        </v-avatar>
                                    </v-btn>
                                    <!-- qq -->
                                    <v-btn
                                        text
                                        small
                                        color="primary"
                                        class="mt-2"
                                        disabled
                                    >
                                        <v-avatar
                                            size="24"
                                            tile
                                        >
                                            <v-icon size="24">mdi-qqchat</v-icon>
                                        </v-avatar>
                                    </v-btn>
                                    <v-btn
                                        text
                                        small
                                        color="primary"
                                        class="mt-2"
                                        disabled
                                    >
                                        <v-avatar
                                            size="24"
                                            tile
                                        >
                                            <v-icon size="24">mdi-wechat</v-icon>
                                        </v-avatar>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card>
            </v-row>
        </v-flex>
    </v-container>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../concat/bus'
import { api_get_math_captcha, api_auth_login } from '../interface/api'
import { setAuthToken } from '../util/auth'
import md5 from 'md5'

export default {
    name : 'login',
    data : () => {
        return {
            valid : false,
            user : {
                email : '',
                password : '',
            },
            emailcode : '',
            captcha : '',
            captcha_image_b64 : '',
            regx : {
                email : [
                    v => !!v || '请输入邮箱',
                    v => v.length >= 6 && v.length <= 64 || '邮箱太长或者太短了',
                    v => /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(v) || '邮箱格式错误'
                ],
                password : [
                    v => !!v || '请输入密码'
                ],
                captcha : [
                    v => !!v || '请输入数学图形验证码'
                ],
            }
        }
    },
    methods : {
        toRegister(){
            this.$router.push('reg')
        },
        async refreshCaptcha(){
            const { data } = await api_get_math_captcha('login')
            if(!data || data['res'] < 0){
                openErrorMessageBox('错误', '获取验证码失败')
            } else {
                this.captcha_image_b64 = data['data']
            }
        },
        async login(){
            const { data } = await api_auth_login(this.user.email, md5(this.user.password), this.captcha)
            if(!data){
                openErrorMessageBox('错误', '网络连接出现问题')
            }else if(data['res'] < 0){
                openErrorMessageBox('错误', data['err'])
            }else{
                setAuthToken(data['data'])
                await openInfoMessageBox('成功', '登录成功')
                window.location.href = '/home'
            }
            this.refreshCaptcha();
        },
        github() {
            const redirect_uri = encodeURIComponent(`http://${process.env.VUE_APP_FRONTEND_BASE_URL}/redirect?method=login&type=github`)
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}&redirect_uri=` + redirect_uri
        }
    },
    created(){
        this.refreshCaptcha()
    }
}
</script>

<style>
.img-catpcha {
    width: 150px;
    height: 47px;
}

.irina-login {
    margin: 0 auto;
    margin-top: 10%;
    margin-bottom: 10%;
}
</style>