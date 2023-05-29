<template>
    <v-container>
        <v-layout>
            <v-row>
                <v-col :cols="12">
                    <div v-for="(i, k) in tools" :key="k">
                        <v-row>
                            <v-col :cols="12">
                                <v-card-title>
                                    <v-icon class="pr5" color="primary">
                                        mdi-chevron-down
                                    </v-icon>
                                    <span class="text-25 text-primary">
                                        {{ i.name }}
                                    </span>
                                </v-card-title>
                                <v-card-text class="text-grey">
                                    {{ i.comment }}
                                </v-card-text>
                            </v-col>
                            <v-col :cols="12">
                                <v-row>
                                    <v-col :cols="6" :sm="6" :md="4" :lg="3" :xl="2" v-for="(j, l) in i.sub" :key="l">
                                        <div class="tools-sub-card clickable" @click="to(j.path)">
                                            <v-icon class="left px5" style="height: 100%;" color="success">
                                                {{ j.icon ? j.icon : 'mdi-chevron-right'  }}
                                            </v-icon>
                                            <span :style="`color: ${j.color};`">
                                                {{ j.name }}
                                            </span>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-divider class="mt5"></v-divider>
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
                icon: 'mdi-atom',
                name: 'Base系列编/解码',
                path: '/tools/baseserial',
                color: 'orange'
            }, {
                icon: 'mdi-hexadecimal',
                name: 'Hex编/解码',
                path: '/tools/hex',
                color: 'orange'
            }, {
                icon: 'mdi-protocol',
                name: 'URL编/解码',
                path: '/tools/url'
            }, {
                icon: 'mdi-numeric',
                name: '二进制/字符串转换',
                path: '/tools/01'
            }, {
                icon: 'mdi-home-sound-in-outline',
                name: '莫斯电码',
                path: '/tools/morse'
            }, {
                icon: 'mdi-code-braces',
                name: 'ASCII',
                path: '/tools/ascii'
            }, {
                icon: 'mdi-swap-horizontal',
                name: '大小写转换',
                path: '/tools/convertcase'
            }]
        },{
            module : 'hash',
            name : '哈希函数',
            comment : '一些常见的哈希函数，当然，需要不断完善',
            sub : [{
                icon: 'mdi-lock-alert-outline',
                name : 'MD5',
                path : '/tools/md5',
                color: 'orange'
            }, {
                icon: 'mdi-lock-alert-outline',
                name : 'SHA1',
                path : '/tools/sha1'
            }, {
                icon: 'mdi-lock-open-check-outline',
                name : 'SHA256',
                path : '/tools/sha256'
            }, {
                icon: 'mdi-lock-open-check-outline',
                name : 'SHA384',
                path : '/tools/sha384'
            }, {
                icon: 'mdi-lock-open-check-outline',
                name : 'SHA512',
                path : '/tools/sha512'
            }, {
                icon: 'mdi-lock-open-check-outline',
                name : 'CRC32',
                path : '/tools/crc32'
            }, {
                icon: 'mdi-lock-open-check-outline',
                name : 'HMAC',
                path : '/tools/hmac'
            }, {
                icon: 'mdi-file-code-outline',
                name : 'MD5文件校验',
                path : '/tools/md5file',
                color: 'orange'
            }, {
                icon: 'mdi-file-code-outline',
                name : 'SHA1文件校验',
                path : '/tools/sha1file',
                color: 'orange'
            }, {
                icon: 'mdi-file-code-outline',
                name : 'SHA256文件校验',
                path : '/tools/sha256file',
                color: 'orange'
            }]
        }, {
            module : 'en/encrypt',
            name : '加密解密',
            comment : '一些常见的加密解密操作，当然，需要不断完善',
            sub : [{
                icon: 'mdi-rotate-right',
                name : 'Rot系列编/解码（凯撒）',
                path : '/tools/rot'
            }, {
                icon: 'mdi-gold',
                name : '维吉尼亚密码',
                path : '/tools/vigenere'
            }, {
                icon: 'mdi-plus',
                name : '仿射密码',
                path : '/tools/affine'
            }, {
                icon: 'mdi-rotate-3d',
                name : 'Playfair密码',
                path : '/tools/playfair'
            }, {
                icon: 'mdi-lock-check',
                name : 'AES',
                path : '/tools/aes',
                color: 'orange'
            }, {
                icon: 'mdi-lock-check',
                name : 'DES',
                path : '/tools/des',
            }, {
                icon: 'mdi-lock-check',
                name : 'RSA',
                path : '/tools/rsa',
                color: 'orange'
            }, {
                icon: 'mdi-lock-off',
                name : 'RC4',
                path : '/tools/rc4'
            }, {
                icon: 'mdi-lock-check',
                name : 'TripleDES',
                path : '/tools/tripledes'
            }]
            // }, {
            //     name : '仿射密码',
            //     path : '/tools/affine'
            // }]
        }, ]
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
    line-height: 70px;
    border-radius: 8px;
}
</style>