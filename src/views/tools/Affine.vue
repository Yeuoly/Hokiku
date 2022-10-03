<template>
    <div>
        <v-container>
            <v-row>
                <v-col :cols="12">
                    <v-alert
                        outlined
                        type="success"
                        text
                    >
                        维吉尼亚密码
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>纯前端实现，随便造</li>
                        </ul>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-radio-group v-model="dst_type" row>
                        <v-radio
                            label="加密"
                            value="encode"
                        ></v-radio>
                        <v-radio
                            label="解密"
                            value="decode"
                        ></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col :cols="12">
                    <v-btn color="primary" @click="switchTo">转换加/解密</v-btn>
                </v-col>
                <v-col :cols="6">
                    <v-text-field
                        label="A"
                        v-model="key"
                    ></v-text-field>
                </v-col>
                <v-col :cols="6">
                    <v-text-field
                        label="B"
                        v-model="key1"
                    ></v-text-field>
                </v-col>
                <v-col :cols="12">
                    <v-card-text>
                        <v-textarea
                            v-model="src"
                            label="原文"
                            outlined
                            rows="10"
                        ></v-textarea>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-card-text>
                        <v-textarea
                            v-model="dst"
                            label="结果"
                            outlined
                            rows="10"
                        ></v-textarea>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

import {
    affineEncrypt, affineDecrypt
} from '../../util/crypto/affine'

export default {
    data : () => ({
        src : '',
        dst_type : 'encode',
        key : '1',
        key1 : '3'
    }),
    computed : {
        dst() {
            switch (this.dst_type) {
                case 'encode':
                    return affineEncrypt(this.src, this.key, this.key1)
                case 'decode':
                    return affineDecrypt(this.src, this.key, this.key1)
            }
            return ''
        }
    },
    methods : {
        switchTo() {
            switch (this.dst_type) {
                case 'encode':
                    this.src = this.dst
                    this.dst_type = 'decode'
                    break
                case 'decode':
                    this.src = this.dst
                    this.dst_type = 'encode'
                    break
            }
        }
    }
}
</script>

<style>

</style>