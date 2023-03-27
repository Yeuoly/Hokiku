<template>
    <v-container>
        <v-row>
            <v-col :cols="12">
                <v-stepper v-model="step" alt-labels :vertical="true">
                    <template>
                        <v-stepper-step
                            :complete="step > 1"
                            :editable="false"
                            :step="1"
                        >
                            输入邮箱
                        </v-stepper-step>
                        <v-stepper-content
                            :step="1"
                        >
                            <v-card>
                                <v-card-title>
                                    <h2 class="headline mb-0">输入邮箱</h2>
                                </v-card-title>
                                <v-card-text>
                                    <v-text-field
                                        v-model="email"
                                        label="邮箱"
                                        outlined
                                        required
                                    ></v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="primary"
                                        @click="inputEmail2MathCaptcha"
                                    >
                                        下一步
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-stepper-content>
                    </template>
                    <template>
                        <v-stepper-step
                            :complete="step > 2"
                            :editable="false"
                            :step="2"
                        >
                            图像验证码
                        </v-stepper-step>
                        <v-stepper-content
                            :step="2"
                        >
                            <v-card>
                                <v-card-title>
                                    <h2 class="headline mb-0">输入验证码</h2>
                                </v-card-title>
                                <v-card-text>
                                    <v-text-field
                                        v-model="math_captcha"
                                        label="验证码"
                                        outlined
                                        required
                                    >
                                        <template v-slot:append-outer>
                                            <v-img
                                                class="img-catpcha"
                                                :src="math_captcha_src"
                                                @click="loadMathCaptcha"
                                            ></v-img>
                                        </template>
                                    </v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="primary"
                                        @click="mathCaptcha2EmailCaptcha"
                                    >
                                        下一步
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-stepper-content>
                    </template>
                    <template>
                        <v-stepper-step
                            :complete="step > 3"
                            :editable="false"
                            :step="3"
                        >
                            邮箱验证码
                        </v-stepper-step>
                        <v-stepper-content
                            :step="3"
                        >
                            <v-card>
                                <v-card-title>
                                    <h2 class="headline mb-0">输入验证码</h2>
                                </v-card-title>
                                <v-card-text>
                                    <v-text-field
                                        v-model="captcha"
                                        label="验证码"
                                        outlined
                                        required
                                    >
                                    </v-text-field>
                                    <v-text-field
                                        v-model="password"
                                        label="新密码"
                                        outlined
                                        required
                                        type="password"
                                    >
                                    </v-text-field>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="primary"
                                        @click="mailCaptcha2Success"
                                    >
                                        下一步
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-stepper-content>
                    </template>
                    <template>
                        <v-stepper-step
                            :complete="step > 4"
                            :editable="false"
                            :step="4"
                        >
                            完成
                        </v-stepper-step>
                        <v-stepper-content
                            :step="4"
                        >
                            <v-card>
                                <v-card-title>
                                    <h2 class="headline mb-0">完成</h2>
                                </v-card-title>
                                <v-card-text>
                                    <v-alert
                                        type="success"
                                        border="left"
                                        prominent
                                        text
                                    >
                                        密码重置成功
                                    </v-alert>
                                </v-card-text>
                            </v-card>
                        </v-stepper-content>
                    </template>
                </v-stepper>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../concat/bus'
import { api_get_email_captcha, api_get_math_captcha, api_user_repassword } from '../interface/api'
import md5 from 'md5'

export default {
    data : () => ({
        step : 1,
        email : '',
        password : '',
        math_captcha : '',
        math_captcha_src : '',
        captcha : '',
    }),
    methods : {
        async loadMathCaptcha() {
            const { data } = await api_get_math_captcha('repassword')
            if(!data || data['res'] < 0){
                openErrorMessageBox('错误', '获取验证码失败')
            } else {
                this.math_captcha_src = data['data']
            }
        },
        async inputEmail2MathCaptcha() {
            this.step = 2
        },
        async mathCaptcha2EmailCaptcha() {
            const { data } = await api_get_email_captcha(this.math_captcha, 'repassword', this.email)
            if (!data){
                openErrorMessageBox('错误', '获取验证码失败')
                this.loadMathCaptcha()
                return
            } else if(data['res'] < 0){
                openErrorMessageBox('错误', data['err'])
                this.loadMathCaptcha()
                return
            }
            this.step = 3
        },
        async mailCaptcha2Success() {
            const { data } = await api_user_repassword(this.captcha, md5(this.password))
            if (!data){
                openErrorMessageBox('错误', '请检查网络')
                return
            } else if(data['res'] < 0){
                openErrorMessageBox('错误', data['err'])
                return
            }
            this.step = 4
        }
    },
    mounted() {
        this.loadMathCaptcha()
    }
}
</script>

<style>
.img-catpcha{
    width: 150px;
    height: 47px;
}
</style>