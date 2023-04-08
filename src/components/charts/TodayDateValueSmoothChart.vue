<template>
  <date-value-smooth-chart-vue
    :title="title"
    :subtext="subtext"
    :model="{
        date: datetime,
        value: [values],
    }"
    :height="height"
  ></date-value-smooth-chart-vue>
</template>

<script>
import DateValueSmoothChartVue from "./DateValueSmoothChart.vue";

export default {
  components: {
    DateValueSmoothChartVue,
  },
  computed : {
    // datetime from 0:00 to 23:59
    datetime(){
      let datetime = [];
      for(let i = 0; i < 24 * 60; i++){
        datetime.push(`${Math.floor(i / 60)}:${i % 60}`)
      }
      return datetime;
    },
    values() {
        // caculate values from props.model
        const values = [];
        for (let i = 0; i < 24 * 60; i++) {
          values.push(0);
        }

        let today_begin = this.today_start_timestamp * 1000;
        let today_end = today_begin + 24 * 60 * 60 * 1000;
        today_begin = parseInt(today_begin / 1000);
        today_end = parseInt(today_end / 1000);
        this.model.time.forEach((e, i) => {
            const time = e
            if (time >= today_begin && time <= today_end) {
                // get the index of the time
                const index = parseInt((time - today_begin) / 60);
                values[index] = this.model.value[i];
            }
        });

        return values;
    }
  },
  props: {
    model: {
      default() {
        return { time: [], value: [] };
      },
      type: Object,
    },
    title: {
      default: "时间-数据平滑折线",
      type: String,
    },
    subtext: {
      default: "时间-数据平滑折线",
      type: String,
    },
    today_start_timestamp: {
      default: new Date().setHours(0, 0, 0, 0) / 1000,
      type: Number,
    },
    height : {
        default : 400,
        type : Number
    }
  },
};
</script>

<style>
</style>