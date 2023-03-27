<template>
    <ECharts class="charts-items__fl"
             :options="polar"
             theme="theme"
             autoresize
    />
</template>

<script>
    import ECharts from 'vue-echarts';
    import 'echarts/lib/chart/bar';
    import 'echarts/lib/component/title';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/markLine';
    import 'echarts/lib/component/markPoint';
    import 'echarts/lib/component/grid';
    import 'echarts/lib/component/dataZoom';

    export default {
        name: "HorizontalBarCharts",
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
                let max_value = 0;
                this.model.value.forEach(e => {
                    e.forEach(v => {
                        if(v > max_value){
                            max_value = v;
                        }
                    });
                });
                let min_value = 9999999999999;
                this.model.value.forEach(e => {
                    e.forEach(v => {
                        if(v < min_value){
                            min_value = v;
                        }
                    });
                });
                const distance = (max_value - min_value) * 1.3

                this.model.value.forEach((e, i) => {
                    this.$set(this.polar.series, i, {
                        type : 'bar',
                        data : e,
                        barWidth : 30,
                        itemStyle:{
                            normal:{
                                color : function(params){
                                    function getColorByBaiFenBi(val){
                                        val = 100 - val;
                                        var one = (255+255) / 100;  
                                        var r=0;
                                        var g=0;
                                        var b=0;
                                    
                                        if ( val < 50 ) { 
                                            r = one * val;
                                            g=180;
                                        }
                                        if ( val >= 50 ) {
                                            g =  255 - ( (val - 50 ) * one) ;
                                            r = 255;
                                        }
                                        r = parseInt(r);// 取整
                                        g = parseInt(g);// 取整
                                        b = parseInt(b);// 取整
                                    
                                        return "rgb("+r+","+g+","+b+")";
                                    }
                                    const value = params.value;
                                    // min -> red, max -> green, use linear interpolation
                                    if (distance == 0 ){
                                        return getColorByBaiFenBi(100);
                                    }
                                    const bili = (value - min_value) / distance * 100;
                                    return getColorByBaiFenBi(bili);
                                }
                            }
                        }
                    });
                });
                this.polar.yAxis.data = this.model.category;
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
                    color : [
                        '#5470c6',
                        '#91cc75',
                        '#fac858',
                        '#ee6666',
                        '#73c0de',
                        '#3ba272',
                        '#fc8452',
                        '#9a60b4',
                    ],
                    xAxis : {
                        type : 'value',
                    },
                    yAxis : {
                        type : 'category',
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
                            return `${params[0].axisValue}<br>时值：${params[0].data}`
                        }
                    },
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
        height: 100%;
    }
</style>