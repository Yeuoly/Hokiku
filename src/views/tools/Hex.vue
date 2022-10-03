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
                        Hex编/解码
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>Hex即十六进制，输入十六进制字符串，系统会给出对应的字符串序列</li>
                            <li>纯前端实现，随便造</li>
                        </ul>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-radio-group v-model="dst_type" row>
                        <v-radio
                            label="编码"
                            value="encode"
                        ></v-radio>
                        <v-radio
                            label="解码"
                            value="decode"
                        ></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col :cols="12">
                    <v-btn color="primary" @click="switchTo">转换编/解密</v-btn>
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
    hexencode, hexdecode
} from '../../util/hex'

export default {
    data : () => ({
        src : '',
        dst_type : 'encode'
    }),
    computed : {
        dst() {
            switch (this.dst_type) {
                case 'encode':
                    return hexencode(this.src)
                case 'decode':
                    return hexdecode(this.src)
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