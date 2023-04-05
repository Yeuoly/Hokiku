<template>
    <v-container>
        <v-row>
            <v-col :cols="12">
                <v-data-table
                    :headers="sheet_header"
                    :items="sheets"
                    :options.sync="options"
                    :items-per-page="10"
                    :footer-props="{
                        'items-per-page-options': [10, 20, 30, 40, 50, 100]
                    }"
                >
                    <template v-slot:item.status="{ item }">
                        <v-chip v-if="(item.flag & 4) == 4" color="orange" dark>审核中</v-chip>
                        <v-chip v-if="(item.flag & 8) == 8" color="green" dark>已通过</v-chip>
                    </template>
                    <template v-slot:item.time="{ item }">
                        {{ new Date(item.time * 1000).formatDate("Y-M-D h:m:s") }}
                    </template>
                    <template v-slot:item.action="{ item }">
                        <v-btn
                            color="primary"
                            @click="updateCourseSheet(item.id, item.name, item.cover_rid)"
                            :disabled="(item.flag & 4) != 4"
                        >
                            通过
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from '../../concat/bus';
import {
    api_course_sheet_list_admin,
    api_course_sheet_update_admin
} from '../../interface/course'

export default {
    data : () => ({
        sheet_header : [{
            text : '课程集名称',
            value : 'name'
        }, {
            text : '状态',
            value : 'status'
        }, {
            text : '创建时间',
            value : 'time'
        }, {
            text : '操作',
            value : 'action'
        }],
        sheets : [],
        options : {},
    }),
    methods : {
        async getCourseSheetList() {
            const { data } = await api_course_sheet_list_admin(this.options.page, 20);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    this.sheets = data['data']['sheets'];
                }
            }
        },
        async updateCourseSheet(sheet_id, sheet_name, cover_rid) {
            const { data } = await api_course_sheet_update_admin(sheet_id, sheet_name, cover_rid, true);
            if (!data) {
                openErrorMessageBox('错误', '网络异常');
            } else {
                if (data['res'] != 0) {
                    openErrorMessageBox('错误', data['err']);
                } else {
                    openInfoMessageBox('提示', '操作成功');
                    this.getCourseSheetList();
                }
            }
        }
    },
    mounted() {
        this.getCourseSheetList();
    }
}
</script>

<style>

</style>