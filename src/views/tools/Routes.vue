<template>
    <v-container>
        <v-layout>
            <v-row>
                <v-col :cols="12">
                    <div v-for="(i, k) in tools" :key="k">
                        <v-row>
                            <v-col :cols="12">
                                <v-card-title>
                                    <v-icon>
                                        mdi-chevron-down
                                    </v-icon>
                                    {{ i.name }}
                                </v-card-title>
                                <v-card-text>
                                    {{ i.comment }}
                                </v-card-text>
                                <v-divider></v-divider>
                            </v-col>
                            <v-col :cols="12">
                                <v-row>
                                    <v-col :cols="6" :sm="6" :md="4" :lg="3" :xl="2" v-for="(j, l) in i.sub" :key="l">
                                        <div class="tools-sub-card clickable" @click="to(j.path)">
                                            {{ j.name }}
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data : () => ({
        tools : [{
            module: 'en/decode',
            name : '编码解码',
            comment : '一些常见的编码解码操作，当然，需要不断完善',
            sub : [{
                name: 'Base系列编/解码',
                path: '/tools/baseserial'
            }, {
                name: 'Hex编/解码',
                path: '/tools/hex'
            }, {
                name: 'URL编/解码',
                path: '/tools/url'
            }, {
                name: '二进制/字符串转换',
                path: '/tools/01'
            }, {
                name: '莫斯电码',
                path: '/tools/morse'
            }, {
                name: 'ASCII',
                path: '/tools/ascii'
            }]
        }, {
            module : 'en/encrypt',
            name : '加密解密',
            comment : '一些常见的加密解密操作，当然，需要不断完善',
            sub : [{
                name : 'Rot系列编/解码（凯撒）',
                path : '/tools/rot'
            }, {
                name : '维吉尼亚密码',
                path : '/tools/vigenere'
            }, {
                name : '仿射密码',
                path : '/tools/affine'
            }, {
                name : 'Playfair密码',
                path : '/tools/playfair'
            }, {
                name : 'AES',
                path : '/tools/aes'
            }, {
                name : 'DES',
                path : '/tools/des'
            }, {
                name : 'RSA',
                path : '/tools/rsa'
            }, {
                name : 'RC4',
                path : '/tools/rc4'
            }, {
                name : 'TripleDES',
                path : '/tools/tripledes'
            }]
            // }, {
            //     name : '仿射密码',
            //     path : '/tools/affine'
            // }]
        }, {
            module : 'hash',
            name : '哈希函数',
            comment : '一些常见的哈希函数，当然，需要不断完善',
            sub : [{
                name : 'MD5',
                path : '/tools/md5'
            }, {
                name : 'SHA1',
                path : '/tools/sha1'
            }, {
                name : 'SHA256',
                path : '/tools/sha256'
            }, {
                name : 'SHA384',
                path : '/tools/sha384'
            }, {
                name : 'SHA512',
                path : '/tools/sha512'
            }, {
                name : 'CRC32',
                path : '/tools/crc32'
            }, {
                name : 'HMAC',
                path : '/tools/hmac'
            }]
        }]
    }),
    methods :{
        to(path) {
            this.$router.push(path)
        }
    }
}
</script>

<style>
.tools-sub-card {
    width: 100%;
    color: #00aeec;
    font-weight: 700;
    background-color: aliceblue;
    height: 70px;
    text-align: center;
    line-height: 70px;
    border-radius: 8px;
}
</style>