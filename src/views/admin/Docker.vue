<template>
    <v-row>
        <v-col :cols="12">
            <v-card>
                <v-card-title>
                    Kisara 节点状态
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col :cols="6" v-for="(i, k) in nodes" :key="k" class="px2 py2">
                            <v-row>
                                <v-col :cols="12">
                                    <div class="px2">
                                        节点 : {{ i.Client.client_id }}
                                    </div>
                                    <div class="px2">
                                        地址 : {{ i.Client.client_ip }} : {{ i.Client.client_port }}
                                    </div>
                                    <div class="px2">
                                        运行中的容器 : {{ i.Status.container_num }}
                                    </div>
                                </v-col>
                                <v-col :cols="12">
                                    <v-divider></v-divider>
                                </v-col>
                                <v-col :cols="6" :sm="6" :md="4" :lg="3" :xl="2">
                                    <v-progress-circular
                                        :size="100"
                                        :color="getColor(i.Status.cpu_usage)"
                                        :value="i.Status.cpu_usage"
                                    >
                                        CPU %{{ (i.Status.cpu_usage).toFixed(2) }}
                                    </v-progress-circular>
                                </v-col>
                                <v-col>
                                    <div class="px2 py2">
                                        <v-progress-linear
                                            height="20"
                                            :value="i.Status.memory_usage"
                                            :color="getColor(i.Status.memory_usage)"
                                        >
                                            <span class="caption">
                                                内存占用率 {{ i.Status.memory_usage }}%
                                            </span>
                                        </v-progress-linear>
                                    </div>
                                    <div class="px2 py2">
                                        <v-progress-linear
                                            height="20"
                                            :value="i.Status.disk_usage"
                                            :color="getColor(i.Status.disk_usage)"
                                        >
                                            <span class="caption">
                                                硬盘占用率 {{ i.Status.disk_usage }}%
                                            </span>
                                        </v-progress-linear>
                                    </div>
                                    <div class="px2 py2">
                                        <v-progress-linear
                                            height="20"
                                            :value="i.Status.container_usage * 100"
                                            :color="getColor(i.Status.container_usage * 100)"
                                        >
                                            <span class="caption">
                                                容器占用率 {{ i.Status.container_usage * 100 }}%
                                            </span>
                                        </v-progress-linear>
                                    </div>
                                </v-col>
                                <v-col :cols="12">
                                    <v-divider></v-divider>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card-title>
                Irina 容器状态
            </v-card-title>
            <v-card>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th>容器名</th>
                                <th>容器ID</th>
                                <th>创建者</th>
                                <th>镜像</th>
                                <th>端口映射</th>
                                <th>状态</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i, k) in containers" :key="k">
                                <td>{{ i.id.substr(0, 12) }}</td>
                                <td>{{ i.uuid.substr(0, 8) }}</td>
                                <td>{{ i.username }}</td>
                                <td>{{ i.image }}</td>
                                <td>{{ i.host_port }}</td>
                                <td>{{ i.status }}</td>
                                <td>{{ new Date(i.time * 1000).formatDate('M-D h:m:s') }}</td>
                                <td>
                                    <v-btn color="error" small icon @click="stop(i.id)">停止</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
            <v-card>
                <v-card-title>
                    容器启动日志
                </v-card-title>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th>用户</th>
                                <th>时间</th>
                                <th>镜像</th>
                                <th>端口映射</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i, k) in container_history" :key="k">
                                <td>{{ i.username }}</td>
                                <td>{{ new Date(i.time * 1000).formatDate('Y-M-D h:m:s') }}</td>
                                <td>{{ i.image }}</td>
                                <td>{{ i.host_port }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                    <div class="text-center">
                        <v-pagination
                            v-model="container_history_page"
                            :length="9999"
                            :total-visible="5"
                            circle
                        ></v-pagination>
                    </div>
            </v-card>
            <v-card>
                <v-card-title>
                    Docker镜像状态
                    <div class="pl5">
                        <v-btn color="primary" @click="startSync">同步</v-btn>
                    </div>
                    <div class="pl5">
                        <v-progress-circular
                            :width="2"
                            :indeterminate="syncing"
                            color="primary"
                            class="clickable"
                            @click="openSyncDialog"
                        >
                            <v-icon v-if="syncing">
                                mdi-spin mdi-loading
                            </v-icon>
                            <v-icon v-else>
                                mdi-check
                            </v-icon>
                        </v-progress-circular>
                    </div>
                </v-card-title>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <td>镜像ID</td>
                                <td>镜像名</td>
                                <td>占用空间</td>
                                <td>操作</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i, k) in images" :key="k">
                                <td>{{ i.id.substr(0, 12) }}</td>
                                <td>{{ i.name }}</td>
                                <td>{{ (i.virtual_size / 1024 / 1024).toFixed(2) }}MB</td>
                                <td>
                                    <v-btn color="error" small icon @click="removeImage(i.id)">删除</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
        <v-dialog v-model="syncing_dialog" max-width="600">
            <v-card>
                <v-card-title>
                    同步镜像
                </v-card-title>
                <v-card-text>
                    <div class="warped-status-text" ref="msg_box">
                        {{ syncing_message }}
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus'
import { 
    api_docker_container_list, 
    api_docker_container_stop,
    api_docker_image_list,
    api_docker_image_core_delete,
    api_docker_sync,
    api_docker_sync_check,
    api_docker_container_history
} from '../../interface/api'
import {
    api_get_docker_nodes
} from '../../interface/docker'

import { sleep } from '../../util'

export default {
    data : () => ({
        containers : [],
        container_history : [],
        nodes : [],
        container_history_page : 1,
        images : [],
        syncing : false,
        syncing_message : '',
        syncing_dialog : false,
        node_timer : null
    }),
    watch : {
        container_history_page() {
            this.loadHistory()
        }
    },
    methods : {
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
        },
        async loadNodes() {
            const { data } = await api_get_docker_nodes()
            if(data && data['res'] == 0){
                this.nodes = data['data']
            }
        },
        async loadHistory() {
            const { data:history } = await api_docker_container_history(this.container_history_page, 15)
            if(history && history['res'] == 0){
                this.container_history = history['data']
            }
        },
        async loadImages() {
            const { data:images } = await api_docker_image_list()
            if(images && images['res'] == 0){
                this.images = images['data']
            }
        },
        async loadContainers() {
            const { data } = await api_docker_container_list()
            if(data && data['res'] == 0){
                this.containers = data['data']
            }
        },
        async load() {
            this.loadContainers()
            this.loadImages()
            this.loadHistory()
        },
        async stop(container_id) {
            await openInfoMessageBox('提示', '确定要停止容器吗？')
            const { data } = await api_docker_container_stop(container_id)
            if(data && data['res'] == 0){
                this.load()
            }
        },
        async removeImage(image_id) {
            await openInfoMessageBox('提示', '确定要删除镜像吗？')
            const { data } = await api_docker_image_core_delete(image_id.split(':')[1])
            if(data && data['res'] == 0){
                this.load()
            }
        },
        async sync() {
            await openInfoMessageBox('提示', '确定要同步数据库内镜像文件吗？')
            const { data } = await api_docker_sync()
            if(data && data['res'] == 0){
                this.syncCheck()
            } if(data && data['res'] != 0) {
                openErrorMessageBox('错误', data['err'])
            }
        },
        async syncCheck() {
            this.syncing = true
            let finished = false
            while(!finished) {
                await sleep(1000)
                const { data } = await api_docker_sync_check()
                if(data && data['res'] == 0){
                    if(typeof data['data'] != 'string'){
                        finished = true
                    }else{
                        this.syncing_message += data['data']
                        if(data['data'] != ''){
                            setTimeout(() => {
                                this.$refs.msg_box.scrollTop = this.$refs.msg_box.scrollHeight
                            })
                        }
                    }
                } else if(data && data['res'] != 0) {
                    finished = true
                }
            }
            this.syncing = false
            this.loadImages()
        },
        startSync() {
            this.syncing_message = '正在同步数据库内镜像文件\n'
            this.sync()
        },
        openSyncDialog() {
            this.syncing_dialog = true
        }
    },
    mounted() {
        this.load()
        this.loadNodes()
        this.node_timer = setInterval(() => {
            this.loadNodes()
        }, 10000)
    },
    beforeDestroy() {
        clearInterval(this.node_timer)
    }
}
</script>

<style>
    .warped-status-text {
        white-space: pre-wrap;
        max-height: 300px;
        overflow: scroll;
        overflow-x: unset
    }
</style>