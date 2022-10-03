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
                        01编/解码
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>二进制转字符串工具，输入你的二进制序列，系统会给出对应的输出</li>
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
    bitencode, bitdecode
} from '../../util/01'

export default {
    data : () => ({
        src : '',
        dst_type : 'encode'
    }),
    computed : {
        dst() {
            switch (this.dst_type) {
                case 'encode':
                    return bitencode(this.src)
                case 'decode':
                    return bitdecode(this.src)
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