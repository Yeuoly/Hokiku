<template>
    <v-container fill-height>
        <v-flex>
            <v-row>
                <v-col cols="1" sm="1" md="8" lg="8" xl="8"></v-col>
                <v-col cols="10" sm="10" md="4" lg="4" xl="4">
                    <v-card>
                        <v-card color="primary">
                        <v-card-title>注册</v-card-title>
                        </v-card>
                        <v-form 
                            v-model="valid"
                        >
                            <v-container>
                                <v-text-field
                                    v-model="user.username"
                                    :counter="16"
                                    label="昵称"
                                    required
                                    :rules="regx.username"
                                ></v-text-field>

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
                                    required
                                    :rules="regx.password"
                                ></v-text-field>

                                <v-text-field
                                    type="password"
                                    v-model="user.repassword"
                                    :counter="64"
                                    label="重复密码"
                                    required
                                    :rules="repassword_rule"
                                ></v-text-field>

                                <v-text-field
                                    v-model="captcha"
                                    :counter="64"
                                    label="数学验证码"
                                    required
                                    :rules="regx.captcha"
                                >
                                    <template v-slot:append-outer>
                                        <img :src="captcha_image_b64" class="img-catpcha" @click="refreshCaptcha" />
                                    </template>
                                </v-text-field>

                                <v-text-field
                                    v-model="emailcode"
                                    :counter="6"
                                    label="邮箱验证码"
                                    required
                                    :rules="regx.emailcode"
                                >
                                    <template v-slot:append-outer>
                                        <v-btn @click="sendEmailCode">
                                            发送邮箱验证码
                                        </v-btn>
                                    </template>
                                </v-text-field>
                                <v-spacer></v-spacer>
                                <v-row>
                                    <v-col cols="1" sm="1" lg="2" md="2" xl="4"></v-col>
                                    <v-col cols="10" sm="10" lg="4" md="4" xl="2">
                                        <v-btn @click="register" block color="primary" :disabled="!valid">注册</v-btn>
                                    </v-col>
                                    <v-col v-if="$vuetify.breakpoint.smAndDown" cols="1" sm="1"></v-col>
                                    <v-col v-if="$vuetify.breakpoint.smAndDown" cols="1" sm="1"></v-col>
                                    <v-col cols="10" sm="10" lg="4" md="4" xl="2">
                                        <v-btn @click="toLogin" block >登录</v-btn>
                                    </v-col>
                                    <v-col cols="1" sm="1" lg="2" md="2" xl="4"></v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-card>
                </v-col>
            </v-row>
        </v-flex>
    </v-container>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../concat/bus'
import { api_get_email_captcha, api_get_math_captcha, api_auth_register } from '../interface/api'
import md5 from 'md5'

export default {
    name : 'register',
    data : () => {
        return {
            valid : false,
            user : {
                email : '',
                username : '',
                password : '',
                repassword : ''
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
                username : [
                    v => !!v || '请输入用户名',
                    v => v.length >= 6 && v.length <= 16 || '用户名太长或者太短了', 
                ],
                password : [
                    v => !!v || '请输入密码'
                ],
                captcha : [
                    v => !!v || '请输入数学图形验证码'
                ],
                emailcode : [
                    v => !!v || '请输入邮箱验证码',
                    v => v.length == 6 || '邮箱验证码长度错误'
                ]
            }
        }
    },
    computed : {
        repassword_rule(){
            const required = v => !!v || '请再次输入密码'
            const compare = v => this.user.password == v || '两次密码不相同'
            return [required, compare]
        }
    },
    methods : {
        toLogin(){
            this.$router.push('login')
        },
        async sendEmailCode(){
            if(!this.captcha){
                openErrorMessageBox('警告', '验证码错误')
            }
            const { data } = await api_get_email_captcha(this.captcha, 'register', this.user.email)
            if (!data){
                openErrorMessageBox('错误', '获取验证码失败')
                this.refreshCaptcha()
            } else if(data['res'] < 0){
                openErrorMessageBox('错误', data['err'])
                this.refreshCaptcha()
            } else {
                openInfoMessageBox('信息', data['data'])
            }
        },
        async refreshCaptcha(){
            const { data } = await api_get_math_captcha('register')
            if(!data || data['res'] < 0){
                openErrorMessageBox('错误', '获取验证码失败')
            } else {
                this.captcha_image_b64 = data['data']
            }
        },
        async register(){
            const { data } = await api_auth_register(this.user.username, md5(this.user.password), this.emailcode)
            if(!data){
                openErrorMessageBox('错误', '网络连接出现问题')
            }else if(data['res'] < 0){
                openErrorMessageBox('错误', data['err'])
            }else{
                await openInfoMessageBox('成功', '恭喜您注册成功')
                this.toLogin()
            }
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
</style>