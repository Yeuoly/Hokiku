<template>
    <div class="pt5">
        <v-row>
            <v-col :cols="12">
                <v-row>
                    <v-btn :color="btn_status.color" rounded @click="toggle">
                        {{ btn_status.text }}
                    </v-btn>
                    <v-btn color="success" class="ml2" rounded @click="overtime" :disabled="!is_running">
                        延长
                    </v-btn>
                    <v-chip color="primary" dark class="ml2">
                        虚拟机剩余时间：{{ status.remainder }}s
                    </v-chip>
                    <v-spacer></v-spacer>
                    <v-chip color="primary" dark class="ml2">
                        虚拟机地址：{{ status.address }}
                    </v-chip>
                    <v-chip color="green" dark class="ml2">
                        虚拟机访问密码：{{ status.password }}
                    </v-chip>
                </v-row>
            </v-col>
            <v-col :cols="12">
                <v-progress-linear value="100" color="primary" indeterminate height="3" class="mt-2" :active="status.launching"></v-progress-linear>
            </v-col>
            <v-col :cols="12" v-if="is_running">
                <v-btn :disabled="!is_running" @click="openWindow" color="primary">
                    启动窗口
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import { api_prodesign_vm_launch, api_prodesign_vm_launch_check, api_prodesign_vm_status, api_prodesign_vm_stop, api_prodesign_vm_overtime } from '../../interface/api'
import { sleep } from '../../util'
export default {
    data : () => ({
        status : {
            address : '127.0.0.0:0000',
            password : 'none',
            remainder : 0,
            launching : false
        },
        timer : null,
    }),
    computed : {
        is_running() {
            return this.status.remainder > 0
        },
        btn_status() {
            return { text : this.is_running ? '停止' : '启动', color : this.is_running ? 'error' : 'success' }
        }
    },
    watch : {
        is_running : {
            handler : function (to) {
                if(to){
                    this.timer = setInterval(() => {
                        this.status.remainder -= 1
                    }, 1000)
                }else{
                    clearInterval(this.timer)
                }
            },
            immediate : true
        }
    },
    methods : {
        toggle() {
            if(this.is_running){
                this.stop()
            }else{
                this.launch()
            }
        },
        openWindow() {
            window.open('http://' + this.status.address)
        },
        async getStatus() {
            const { data } = await api_prodesign_vm_status()
            if (data && data['res'] == 0) {
                if (data['data']['err'] == '') {
                    this.status.address = data['data']['info']['address']
                    this.status.password = data['data']['info']['password']
                    this.status.remainder = data['data']['info']['remainder']
                }
            }
        },
        async launch() {
            this.status.launching = true
            const { data } = await api_prodesign_vm_launch('code-server')
            if (data && data['res'] == 0) {
                const response_id = data['data']['token']
                for(;;) {
                    const { data : vm } = await api_prodesign_vm_launch_check(response_id)
                    if (vm && vm['res'] == 0) {
                        if (vm['data']['msg'] != '') {
                            if (vm['data']['msg'].indexOf('失败') != -1) {
                                openErrorSnackbar(vm['data']['msg'])
                                this.status.launching = false
                                return
                            }
                            this.status.launching = false
                            await this.getStatus()
                            openSuccessSnackbar('虚拟机启动成功，密码已复制到剪贴板，新窗口将在5秒后打开')
                            // copy password to clipboard
                            const input = document.createElement('input')
                            input.setAttribute('readonly', 'readonly')
                            input.setAttribute('value', this.status.password)
                            document.body.appendChild(input)
                            input.select()
                            if (document.execCommand('copy')) {
                                document.execCommand('copy')
                            }
                            document.body.removeChild(input)
                            await sleep(5000)
                            this.openWindow()
                            break
                        } else {
                            openErrorSnackbar(vm['err'])
                            this.status.launching = false
                            break
                        }
                    }
                    await sleep(1000)
                }
            } else {
                openErrorSnackbar(data ? data['err'] : '启动虚拟机失败')
            }
            this.status.launching = false
        },
        async stop() {
            const { data } = await api_prodesign_vm_stop()
            if (data && data['res'] == 0) {
                this.status.remainder = 0
            } else {
                openErrorSnackbar(data ? data['err'] : '停止虚拟机失败')
            }
        },
        async overtime() {
            const { data } = await api_prodesign_vm_overtime()
            if (data && data['res'] == 0 && data['data']['success']) {
                this.getStatus()
            } else {
                openErrorSnackbar(data ? data['err'] : '延长虚拟机失败')
            }
        }
    },
    mounted() {
        this.getStatus()
    }
}
</script>

<style>

</style>