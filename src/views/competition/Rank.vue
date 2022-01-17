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
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(i, k) in rank"
                        :key="k"
                    >
                        <td>{{ k + 1 }}</td>
                        <td>{{ i.name }}</td>
                        <td>{{ i.uid }}</td>
                        <td>{{ i.score }}</td>
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
        rank : []
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