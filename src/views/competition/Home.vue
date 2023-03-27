<template>
    <div>
        <v-row>
            <v-col cols="6">
                <v-subheader>
                    我的数据分析
                </v-subheader>
                <v-card-text>
                    总分：{{ score }}
                    </v-card-text>
                    <RadarCharts
                        title="统计"
                        subtext="你是什么多边形战士！"
                        :indicator="statistics_indicator"
                        :model="{ data: [{ value : statistics_category_value, name : $store.getters.getUserName }] }"
                        style="width: 100%; height: 300px"
                    />
            </v-col>
            <v-col cols="6">
                <v-card-text>
                    <v-simple-table>
                        <thead>
                            <tr>
                                <th>分类</th>
                                <th>已解决/总量</th>
                                <th>进度</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i, k) in statistics_indicator" :key="k">
                                <td>{{ i.name }}</td>
                                <td>{{ statistics_category_value[k] }} / {{ i.total }}</td>
                                <td>
                                <v-progress-circular
                                        :width="3"
                                        :value="(statistics_category_value[k]/i.total) * 100"
                                        color="green"
                                    >
                                    </v-progress-circular>
                                </td>
                                <td>
                                    %{{(statistics_category_value[k]/i.total*100).toFixed(2)}}
                                </td>
                            </tr>
                        </tbody>
                    </v-simple-table>
                </v-card-text>
            </v-col>
            <v-col xl="12" lg="12" md="12" sm="12" cols="12">
                <DateValueSmoothChart
                    title="得分情况"
                    subtext="具体解题情况"
                    :model="history"
                    style="width: 100%; height: 200px"
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
                                    赛事ID
                                </th>
                                <th class="text-left">
                                    赛事标题
                                </th>
                                <th class="text-left">
                                    持续时间
                                </th>
                                <th class="text-left">
                                    得分
                                </th>
                                <th class="text-left">
                                    状态
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(i, k) in signups"
                                :key="k"
                            >
                                <td>{{ i.r_competition_game.id }}</td>
                                <td>{{ i.r_competition_game.title }}</td>
                                <td>
                                    {{ new Date(i.r_competition_game.game_start_time * 1000).formatDate('Y-M-D h:m:s') }} ~
                                    {{ new Date(i.r_competition_game.game_end_time * 1000).formatDate('Y-M-D h:m:s') }}
                                </td>
                                <td>
                                    {{ i.score }}
                                </td>
                                <td>
                                    {{ getGameStatus(i.r_competition_game.game_start_time, i.r_competition_game.game_end_time) }}
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
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
import DateValueSmoothChart from "../../components/charts/DateValueSmoothChart.vue";
import PieCharts from "../../components/charts/PieCharts.vue";
import RadarCharts from '../../components/charts/RadarCharts.vue'
import { openErrorMessageBox } from "../../concat/bus";
import {
  api_competition_train_user_solved,
  api_competition_game_signup_my,
  api_competition_train_get_score
} from "../../interface/api";

export default {
  components: { PieCharts, DateValueSmoothChart, RadarCharts },
  data: () => ({
    rate_of_type: [
      {
        name: "Default",
        value: 0,
      },
      {
        name: "Web",
        value: 0,
      },
      {
        name: "Pwn",
        value: 0,
      },
      {
        name: "Misc",
        value: 0,
      },
      {
        name: "Reverse",
        value: 0,
      },
      {
        name: "Crypto",
        value: 0,
      },
      {
        name: "Mobile",
        value: 0,
      },
    ],
    rate_of_score: [
      {
        name: "0~100",
        value: 0,
      },
      {
        name: "100~200",
        value: 0,
      },
      {
        name: "200~300",
        value: 0,
      },
      {
        name: "300~400",
        value: 0,
      },
      {
        name: "400~500",
        value: 0,
      },
    ],
    list: [],
    score : 0,
    history: {
      date: [],
      value: [[]],
    },
    signups: [],
    statistics_category_value : [0,0,0,0,0,0],
    statistics_indicator : [{
        name : 'Web',
        max : 0,
        total : 0
    },{
        name : 'Pwn',
        max : 0,
        total : 0
    },{
        name : 'Misc',
        max : 0,
        total : 0
    },{
        name : 'Reverse',
        max : 0,
        total : 0
    },{
        name : 'Misc',
        max : 0,
        total : 0
    },{
        name : 'Mobile',
        max : 0,
        total : 0
    }]
  }),
  methods: {
    async load() {
      const uid = this.$store.getters.getUserUid;
      if (uid <= 0) {
        await openErrorMessageBox("错误", "请先登陆");
        this.$router.push("/login");
      }
      const { data } = await api_competition_train_user_solved(uid);
      if (!data) {
        openErrorMessageBox("错误", "网络错误");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          if (data["data"]) {
            this.list = data["data"];
            let total = 0;
            let last_day = null;
            let last_value;
            for (const i of data["data"]) {
              this.rate_of_type[i["type"]].value++;
              const index = parseInt((i["score"] - 1) / 100);
              this.rate_of_score[index].value++;
              const time_day = (i["time"] - (i["time"] % 86400)) / 86400;
              if (last_day) {
                const distance = time_day - last_day;
                for (let i = 1; i < distance; i++) {
                  const date = new Date((last_day + i) * 86400000).formatDate(
                    "Y-M-D"
                  );
                  this.history.date.push(date);
                  this.history.value[0].push(last_value);
                }
                total += i["score"];
                last_value = total;
                this.history.date.push(
                  new Date(i["time"] * 1000).formatDate("Y-M-D")
                );
                this.history.value[0].push(total);
              } else {
                total = i["score"];
                last_value = total;
                last_day = time_day;
                this.history.date.push(
                  new Date(i["time"] * 1000).formatDate("Y-M-D")
                );
                this.history.value[0].push(total);
              }
            }
          }
        }
      }

      const { data: data2 } = await api_competition_game_signup_my();
      if (!data2) {
        openErrorMessageBox("错误", "网络错误");
      } else {
        if (data2["res"] != 0) {
          openErrorMessageBox("错误", data2["err"]);
        } else {
          if (data2["data"]) {
            this.signups = data2["data"];
          }
        }
      }
    },
    async getScore(){
        const uid = this.$store.getters.getUserUid
        const { data } = await api_competition_train_get_score(uid)
        if(data && data['res'] == 0){
            this.score = data['data']['score']
            const radar = data['data']['radar']
            if (radar) {
                radar.forEach(e => {
                    if(e.type > 0) {
                        this.statistics_indicator[e.type - 1].total = e.total
                        this.statistics_category_value[e.type - 1] = e.solved
                    }
                })
                const max = Math.max(...radar.map(v => v.solved))
                this.statistics_indicator.forEach(e => { e.max = max })
            }
        }
    },
    getGameStatus(start_time, end_time) {
      const current_time = parseInt(new Date().getTime() / 1000);
      if (current_time < start_time) {
        return "未开始";
      } else if (current_time > end_time) {
        return "已结束";
      } else {
        return "进行中";
      }
    },
  },
  mounted() {
    this.load();
    this.getScore();
  },
};
</script>

<style>
</style>