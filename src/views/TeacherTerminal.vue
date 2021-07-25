<template>
    <v-container style="margin-top: 30px; margin-bottom: 30px">
        <v-card>
            <v-toolbar color="primary">
                <v-toolbar-title class="text-white">
                    教师管理
                </v-toolbar-title>
                <template v-slot:extension>
                    <v-tabs v-model="current_tab" align-with-title>
                        <v-tabs-slider color="black"></v-tabs-slider>
                        <v-tab v-for="(i, key) in tabs" :key="key">
                            <span class="text-white">
                                {{ i }}
                            </span>
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
            <v-tabs-items v-model="current_tab">
                <v-tab-item :key="0">
                    <v-container>
                        <v-row>
                            <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
                                <v-text-field
                                    label="作业名"
                                ></v-text-field>
                            </v-col>
                            <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
                                <v-menu
                                    v-model="date_picker_menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="end_at"
                                            label="截止时间"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="end_at"
                                        @input="date_picker_menu = false"
                                        :min="new Date().formatDate('Y-M-D')"
                                        locale="zh-cn"
                                    ></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
                                <v-select
                                    label="发布到班级"
                                    :items="classes"
                                    menu-props="auto"
                                    single-line
                                    v-model="target_class"
                                ></v-select>
                            </v-col>
                            <v-col :cols="12" :sm="12" :md="12" :lg="12" :xl="12">
                                <rich-editor
                                    v-model="homework_desc"
                                ></rich-editor>
                            </v-col>
                            <v-col :cols="12">
                                <v-btn color="primary">发布</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-tab-item>
                <v-tab-item :key="1">
                    <v-container>
                        321
                    </v-container>
                </v-tab-item>
                <v-tab-item :key="2">
                    <v-container>
                        456
                    </v-container>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-container>
</template>

<script>
import RichEditor from '../components/common/RichEditor.vue'

export default {
    components : { RichEditor },
    data : () => ({
        current_tab : '',
        tabs : ['发布作业', '作业列表',  '我的班级'],
        classes : ['计通-A', '计通-B', '物电-A'],
        target_class : '',
        homework_desc : 'www',
        end_at : '',
        date_picker_menu : false
    }),
    watch : {
        
    },
    computed : {
        
    },
    methods : {
        
    },
    async mounted(){
        
    }
}
</script>

<style scoped>
    
</style>