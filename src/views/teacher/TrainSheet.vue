<template>
    <v-container>
        <v-row>
            <v-col :cols="12">
                <v-btn
                    color="primary"
                    @click="create"
                >
                    <v-icon>mdi-plus</v-icon>
                    <span>新建题单</span>
                </v-btn>
            </v-col>
        </v-row>
        <v-data-table
            :headers="headers"
            :items="list"
        >
            <template v-slot:item.action="{ item }">
                <v-btn
                    color="primary"
                    @click="$router.push(`/teacher/question/${gid}/sheet/${item.id}/editor`)"
                >
                    <v-icon>mdi-pencil</v-icon>
                    <span>编辑</span>
                </v-btn>
            </template>
            <template v-slot:item.time="{ item }">
                {{ new Date(item.time * 1000).toLocaleString() }}
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { openErrorSnackbar } from '../../concat/bus';
import {
    api_organization_train_sheet_list
} from '../../interface/organization'

export default {
    data : () => ({
        headers : [{
            text : 'ID',
            value : 'id'
        }, {
            text : '题单',
            value : 'name'
        }, {
            text : '描述',
            value : 'comment'
        }, {
            text : '创建时间',
            value : 'time'
        }, {
            text : '操作',
            value : 'action'
        }],
        gid : 0,
        list : []
    }),
    methods : {
        create() {
            this.$router.push(`/teacher/question/${this.gid}/sheet/0/editor`)
        },
        async load() {
            const { data } = await api_organization_train_sheet_list(this.gid);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }

            this.list = data['data']['list'] || []
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