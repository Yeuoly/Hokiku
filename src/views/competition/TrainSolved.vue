<template>
    <v-container>
        <v-card width="100%">
            <v-toolbar color="primary">
                <v-toolbar-title class="text-white">
                    {{ train_info.title }}排行榜
                </v-toolbar-title>
            </v-toolbar>
            <div class="px5 py2">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    UID
                                </th>
                                <th class="text-left">
                                    用户名
                                </th>
                                <th class="text-left">
                                    解题时间
                                </th>
                                <th class="text-left">
                                    123血
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(i, k) in list"
                                :key="k"
                            >
                                <td>{{ i.uid }}</td>
                                <td>{{ i.name }}</td>
                                <td>
                                    {{ new Date(i.time * 1000).formatDate('Y-M-D h:m:s') }}
                                </td>
                                <td>
                                    {{ getRank(k + 1) }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </div>
        </v-card>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_competition_train_solved_user } from '../../interface/api'
export default {
    name : 'TrainSolved',
    data : () => ({
        train_id : 0,
        list : [],
        train_info : {
            score : 0,
            title : ''
        }
    }),
    methods : {
        async load() {
            const { data } = await api_competition_train_solved_user(this.train_id)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                this.list = data['data']['list'] == null ? [] : data['data']['list']
                this.train_info.score = data['data']['train_info']['score']
                this.train_info.title = data['data']['train_info']['title']
            }
        },
        getRank(pos) {
            if (pos <= 3) {
                return `${pos}血`
            } else {
                return ''
            }
        }
    },
    mounted() {
        this.train_id = parseInt(this.$route.params.train_id)
        if(this.train_id <= 0) {
            openErrorMessageBox('错误', '参数错误')
            return
        }
        this.load()
    }
}
</script>

<style>

</style>