<template>
    <ECharts class="charts-items__fl"
             :options="polar"
             theme="theme"
             autoresize
    />
</template>

<script>
    import ECharts from 'vue-echarts';
    import 'echarts/lib/chart/line';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/markLine';
    import 'echarts/lib/component/markPoint';
    import 'echarts/lib/component/grid';
    import 'echarts/lib/component/dataZoom';

    export default {
        name: "DateValueSmoothCharts",
        components : { ECharts },
        computed : {
            options(){
                return this.model;
            },
            _title(){
                return this.title;
            },
            _subtext(){
                return this.subtext;
            }
        },
        methods : {
            refreshData(){
                this.model.value.forEach((e, i) => {
                    this.$set(this.polar.series, i, {
                        type : 'line',
                        smooth : true,
                        markLine : {data : [{ type : 'average' , name : '平均值' }]},
                        markPoint : {data : [{ type : 'max', name : '峰值' }]},
                        data : e
                    });
                });
                this.polar.xAxis.data = this.model.date;
            }
        },
        watch : {
            options : {
                handler(){
                    this.refreshData();
                },
                immediate : true,
                deep : true,
            },
            _title : {
                handler(){
                    this.polar.title.text = `{title_text|${this.title}}`;
                },
                immediate : true
            },
            _subtext : {
                handler(){
                    this.polar.title.subtext = this.subtext;
                },
                immediate : true
            }
        },
        data(){
            return {
                polar : {
                    xAxis : {
                        type : 'category',
                    },
                    yAxis : {
                        type : 'value',
                        scale: true
                    },
                    grid : {
                        left : 73,
                        right : 73
                    },
                    series : [],
                    title : {
                        text : '',
                        subtext : '',
                        show : true,
                        textStyle : {rich:{title_text : 'blue'}}
                    },
                    tooltip : {
                        trigger : 'axis',
                        formatter(params){
                            return `日期：${params[0].axisValue}<br>时值：${params[0].data}`
                        }
                    },
                    dataZoom : [{
                        type : 'inside',
                        realtime : true,
                        start : 0,
                        end : 100
                    }, {
                        type : 'slider',
                        handleSize : '80%',
                        handleStyle: {
                            color: '#fff',
                            shadowBlur: 3,
                            shadowColor: 'rgba(0, 0, 0, 0.6)',
                        }
                    }]
                }
            }
        },
        props : {
            model : {
                default(){
                    return { date : [] , value : [] }
                },
                type : Object
            },
            title : {
                default : '时间-数据平滑折线',
                type : String
            },
            subtext : {
                default : '时间-数据平滑折线',
                type : String
            },
        }
    }
</script>

<style scoped>
    .charts-items__fl{
        width: 100%;
    }
</style>