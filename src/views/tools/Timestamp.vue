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
                        时间戳转换
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>时间戳转换，输入时间戳，系统会给出对应的时间</li>
                            <li>格式化时间戳中，大写YMD分别代表年月日，小写hms分别代表时分秒</li>
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
                    <v-text-field label="格式化" v-model="format"></v-text-field>
                </v-col>
                <v-col :cols="12">
                    <v-btn color="primary" @click="switchTo">转换</v-btn>
                    <v-btn color="primary" @click="getCurrent">获取当前时间戳</v-btn>
                </v-col>
                <v-col :cols="12">
                    <v-card-text>
                        <v-textarea
                            v-model="src"
                            label="原文"
                            outlined
                            rows="1"
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
                            rows="1"
                        ></v-textarea>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

function timeencode(src, format) {
    let date = new Date(src * 1000).formatDate(format)
    return date
}

function timedecode(src) {
    let date = new Date(src).getTime() / 1000
    return date
}

export default {
    data : () => ({
        src : '',
        dst_type : 'encode',
        format : 'Y/M/D h:m:s',
    }),
    computed : {
        dst() {
            switch (this.dst_type) {
                case 'encode':
                    return timeencode(this.src, this.format)
                case 'decode':
                    return timedecode(this.src, this.format)
            }
            return ''
        }
    },
    methods : {
        getCurrent() {
            this.src = Math.round(new Date().getTime() / 1000)
        },
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