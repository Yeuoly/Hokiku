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
                        Base系列编/解码
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>目前支持Base16/32/64的编解码，对于Base58之类的暂时还没写实现</li>
                            <li>纯前端实现，随便造</li>
                        </ul>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-radio-group v-model="dst_type" row>
                        <v-radio
                            label="Base16"
                            value="base16"
                        ></v-radio>
                        <v-radio
                            label="Base32"
                            value="base32"
                        ></v-radio>
                        <v-radio
                            label="Base64"
                            value="base64"
                        ></v-radio>
                        <v-radio
                            label="Base16解码"
                            value="base16-decode"
                        ></v-radio>
                        <v-radio
                            label="Base32解码"
                            value="base32-decode"
                        ></v-radio>
                        <v-radio
                            label="Base64解码"
                            value="base64-decode"
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
    base64encode, base64decode,
    base32encode, base32decode,
    base16encode, base16decode
} from '../../util/base'

export default {
    data : () => ({
        src : '',
        dst_type : 'base64'
    }),
    computed : {
        dst() {
            switch (this.dst_type) {
                case 'base16':
                    return base16encode(this.src)
                case 'base32':
                    return base32encode(this.src)
                case 'base64':
                    return base64encode(this.src)
                case 'base16-decode':
                    return base16decode(this.src)
                case 'base32-decode':
                    return base32decode(this.src)
                case 'base64-decode':
                    return base64decode(this.src)
            }
            return ''
        }
    },
    methods : {
        base16Encode() {
            return base16encode(this.base16.decode)
        },
        base16Decode() {
            return base16decode(this.base16.encode)
        },
        base32Encode() {
            return base32encode(this.base32.decode)
        },
        base32Decode() {
            return base32decode(this.base32.encode)
        },
        base64Encode() {
            return base64encode(this.base64.decode)
        },
        base64Decode() {
            return base64decode(this.base64.encode)
        },
        switchTo() {
            switch (this.dst_type) {
                case 'base16':
                    this.src = this.dst
                    this.dst_type = 'base16-decode'
                    break
                case 'base32':
                    this.src = this.dst
                    this.dst_type = 'base32-decode'
                    break
                case 'base64':
                    this.src = this.dst
                    this.dst_type = 'base64-decode'
                    break
                case 'base16-decode':
                    this.src = this.dst
                    this.dst_type = 'base16'
                    break
                case 'base32-decode':
                    this.src = this.dst
                    this.dst_type = 'base32'
                    break
                case 'base64-decode':
                    this.src = this.dst
                    this.dst_type = 'base64'
                    break

            }
        }
    }
}
</script>

<style>

</style>