<template>
    <v-container>
        <v-row>
            <v-col :cols="6">
                <v-card>
                    <v-card-title>
                        <v-text-field
                            v-model="name"
                            label="课程集名称"
                            outlined
                        ></v-text-field>
                    </v-card-title>
                    <v-card-text>
                        <UploadImage
                            v-model="cover_id"
                            :height="300"
                        ></UploadImage>
                        <v-checkbox
                            v-model="is_public"
                            v-if="!is_create"
                            label="是否公开"
                        ></v-checkbox>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            color="primary"
                            @click="submit"
                        >
                            {{ is_create ? '创建' : '更新' }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col :cols="6" v-if="!is_create">
                <v-row>
                    <v-col :cols="12">
                        <v-card-text>
                            <v-text-field
                                dense
                                v-model="new_unit.name"
                                label="课程名称"
                                outlined
                            ></v-text-field>
                            <v-select
                                dense
                                v-model="new_unit.course"
                                :items="select_course"
                                item-text="name"
                                item-value="id"
                                label="课程"
                                outlined
                            ></v-select>
                            <v-btn
                                color="primary"
                                @click="createUnit()"
                            >
                                添加课程
                            </v-btn>
                        </v-card-text>
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col :cols="12">
                        <h3>
                            课程列表
                        </h3>
                    </v-col>
                    <v-col :cols="12">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col :cols="12" v-for="(i, k) in units" :key="k">
                        <v-row>
                            <v-col :cols="4">
                                <v-img :src="i.r_cover.url" :height="140"></v-img>
                            </v-col>
                            <v-col :cols="8">
                                <div>
                                    {{ i.title }}
                                </div>
                                <div class="text-grey text-14">
                                    发布时间 {{ new Date(i.time * 1000).toLocaleString() }}
                                </div>
                                <div class="py2">
                                    <v-btn @click="deleteCourseSheetUnit(i.id)" color="red" dark>
                                        删除
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorMessageBox } from '../../concat/bus';
import {
    api_course_sheet_create,
    api_course_sheet_update,
    api_course_sheet_get,
    api_course_sheet_list_unit,
    api_course_sheet_unit_create,
    api_course_sheet_unit_delete,
    api_course_list_own,
} from '../../interface/course'

import UploadImage from '../../components/common/UploadImage.vue'

export default {
    components : {
        UploadImage
    },
    data : () => ({
        sheet_id : 0,
        name : '',
        course : [],
        cover_id : 0,
        is_public : false,
        new_unit : {
            course : '',
            name : ''
        },
        units : []
    }),
    computed : {
        is_create() {
            return this.sheet_id == 0;
        },
        select_course() {
            return this.course.map(i => {
                return `${i.id}:${i.title}`
            })
        }
    },
    methods : {
        async createUnit() {
            const course_id = this.new_unit.course.split(':')[0];
            const { data } = await api_course_sheet_unit_create(this.sheet_id, this.new_unit.name, course_id);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.loadUnits();
                }
            }
        },
        submit() {
            if (this.is_create) {
                this.createCourseSheet();
            } else {
                this.updateCourseSheet();
            }
        },
        async loadCourse() {
            const { data } = await api_course_list_own();
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.course = data['data'];
                }
            }
        },
        async loadCourseSheet() {
            const { data } = await api_course_sheet_get(this.sheet_id);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.name = data['data']['sheet']['name'];
                    this.cover_id = data['data']['sheet']['cover_id'];
                    this.is_public = (data['data']['sheet']['flag'] & (8 | 4)) != 0
                }
            }
        },
        async createCourseSheet() {
            const { data } = await api_course_sheet_create(this.name, this.cover_id);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.$router.push(`/teacher/course/sheet`);
                }
            }
        },
        async updateCourseSheet() {
            const { data } = await api_course_sheet_update(this.sheet_id, this.name, this.cover_id, this.is_public);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.$router.push({name : 'course_sheet'});
                }
            }
        },
        async loadUnits() {
            const { data } = await api_course_sheet_list_unit(this.sheet_id, 1, 100);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.units = data['data']['courses'] || [];
                }
            }
        },
        async createCourseSheetUnit() {
            const { data } = await api_course_sheet_unit_create(this.sheet_id, this.new_unit.name, this.new_unit.course_id);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.loadCourse();
                }
            }
        },
        async deleteCourseSheetUnit(id) {
            const { data } = await api_course_sheet_unit_delete(this.sheet_id, id);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.loadUnits();
                }
            }
        },
    },
    mounted() {
        this.sheet_id = parseInt(this.$route.params.sheet_id);
        if (this.sheet_id) {
            this.loadCourseSheet();
            this.loadUnits();
            this.loadCourse();
        }
    }
}
</script>

<style>

</style>