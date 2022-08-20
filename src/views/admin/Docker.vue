<template>
    <v-row>
        <v-col :cols="12">
            <v-card-title>
                Docker容器状态
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
                                <td>{{ i.owner }}</td>
                                <td>{{ i.image }}</td>
                                <td>{{ i.host_port }}</td>
                                <td>{{ i.status }}</td>
                                <td>{{ new Date(i.time).formatDate('M-D h:m:s') }}</td>
                                <td>
                                    <v-btn color="error" small icon @click="stop(i.id)">停止</v-btn>
                                    <v-btn color="success" small icon>延期</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { openInfoMessageBox } from '../../concat/bus'
import { api_docker_container_list, api_docker_container_stop } from '../../interface/api'

export default {
    data : () => ({
        containers : []
    }),
    methods : {
        async load() {
            const { data } = await api_docker_container_list()
            if(data && data['res'] == 0){
                this.containers = data['data']
            }
        },
        async stop(container_id) {
            await openInfoMessageBox('提示', '确定要停止容器吗？')
            const { data } = await api_docker_container_stop(container_id)
            if(data && data['res'] == 0){
                this.load()
            }
        },
        async applyTime() {
            
        }
    },
    mounted() {
        this.load()
    }
}
</script>

<style>

</style>