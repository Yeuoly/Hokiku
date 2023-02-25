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
            question : '待补充',
            answer : '待补充'
        },{
            question : '待补充',
            answer : '待补充'
        },{
            question : '待补充',
            answer : '待补充'
        },{
            question : '待补充',
            answer : '待补充'
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