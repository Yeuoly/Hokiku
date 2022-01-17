<template>
    <div>
        <v-row>
            <v-col xl="12" lg="12" md="12" sm="12" cols="12">
                <DateValueSmoothChart
                    title="得分情况"
                    subtext="具体解题情况"
                    :model="history"
                    style="width: 100%"
                />
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="6" style="height : 300px">
                <PieCharts 
                    title="题目类型" 
                    subtext="已经完成了的题目类型的所占百分比" 
                    :model="{ data : rate_of_type }" 
                />
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="6" xl="6" style="height : 300px">
                <PieCharts 
                    title="题目分数分布" 
                    subtext="已经完成了的题目分数区间的所占百分比" 
                    :model="{ data : rate_of_score }" 
                />
            </v-col>
            <v-col xl="12" lg="12" md="12" sm="12" cols="12">
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    题目ID
                                </th>
                                <th class="text-left">
                                    题目标题
                                </th>
                                <th class="text-left">
                                    题目分数
                                </th>
                                <th class="text-left">
                                    完成日期
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(i, k) in list"
                                :key="k"
                            >
                                <td>{{ i.id }}</td>
                                <td>{{ i.title }}</td>
                                <td>{{ i.score }}</td>
                                <td>{{ new Date(i.time * 1000).formatDate('Y-M-D') }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import DateValueSmoothChart from '../../components/charts/DateValueSmoothChart.vue'
import PieCharts from '../../components/charts/PieCharts.vue'
import { openErrorMessageBox } from '../../concat/bus'
import { api_competition_train_user_solved } from '../../interface/api'

export default {
    components : { PieCharts, DateValueSmoothChart },
    data : () => ({
        rate_of_type : [{
            name : 'Default',
            value : 0
        }, {
            name : 'Web',
            value : 0
        }, {
            name : 'Pwn',
            value : 0
        }, {
            name : 'Misc',
            value : 0
        }, {
            name : 'Reverse',
            value : 0
        }, {
            name : 'Crypto',
            value : 0
        }, {
            name : 'Mobile',
            value : 0
        }],
        rate_of_score : [{
            name : '0~100',
            value : 0
        }, {
            name : '100~200',
            value : 0
        }, {
            name : '200~300',
            value : 0
        }, {
            name : '300~400',
            value : 0
        }, {
            name : '400~500',
            value : 0
        }],
        list : [],
        history : {
            date : [],
            value : [[]]
        },
    }),
    methods : {
        async load(){
            const uid = this.$store.getters.getUserUid
            if(uid <= 0){
                await openErrorMessageBox('错误', '请先登陆')
                this.$router.push('/login')
            }
            const { data } = await api_competition_train_user_solved(uid)
            if(!data){
                openErrorMessageBox('错误', '网络错误')
            }else{
                if(data['res'] != 0){
                    openErrorMessageBox('错误', data['err'])
                }else{
                    this.list = data['data']
                    let total = 0
                    let last_day = null
                    let last_value
                    for(const i of data['data']){
                        this.rate_of_type[i['type']].value++
                        const index = parseInt((i['score'] - 1) / 100)
                        this.rate_of_score[index].value++
                        const time_day = (i['time'] - i['time'] % 86400) / 86400
                        if(last_day){
                            const distance = time_day - last_day
                            for(let i = 1; i < distance; i++){
                                const date = new Date((last_day + i) * 86400000).formatDate('Y-M-D')
                                this.history.date.push(date)
                                this.history.value[0].push(last_value)
                            }
                            total += i['score']
                            last_value = total
                            this.history.date.push(new Date(i['time'] * 1000).formatDate('Y-M-D'))
                            this.history.value[0].push(total)
                        }else{
                            total = i['score']
                            last_value = total
                            last_day = time_day
                            this.history.date.push(new Date(i['time'] * 1000).formatDate('Y-M-D'))
                            this.history.value[0].push(total)
                        }
                    }
                }
            }
        }
    },
    mounted(){
        this.load()
    }
}
</script>

<style>

</style>