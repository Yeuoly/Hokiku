<template>
    <v-container>
        <v-flex>
            <v-row>
                <v-col cols="1" sm="1" md="2" lg="3" xl="4"></v-col>
                <v-col cols="10" sm="10" md="8" lg="6" xl="4">
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
                                ></v-text-field>

                                <v-text-field
                                    v-model="user.email"
                                    :counter="64"
                                    label="邮箱"
                                    required
                                ></v-text-field>

                                <v-text-field
                                    v-model="user.password"
                                    :counter="64"
                                    label="密码"
                                    required
                                ></v-text-field>

                                <v-text-field
                                    v-model="user.repassword"
                                    :counter="64"
                                    label="重复密码"
                                    required
                                ></v-text-field>

                                <v-text-field
                                    v-model="captcha"
                                    :counter="64"
                                    label="数学验证码"
                                    required
                                >
                                    <template v-slot:append-outer>
                                        <img :src="captcha_image_b64" class="img-catpcha" @click="refreshCaptcha" />
                                    </template>
                                </v-text-field>
                            </v-container>
                        </v-form>
                    </v-card>
                </v-col>
                <v-col cols="1" sm="1" md="2" lg="3" xl="4"></v-col>
            </v-row>
        </v-flex>
    </v-container>
</template>

<script>
import { api_get_math_captcha } from '../interface/api'

export default {
    name : 'register',
    data : () => ({
        valid : false,
        user : {
            email : '',
            username : '',
            password : '',
            repassword : ''
        },
        emailcode : '',
        captcha : '',
        captcha_image_b64 : ''
    }),
    methods : {
        toLogin(){
            this.$router.push('login')
        },
        sendEmailCode(){
            
        },
        async refreshCaptcha(){
            const { data } = await api_get_math_captcha('register')
            if(!data || data['res'] < 0){
                alert('获取验证码失败')
            } else {
                this.captcha_image_b64 = data['data']
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