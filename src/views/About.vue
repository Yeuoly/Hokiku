<template>
    <!-- QA Page -->
    <v-container>
        <v-timeline>
            <v-timeline-item
                v-for="(item, index) in qa"
                :key="index"
                :color="timeline_colors[index % timeline_colors.length]"
                class="lighten-1"
            >
                <template v-slot:opposite>
                    <span>第{{ index + 1 }}项</span>
                </template>
                <v-card class="elevation-2">
                    <v-card-title class="text-h5 text-white" :class="'lighten-1 ' + timeline_colors[index % timeline_colors.length] + (isOdd(index) ? ' justify-end' : '')">
                        {{ item.question }}
                    </v-card-title>
                    <v-card-text>
                        <div v-html="item.answer"></div>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<script>
export default {
    data : () => ({
        qa : [{
            question : '什么是IrinaCTF？',
            answer : '我们是IrinaTeam，一个活跃在网络安全前线的团队，IrinaCTF是我们CTF团队的根基'
        }, {
            question : 'IrinaCTF可以为我带来什么？',
            answer : 'IrinaCTF秉承永远开放免费的原则，我们会持续收集各大比赛的练习题和WriteUp，并且提供免费的靶机给大家使用，目的只是为了创造一个良好的学习环境，为大家扫清学习路上的绊脚石，如果有需要，甚至可以联系平台管理人员举办比赛，我们无偿提供比赛环境。'
        }, {
            question : '怎么开始？',
            answer : '看到左上角那个小按钮了嘛，点它就好了，菜单都在里面，或者<a href="/login">点我</a>'
        }, {
            question : 'IrinaCTF和别的平台有什么区别？',
            answer : '我们面向个人及学校所有功能始终免费，面向新人，提供全面的学习路径和学习资料，并提供实战题目，还会持续推出如HVV前线实战复现包括且不限于内网渗透等全新靶机，面向CTF且面向实战'
        }, {
            question : '如果我想举办比赛怎么办？',
            answer : '准备好比赛用题docker镜像，提供WriteUp、题目描述、Hint等基本信息，或者联系平台管理员从题库抽题，如果比赛规模较大，平台自身服务器并不能支撑，需要支出服务器费用，准备好资料联系管理员即可'
        }, {
            question : '我是一个小白，平台能提供什么？',
            answer : '良好的学习氛围和学习路线，免费开放的靶机环境，如果有学习需要，可以直接联系平台管理员学习'
        }, {
            question : '我想加入IrinaCTF，怎么做？',
            answer : 'IrinaCTF的开发目前由Yeuoly全程维护，团队也由Yeuoly管理，想加入的话，可以直接联系他'
        }, {
            question : '有群号吗？',
            answer : '怎么会没有，欢迎加入：757287635'
        }, {
            question : '待补充...', 
            answer : '待补充...'
        }],
        timeline_colors : ['blue', 'green', 'orange', 'red']
    }),
    methods : {
        isOdd(k) {
            return k % 2 == 1;
        }
    }
}
</script>

<style>

</style>