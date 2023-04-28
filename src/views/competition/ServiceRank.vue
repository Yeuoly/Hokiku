<template>
    <div>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-center">
                            排名
                        </th>
                        <th class="text-left">
                            用户昵称
                        </th>
                        <th class="text-left">
                            分数
                        </th>
                        <th class="text-left">
                            分步分数
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(i, k) in rank"
                        :key="k"
                    >
                        <td v-if="k == 0" class="text-center">
                            <v-icon>
                                mdi-license 
                            </v-icon>
                        </td>
                        <td v-else-if="k == 1" class="text-center">
                            <v-icon>
                                mdi-trophy-outline
                            </v-icon>
                        </td>
                        <td v-else-if="k == 2" class="text-center">
                            <v-icon>
                                mdi-trophy-award
                            </v-icon>
                        </td>
                        <td v-else class="text-center">
                            {{ k + 1 }}
                        </td>
                        <td>{{ i.username }}</td>
                        <td>{{ i.score }}</td>
                        <td>
                            <v-chip
                                dark
                                class="mr2"
                                v-for="(s, index) in i.step_score"
                                :key="index"
                                :color="s > 0 ? 'green' : 'red'"
                            >
                                {{ s }}
                            </v-chip>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_comp_service_rank } from '../../interface/service'
export default {
    data : () => ({
        rank : [],
        sid : 0
    }),
    methods : {
        async getRank(){
            const { data } = await api_comp_service_rank(this.sid)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                this.rank = data['data']['rank']
            }
        }
    },
    mounted(){
        this.sid = parseInt(this.$route.params.sid)
        if (!this.sid){
            this.$router.back()
            return
        }
        this.getRank()
    }
}
</script>

<style>

</style>