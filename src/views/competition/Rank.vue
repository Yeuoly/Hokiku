<template>
    <div>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">
                            排名
                        </th>
                        <th class="text-left">
                            用户昵称
                        </th>
                        <th class="text-left">
                            用户ID
                        </th>
                        <th class="text-left">
                            分数
                        </th>
                        <th class="text-left">
                            擅长领域
                        </th>
                        <th class="text-center">
                            标签
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
                        <td>{{ i.name }}</td>
                        <td>{{ i.uid }}</td>
                        <td>{{ i.score }}</td>
                        <td>{{ train_types[i.main_foucs] }}</td>
                        <td>
                            <v-chip-group>
                                <v-chip v-for="(j, l) in i.tags" :key="l" :color="tags_colors[l]">
                                    {{ j.name }}
                                </v-chip>
                            </v-chip-group>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus'
import { api_competition_train_rank } from '../../interface/api'
export default {
    data : () => ({
        rank : [],
        train_types : ['DEFAULT', 'WEB', 'PWN', 'MISC', 'REVERSE', 'CRYPTO', 'MOBILE'],
        tags_colors : ['primary', 'success', 'info'],
    }),
    methods : {
        async getRank(){
            const { data } = await api_competition_train_rank()
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                this.rank = data['data']
            }
        }
    },
    mounted(){
        this.getRank()
    }
}
</script>

<style>

</style>