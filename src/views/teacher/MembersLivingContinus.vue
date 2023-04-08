<template>
    <v-container class="px5 pt5">
        <v-row class="px5 pt5">
            <v-col :cols="12" v-for="(i, k) in users" :key="k" class="px2 py2">
                <div class="living-continus-item">
                    {{ i.member.name }}
                </div>
                <div class="living-continus-chart">
                    <today-date-value-smooth-chart
                        :height="200"
                        title="今日在线时间"
                        subtext="ta今天卷了多久呢？"
                        :model="caculateToChart(i.continus)"
                    ></today-date-value-smooth-chart>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import TodayDateValueSmoothChart from '../../components/charts/TodayDateValueSmoothChart.vue'
import { openErrorSnackbar } from '../../concat/bus'
import {
    api_organization_member_living_continus_list
} from '../../interface/organization'

export default {
  components: { TodayDateValueSmoothChart },
    data : () => ({
        users : [],
        gid : 0
    }),
    methods : {
        async getLivingContinusList() {
            const { data } = await api_organization_member_living_continus_list(this.gid)
            if (!data) {
                openErrorSnackbar('获取个人信息失败')
            } else {
                if (data['res'] != 0) {
                    openErrorSnackbar(data['err'])
                } else if (data['data']) {
                    this.users = data['data']
                }
            }
        },
        caculateToChart(items) {
            const list = {
                time : [],
                value : []
            }
            for (let i = 0; i < items.length; i++) {
                const item = items[i]
                const start_time = item.created_at
                const end_time = item.updated_at
                console.log(start_time, end_time)
                for (let j = start_time; j <= end_time; j += 60) {
                    list.time.push(j)
                    list.value.push(1)
                }
            }
            return list
        }
    },
    mounted() {
        this.gid = parseInt(this.$route.params.gid)
        if (!this.gid) {
            this.$router.back()
            return
        }

        this.getLivingContinusList()
    }
}
</script>

<style scoped>
.living-continus-item {
    margin: 8px;
    float: left;
    width: 184px;
    line-height: 200px;
    text-align: center;
    font-size: 18px;
    color: white;
    background-color: rgb(255,185,128);
    border-radius: 20px 0 0 20px;
    font-weight: bold;
}
.living-continus-chart {
    float: left;
    width: calc(100% - 200px);
}
</style>