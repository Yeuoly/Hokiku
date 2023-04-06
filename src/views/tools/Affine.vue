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

function isUppercase(c) {
    return c >= 65 && c <= 90;
}

function isLowercase(c) {
    return c >= 97 && c <= 122;
}

function gcd(a, b) {
    if (b == 0) {
        return a;
    }
    return gcd(b, a % b);
}

function phi(n) {
    var result = 1;
    for (var i = 2; i < n; i++) {
        if (gcd(i, n) == 1) {
            result++;
        }
    }
    return result;
}

function affineEncrypt (str, a, b) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (isUppercase(c)) {
            result += String.fromCharCode((a * (c - 65) + b) % 26 + 65);
        } else if (isLowercase(c)) {
            result += String.fromCharCode((a * (c - 97) + b) % 26 + 97);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}

function convert(a, b) {
    //use A^-1 = A^(phi(n)-1) (mod n)
    return Math.pow(a, phi(26) - 1) * b % 26;
}

function affineDecrypt (str, a, b) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (isUppercase(c)) {
            result += String.fromCharCode((convert(a, 26) * (c - 65 - b) + 26) % 26 + 65);
        } else if (isLowercase(c)) {
            result += String.fromCharCode((convert(a, 26) * (c - 97 - b) + 26) % 26 + 97);
        } else {
            result += str.charAt(i);
        }
    }
    return result;
}

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