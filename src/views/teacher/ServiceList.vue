<template>
    <v-container>
        <v-row>
            <v-col :cols="12">
                <v-btn
                    color="primary"
                    @click="create"
                >
                    <v-icon>mdi-plus</v-icon>
                    <span>新建渗透测试</span>
                </v-btn>
            </v-col>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="list"
        >
            <template v-slot:item.action="{ item }">
                <v-btn
                    text
                    small
                    color="primary"
                    @click="$router.push(`/teacher/service/${gid}/${item.id}/editor`)"
                >
                    <v-icon>mdi-pencil</v-icon>
                    <span>编辑</span>
                </v-btn>
                <v-btn
                    dark
                    text
                    color="red"
                    small
                    @click="deleteService(item.id)"
                >
                    <v-icon>mdi-delete</v-icon>
                    <span>删除</span>
                </v-btn>
                <v-btn
                    dark
                    text
                    small
                    color="green"
                    @click="makeServicePublic(item.id)"
                >
                    <v-icon>mdi-lock-open</v-icon>
                    <span>公开</span>
                </v-btn>
                <v-btn
                    dark
                    text
                    small
                    color="red"
                    @click="makeServicePrivate(item.id)"
                >
                    <v-icon>mdi-lock</v-icon>
                    <span>取消公开</span>
                </v-btn>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus';
import {
    api_comp_service_list,
    api_comp_service_delete,
    api_comp_service_make_public,
    api_comp_service_make_private
} from '../../interface/service'

export default {
    data : () => ({
        headers : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '题名',
            value : 'name'
        }, {
            text : '描述',
            value : 'description'
        }, {
            text : '容器数量',
            value : 'container_count'
        }, {
            text : '网络数量',
            value : 'network_count'
        }, {
            text : 'flag数量',
            value : 'flag_count'
        }, {   
            text : '分数',
            value : 'score'
        }, {
            text : '操作',
            value : 'action',
            align : 'center'
        }],
        gid : 0,
        list : []
    }),
    methods : {
        create() {
            this.$router.push(`/teacher/service/${this.gid}/0/editor`)
        },
        async load() {
            const { data } = await api_comp_service_list(this.gid);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }

            this.list = data['data']['services'] || []
        },
        async deleteService(id) {
            const { data } = await api_comp_service_delete(id);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }

            this.load()
        },
        async makeServicePublic(id) {
            const { data } = await api_comp_service_make_public(id);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }

            openSuccessSnackbar('公开成功')

            this.load()
        },
        async makeServicePrivate(id) {
            const { data } = await api_comp_service_make_private(id);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }

            openSuccessSnackbar('取消公开成功')

            this.load()
        }
    },
    mounted() {
        this.gid = parseInt(this.$route.params.gid)
        if(!this.gid) {
            this.$router.back()
            return
        }
        this.load()
    }
}
</script>

<style>

</style>