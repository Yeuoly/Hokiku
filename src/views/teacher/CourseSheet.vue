<template>
    <v-container>
        <v-row>
            <v-col :cols="3">
                <v-row>
                    <v-col :cols="12">
                        <v-list dense>
                            <v-list-item dense @click="toCreate">
                                <v-list-item-icon>
                                    <v-icon>mdi-plus-outline</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title class="text-grey">新建</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-divider></v-divider>
                            </v-list-item>
                            <v-list-item v-if="course_sheet.length == 0">
                                <v-list-item-content>
                                    <v-list-item-title class="text-grey">暂无课程集</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item dense v-for="(i, k) in course_sheet" :key="k" @click="select(k)">
                                <v-list-item-icon>
                                    <v-icon>mdi-folder-open</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{ i.name }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-divider vertical></v-divider>
                </v-row>
            </v-col>
            <v-col :cols="9">
                <v-card>
                    <v-card-text v-if="course_sheet.length > 0 && course_sheet[selected]">
                        <div style="width: calc(100% - 30px)">
                            <v-row>
                                <div style="width: 190px" class="px3">
                                    <v-img :src="course_sheet[selected].r_cover.extra"></v-img>
                                </div>
                                <div class="px3 text-16">
                                    <div class="px3 text-16">
                                        <span>{{ course_sheet[selected].name }}</span>
                                    </div>
                                    <div class="px3 text-14">
                                        创建时间：<span>{{ new Date(course_sheet[selected].time * 1000).toLocaleString() }}</span>
                                    </div>
                                    <div class="py2 px3">
                                        <v-btn color="primary" @click="toEdit(course_sheet[selected].id)">编辑</v-btn>
                                    </div>
                                </div>
                            </v-row>
                        </div>
                    </v-card-text>
                </v-card>
                <v-divider></v-divider>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus';
import {
    api_course_sheet_list_own,
} from '../../interface/course'

export default {
    data: () => ({
        course : [],
        course_sheet: [],
        page : 1,
        page_size : 20,
        selected : 0
    }),
    methods: {
        select(idx) {
            this.selected = idx;  
        },
        async loadCourseSheet() {
            const { data } = await api_course_sheet_list_own(this.page, this.page_size);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.course_sheet = data['data']['sheets'];
                }
            }
        },
        toCreate() {
            this.$router.push('/teacher/course/sheet/edit/0');
        },
        toEdit(id) {
            this.$router.push(`/teacher/course/sheet/edit/${id}`);
        }
    },
    mounted() {
        this.loadCourseSheet();
    },
}
</script>

<style>

</style>