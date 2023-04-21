<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        编辑题单
                    </v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="name"
                            label="题单名称"
                            outlined
                            dense
                            :rules="[v => !!v || '题单名称不能为空']"
                        ></v-text-field>
                        <v-textarea
                            v-model="comment"
                            label="题单描述"
                            outlined
                            dense
                        ></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            color="primary"
                            @click="commit"
                        >提交</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        题目列表
                    </v-card-title>
                    <v-card-text>
                        <v-select
                            v-model="current_train_id"
                            label="题目"
                            :items="train_list"
                            item-text="title"
                            item-value="id"
                            outlined
                            dense
                        ></v-select>
                        <v-btn
                            color="primary"
                            @click="add"
                        >添加</v-btn>
                    </v-card-text>
                    <v-data-table
                        :headers="train_headers"
                        :items="sheet_items"
                        class="elevation-1"
                    >
                        <template v-slot:item.action="{ item }">
                            <v-btn
                                color="primary"
                                @click="remove(item)"
                            >
                                <v-icon>mdi-delete</v-icon>
                                <span>删除</span>
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus';
import {
    api_organization_manage_train_sheet_create,
    api_organization_manage_train_sheet_update,
    api_organization_manage_train_sheet_add,
    api_organization_manage_train_sheet_remove,
    api_organization_train_sheet_detail,
    api_organization_manage_train_list
} from '../../interface/organization'

export default {
    data : () => ({
        gid : 0,
        id : 0,
        name : '',
        comment : '',
        train_list : [],
        sheet_items : [],
        current_train_id : 0,
        train_headers : [
            { text: '题目ID', value: 'id' },
            { text: '题目名称', value: 'title' },
            { text: '题目描述', value: 'comment' },
            { text: '作者', value: 'author' },
            { text: '操作', value: 'action', sortable: false },
        ]
    }),
    methods : {
        commit() {
            if (this.id == 0) {
                this.create()
            } else {
                this.update()
            }
        },
        async create() {
            const { data } = await api_organization_manage_train_sheet_create(this.gid, this.name, this.comment);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            this.$router.back()
        },
        async update() {
            const { data } = await api_organization_manage_train_sheet_update(this.gid, this.id, this.name, this.comment);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            openSuccessSnackbar('修改成功');
        },
        async add() {
            const { data } = await api_organization_manage_train_sheet_add(this.gid, this.id, this.current_train_id);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            openSuccessSnackbar('添加成功');
            this.getSheetDetail()
        },
        async remove(item) {
            const { data } = await api_organization_manage_train_sheet_remove(this.gid, this.id, item.id);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            openSuccessSnackbar('删除成功');
            this.getSheetDetail()
        },
        async getSheetDetail() {
            const { data } = await api_organization_train_sheet_detail(this.gid, this.id);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            this.sheet_items = data['data']['list'] || [];
            this.name = data['data']['sheet']['name'];
            this.comment = data['data']['sheet']['comment'];
        },
        async getTrainList() {
            const { data } = await api_organization_manage_train_list(this.gid, 1, 1000);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            this.train_list = data['data']['list'] || [];
        },
    },
    mounted() {
        this.gid = parseInt(this.$route.params.gid);
        this.id = parseInt(this.$route.params.sid);
        if (!this.gid) {
            this.$router.back()
            return
        }
        this.getTrainList()
        if (this.id == 0) {
            return
        }
        this.getSheetDetail()
    }
}
</script>

<style>

</style>