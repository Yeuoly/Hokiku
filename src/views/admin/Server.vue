<template>
    <v-row>
        <v-col :cols="6">
            <v-card-title style="padding: 0; padding-left: 15px">
                服务器状态
            </v-card-title>
        </v-col>
        <v-col :cols="6"></v-col>
        <!-- display CPU MEM DISK info -->
        <v-col :cols="12">
            <v-card-text>
                <v-row>
                    <v-col :cols="12">
                        <v-card-title style="padding: 0; padding-left: 15px">
                            CPU信息
                        </v-card-title>
                    </v-col>
                    <v-col md="6" sm="12" lg="6" xl="4"
                        v-for="(i, k) in info.cpu"
                        :key="k"
                    >
                        <v-card class="px2">
                            <v-row>
                                <v-col cols="4">
                                    <v-progress-circular
                                        :size="100"
                                        :width="8"
                                        :value="i.usage"
                                        :color="getColor(i.usage)"
                                    >
                                        %{{ (i.usage).toFixed(2) }}
                                    </v-progress-circular>
                                </v-col>
                                <v-col>
                                    模块名称：{{ i.model_name }} <br>
                                    核心数：{{ i.cores }} <br>
                                    核心频率：{{ i.mhz }}Mhz <br>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-col :cols="12">
                        <v-card-title style="padding: 0; padding-left: 15px">
                            内存信息
                        </v-card-title>
                            <v-card>
                                <v-card-text>
                                    内存总量：{{ info.mem.total }}MB <br>
                                    已用内存：{{ info.mem.usage }}MB <br>
                                    剩余内存：{{ (info.mem.total - info.mem.usage).toFixed(2) }}MB <br>
                                </v-card-text>
                                <v-progress-linear
                                    height="20"
                                    :value="info.mem.usage_percent"
                                    :color="getColor(info.mem.usage_percent)"
                                >
                                    <span class="caption">
                                        {{ info.mem.usage_percent }}%
                                    </span>
                                </v-progress-linear>
                            </v-card>
                    </v-col>
                    <v-col :cols="12">
                        <v-card-title style="padding: 0; padding-left: 15px">
                            磁盘信息
                        </v-card-title>
                        <v-card>
                            <v-card-text>
                                磁盘总量：{{ info.disk.total }}MB - {{ (info.disk.total / 1024).toFixed(2) }} GB<br>
                                已用磁盘：{{ info.disk.usage }}MB - {{ (info.disk.usage / 1024).toFixed(2) }} GB<br>
                                剩余磁盘：{{ (info.disk.total - info.disk.usage).toFixed(2) }}MB - {{ ((info.disk.total - info.disk.usage) / 1024).toFixed(2) }} GB<br>
                            </v-card-text>
                            <v-progress-linear
                                height="20"
                                :value="info.disk.usage_percent"
                                :color="getColor(info.disk.usage_percent)"
                            >
                                <span class="caption">
                                    {{ info.disk.usage_percent }}%
                                </span>
                            </v-progress-linear>
                        </v-card>
                    </v-col>
                    <v-col :cols="12">
                        <v-card-title style="padding: 0; padding-left: 15px">
                            进程信息
                        </v-card-title>
                        <v-card>
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th>PID</th>
                                            <th>进程名</th>
                                            <th>用户</th>
                                            <th>占用内存</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(i, k) in info.process" :key="k">
                                            <td>{{ i.pid }}</td>
                                            <td>{{ i.name }}</td>
                                            <td>{{ i.user }}</td>
                                            <td>{{ (i.memory / 1024 / 1024).toFixed(2) }}MB</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-col>
    </v-row>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_native_server_param } from '../../interface/api'

export default {
    data : () => ({
        info : {
            cpu : [{
                model_name : '',
                usage : 0.75,
            }],
            mem : {
                total : 0,
                usage : 0,
                usage_percent : 0,
            },
            disk : {
                total : 0,
                usage : 0,
                usage_percent : 0,
            },
            process : []
        },
        timer : null
    }),
    methods : {
        async load() {
            const { data } = await api_native_server_param()
            if (!data) {
                openErrorMessageBox('错误', '网络错误')
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err'])
                } else {
                    this.info.cpu = data['data']['cpu']
                    this.info.mem.total = (data['data']['mem']['total'] / 1024 / 1024).toFixed(2)
                    this.info.mem.usage = (data['data']['mem']['used'] / 1024 / 1024).toFixed(2)
                    this.info.mem.usage_percent = data['data']['mem']['used_percent'].toFixed(2)
                    this.info.disk.total = (data['data']['disk']['total'] / 1024 / 1024).toFixed(2)
                    this.info.disk.usage = (data['data']['disk']['used'] / 1024 / 1024).toFixed(2)
                    this.info.disk.usage_percent = data['data']['disk']['used_percent'].toFixed(2)

                    //data['data']['process'] sort by memory
                    this.info.process = data['data']['process'].sort((a, b) => {
                        return b.memory - a.memory
                    })
                }
            }
        },
        getColor(val) {
            var one = (255+255) / 100;  
            var r=0;
            var g=0;
            var b=0;
        
            if ( val < 50 ) { 
                r = one * val;
                g=180;
            }
            if ( val >= 50 ) {
                g =  255 - ( (val - 50 ) * one) ;
                r = 255;
            }
            r = parseInt(r);// 取整
            g = parseInt(g);// 取整
            b = parseInt(b);// 取整
        
            return "rgb("+r+","+g+","+b+")";
        }
    },
    mounted() {
        this.load()
        this.timer = setInterval(() => {
            this.load()
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>

<style>

</style>