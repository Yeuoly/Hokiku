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
                        Ascii编/解码
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>Ascii 即美国信息交换标准代码，输入Ascii字符串，系统会给出对应的字符串序列</li>
                            <li>输出为10进制，如果需要16进制请选择hex编码</li>
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
                    <v-text-field label="分割符" v-model="split"></v-text-field>
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

function asciiencode(str, split) {
    let res = ''
    for (let i = 0; i < str.length; i++) {
        res += str.charCodeAt(i).toString(10).padStart(2, '0')
        if (i !== str.length - 1) {
            res += split
        }
    }
    return res
}

function asciidecode(str, split) {
    let res = ''
    let arr = str.split(split)
    for (let i = 0; i < arr.length; i++) {
        res += String.fromCharCode(parseInt(arr[i], 10))
    }
    return res
}

export default {
    data : () => ({
        src : '',
        dst_type : 'encode',
        split : ',',
    }),
    computed : {
        dst() {
            switch (this.dst_type) {
                case 'encode':
                    return asciiencode(this.src, this.split)
                case 'decode':
                    return asciidecode(this.src, this.split)
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