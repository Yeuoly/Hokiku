<template>
    <div class="kurumi">
        <v-container>
            <v-layout>
                <v-card flat class="w100">
                    <v-row>
                        <v-col :cols="12">
                                <v-alert
                                    outlined
                                    type="success"
                                    text
                                >
                                    Kurumi
                                </v-alert>
                            <v-divider></v-divider>
                            <v-card-text>
                                <v-icon color="green">
                                    mdi-information
                                </v-icon>
                                一些须知：
                                <ul>
                                    <li>Kurumi是Irina平台自带的加壳工具，使用Golang实现，壳的强度可以自己选择</li>
                                    <li>Kurumi只提供加壳不提供脱壳，因为我会随着版本迭代不断加强Kurumi</li>
                                    <li>Kurumi取自动画Lycoris Recoil中的胡桃Wulnut，她是一位超可爱的妹子黑客</li>
                                    <li>Kurumi确保不会对用户的源程序做任何本地保留，在完成加壳以后，会自动删除</li>
                                    <li>下载后的文件名会被保存为xxx.txt请自行修改后缀</li>
                                    <li>Kurumi是Irina的模块之一</li>
                                    <li>你可以随意使用Kurumi满足你的业务需求，但是不允许私自对Kurumi的接口进行二次封装盈利</li>
                                    <li>现在Irina还在成长阶段，在平台自身可以支撑的情况下，我们不会进行任何收费服务，但是如果出现对平台的大规模攻击，不确保会不会采取特殊手段</li>
                                </ul>
                                <v-divider></v-divider>
                            </v-card-text>
                        </v-col>
                        <v-col :cols="12">
                            <v-alert
                                outlined
                                type="success"
                                text
                            >
                                加密算法选择：不同的加密算法有不同的加密强度，同时，对生成的程序的体积也会有一定影响，根据程序自身特点选择，有时候加密算法选择不好会导致程序最终体积过大
                            </v-alert>
                            <v-radio-group v-model="selected_method" row>
                                <v-radio v-for="(i, k) in methods" :key="k"
                                    :label="i"
                                    :value="i"
                                ></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col :cols="12">
                            <v-alert
                                outlined
                                type="success"
                                text
                            >
                                混淆器选择：混淆器决定最终程序会被混淆成什么牛马样，越离谱的混淆器混淆出来的越难看懂，有时候可以说是毛都看不懂，当然，混淆器的选择也会影响程序的体积，根据程序自身特点选择
                            </v-alert>
                            <v-radio-group v-model="selected_mixer" row>
                                <v-radio v-for="(i, k) in mixers" :key="k"
                                    :label="i"
                                    :value="i"
                                ></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col :cols="12">
                            <v-alert
                                outlined
                                type="success"
                                text
                            >
                                反调试器选择：不同的反调试器的原理不同，还是根据你的自身需求，选定需要的反调试器，它们会让调试器亲妈都不认识
                            </v-alert>
                            <v-radio-group v-model="selected_anti_debugger" row>
                                <v-radio v-for="(i, k) in anti_debuggers" :key="k"
                                    :label="i"
                                    :value="i"
                                ></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col :cols="12">
                            <v-alert
                                outlined
                                type="success"
                                text
                            >
                                文件上传：暂时只支持x86平台下的Linux/ELF文件
                            </v-alert>
                            <v-file-input
                                show-size
                                label="请选择需要加壳的程序"
                                v-model="selected_file"
                            ></v-file-input>
                        </v-col>
                        <v-col :cols="12">
                            <v-btn color="primary" @click="apply">
                                提交加壳申请
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { api_tmpfile_download, api_tools_shell_apply, api_tools_shell_check, api_tools_shell_list } from '../../interface/api'
import { sleep } from '../../util'
export default {
    data : () => ({
        methods : [],
        mixers : [],
        anti_debuggers : [],
        selected_method : '',
        selected_mixer : '',
        selected_anti_debugger : '',
        selected_file : null
    }),
    methods : {
        async load() {
            const { data } = await api_tools_shell_list()
            if(data && data['res'] == 0) {
                this.methods = data['data']['methods']
                this.selected_method = this.methods[0]
                this.mixers = data['data']['mixers']
                this.selected_mixer = this.mixers[0]
                this.anti_debuggers = data['data']['anti_debuggers']
                this.selected_anti_debugger = this.anti_debuggers[0]
            } 
        },
        async apply() {
            const { data } = await api_tools_shell_apply(this.selected_method, this.selected_mixer, this.selected_anti_debugger, this.selected_file);
            if(data && data['res'] == 0) {
                if(data['data']['success']) {
                    openInfoMessageBox('成功', '提交申请成功，请不要离开当前页面！在后台完成工作后，会自动开始下载进程')
                    const request_id = data['data']['request_id']
                    let finsihed = false
                    while(!finsihed) {
                        const { data : check } = await api_tools_shell_check(request_id)
                        if(check && check['res'] == 0) {
                            if(check['data']['finished']) {
                                const result = JSON.parse(check['data']['result'])
                                if (result['success']) {
                                    api_tmpfile_download(result['token'])
                                } else {
                                    openErrorMessageBox('失败', '发生错误')
                                }
                                break
                            }
                        } else {
                            finsihed = true
                            openErrorMessageBox('错误', '发生错误')
                        }
                        await sleep(1000)
                    }
                } 
            } else {
                openErrorMessageBox('错误', data ? data['err'] : '网络连接错误')
            }
        }
    },
    mounted() {
        this.load()
    }
}
</script>

<style>

</style>